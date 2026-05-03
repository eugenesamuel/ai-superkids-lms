// Zara on Vertex AI — Gemini.
// Uses ADC from the runtime SA on Cloud Run. No API key required.

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

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-002",
];

let cachedClient: unknown = null;

async function getGeminiClient() {
  if (cachedClient) return cachedClient;
  const mod = await import("@google-cloud/vertexai");
  cachedClient = new mod.VertexAI({
    project: process.env.GCP_PROJECT_ID!,
    location: process.env.VERTEX_AI_LOCATION ?? "us-central1",
  });
  return cachedClient;
}

async function tryDirectGeminiApi(message: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  for (const modelName of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: ZARA_SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
          }),
        },
      );
      if (!res.ok) {
        if (res.status === 404 || res.status === 400) continue;
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("")
        .trim();
      if (text) return text;
    } catch (err) {
      console.warn("[zara] direct Gemini API failed:", err instanceof Error ? err.message : err);
    }
  }
  return null;
}

export async function callZara(
  message: string,
): Promise<{ reply: string; via: "gemini-vertex" | "gemini-api" } | null> {
  // Prefer Vertex AI (uses runtime SA, no key needed). Fall back to direct API key.
  if (process.env.GCP_PROJECT_ID) {
    try {
      const client = await getGeminiClient();
      for (const modelName of GEMINI_MODELS) {
        try {
          const model = (client as {
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
          if (text) return { reply: text, via: "gemini-vertex" };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes("404") || msg.includes("NOT_FOUND") || msg.includes("not found")) {
            continue;
          }
          throw err;
        }
      }
    } catch (err) {
      console.warn("[zara] Vertex AI failed, trying direct API:", err instanceof Error ? err.message : err);
    }
  }
  // Fallback: direct Gemini API with API key
  const apiReply = await tryDirectGeminiApi(message);
  if (apiReply) return { reply: apiReply, via: "gemini-api" };
  return null;
}
