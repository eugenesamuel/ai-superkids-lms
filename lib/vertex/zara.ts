// Zara on Vertex AI — Claude system prompt + content filter from spec §8.

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

export type ZaraResult = { reply: string; via: "vertex" | "mock" };

const VERTEX_MODELS_TO_TRY = [
  "claude-haiku-4-5@20251001",
  "claude-3-5-haiku@20241022",
  "claude-3-5-haiku-v2@20241022",
];

let cachedClient: unknown = null;

async function getVertexClient() {
  if (cachedClient) return cachedClient;
  const { AnthropicVertex } = await import("@anthropic-ai/vertex-sdk");
  const project = process.env.GCP_PROJECT_ID;
  const region = process.env.VERTEX_AI_LOCATION ?? "us-east5";
  if (!project) throw new Error("GCP_PROJECT_ID not set");
  cachedClient = new AnthropicVertex({ projectId: project, region });
  return cachedClient;
}

/**
 * Calls Claude on Vertex AI. Returns null on failure (caller uses mock fallback).
 */
export async function callZara(message: string): Promise<string | null> {
  if (!process.env.GCP_PROJECT_ID) return null;
  try {
    const client = await getVertexClient();
    for (const model of VERTEX_MODELS_TO_TRY) {
      try {
        const response = await (client as {
          messages: {
            create: (args: unknown) => Promise<{
              content: Array<{ type: string; text?: string }>;
            }>;
          };
        }).messages.create({
          model,
          system: ZARA_SYSTEM_PROMPT,
          max_tokens: 200,
          messages: [{ role: "user", content: message }],
        });
        const text = response.content
          .filter((b) => b.type === "text")
          .map((b) => b.text ?? "")
          .join("")
          .trim();
        if (text) return text;
      } catch (err) {
        // Try next model name. Most likely error: model not enabled / region mismatch.
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("404") || msg.includes("not found") || msg.includes("NOT_FOUND")) {
          continue;
        }
        throw err;
      }
    }
    return null;
  } catch (err) {
    console.error("[zara] vertex call failed:", err);
    return null;
  }
}
