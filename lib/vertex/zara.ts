// Zara on Vertex AI — Claude (preferred) with Gemini fallback. Spec §8.

export const ZARA_SYSTEM_PROMPT = `You are Zara, the friendly AI learning assistant for AI SuperKids by Digital Scholar.
You help kids aged 9-17 understand AI in simple, fun, encouraging language.
Use emojis. Keep answers to 2-3 sentences maximum.
Never give full quiz answers — give hints instead.
Always end with an encouraging message.
Stay on topic: AI, programming, prompt engineering, science, learning. If asked about anything off-topic (violence, romance, politics, harmful content), gently redirect to AI/learning topics.`;

const PII_PATTERNS = [
  /\b\d{3}-?\d{3}-?\d{4}\b/,
  /\b\d{6,}\b/,
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/,
];
const QUIZ_LEAK = /(the\s+)?(correct|right)\s+answer\s+is/i;
const PROFANITY = [/\bfuck\b/i, /\bshit\b/i, /\bdamn\b/i];
const OFF_TOPIC = [/\b(weapon|drug|alcohol|cigarette|kill|murder|sex)/i];

const SAFE_FALLBACK = "Let's chat about AI instead! What do you want to learn? 🚀";
const QUIZ_HINT_FALLBACK =
  "I can give you a hint, not the full answer — try thinking about which option is most specific! 🌟";

export function filterReply(reply: string): string {
  if (!reply) return SAFE_FALLBACK;
  const trimmed = reply.trim();
  if (QUIZ_LEAK.test(trimmed)) return QUIZ_HINT_FALLBACK;
  if (PII_PATTERNS.some((p) => p.test(trimmed))) return SAFE_FALLBACK;
  if (PROFANITY.some((p) => p.test(trimmed))) return SAFE_FALLBACK;
  if (OFF_TOPIC.some((p) => p.test(trimmed))) return SAFE_FALLBACK;
  return trimmed;
}

const CLAUDE_MODELS = [
  "claude-haiku-4-5@20251001",
  "claude-3-5-haiku@20241022",
];

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-002",
];

let cachedClaude: unknown = null;
let cachedGemini: unknown = null;

async function tryClaude(message: string): Promise<string | null> {
  try {
    if (!cachedClaude) {
      const { AnthropicVertex } = await import("@anthropic-ai/vertex-sdk");
      cachedClaude = new AnthropicVertex({
        projectId: process.env.GCP_PROJECT_ID!,
        region: process.env.VERTEX_AI_LOCATION ?? "us-east5",
      });
    }
    for (const model of CLAUDE_MODELS) {
      try {
        const r = await (cachedClaude as {
          messages: {
            create: (a: unknown) => Promise<{ content: Array<{ type: string; text?: string }> }>;
          };
        }).messages.create({
          model,
          system: ZARA_SYSTEM_PROMPT,
          max_tokens: 200,
          messages: [{ role: "user", content: message }],
        });
        const text = r.content
          .filter((b) => b.type === "text")
          .map((b) => b.text ?? "")
          .join("")
          .trim();
        if (text) return text;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("404") ||
          msg.includes("NOT_FOUND") ||
          msg.includes("not found") ||
          msg.includes("PERMISSION") ||
          msg.includes("not authorized")
        ) {
          continue; // try next model / fall through to Gemini
        }
        throw err;
      }
    }
  } catch (err) {
    console.warn("[zara] Claude unavailable:", err instanceof Error ? err.message : err);
  }
  return null;
}

async function tryGemini(message: string): Promise<string | null> {
  try {
    if (!cachedGemini) {
      const mod = await import("@google-cloud/vertexai");
      cachedGemini = new mod.VertexAI({
        project: process.env.GCP_PROJECT_ID!,
        location: process.env.VERTEX_AI_LOCATION ?? "us-central1",
      });
    }
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = (cachedGemini as {
          getGenerativeModel: (a: unknown) => {
            generateContent: (a: unknown) => Promise<{
              response: {
                candidates?: Array<{
                  content?: { parts?: Array<{ text?: string }> };
                }>;
              };
            }>;
          };
        }).getGenerativeModel({
          model: modelName,
          systemInstruction: ZARA_SYSTEM_PROMPT,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        });
        const r = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: message }] }],
        });
        const text = r.response.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("")
          .trim();
        if (text) return text;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("404") || msg.includes("NOT_FOUND") || msg.includes("not found")) {
          continue;
        }
        throw err;
      }
    }
  } catch (err) {
    console.warn("[zara] Gemini failed:", err instanceof Error ? err.message : err);
  }
  return null;
}

export async function callZara(message: string): Promise<{ reply: string; via: "claude" | "gemini" } | null> {
  if (!process.env.GCP_PROJECT_ID) return null;
  const claudeReply = await tryClaude(message);
  if (claudeReply) return { reply: claudeReply, via: "claude" };
  const geminiReply = await tryGemini(message);
  if (geminiReply) return { reply: geminiReply, via: "gemini" };
  return null;
}
