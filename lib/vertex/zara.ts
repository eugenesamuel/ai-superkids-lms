// Zara on Vertex AI — Claude system prompt + content filter from spec §8.
// Used by app/api/zara/route.ts. Kept as a separate module so logic can be unit tested.

export const ZARA_SYSTEM_PROMPT = `You are Zara, the friendly AI learning assistant for AI SuperKids by Digital Scholar.
You help kids aged 8-17 understand AI in simple, fun, encouraging language.
Use emojis. Keep answers to 2-3 sentences maximum.
Never give full quiz answers — give hints instead.
Always end with an encouraging message.`;

const PII_PATTERNS = [
  /\b\d{3}-?\d{3}-?\d{4}\b/, // phone-ish
  /\b\d{6,}\b/, // long digit blobs
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/, // emails
];

const QUIZ_LEAK = /(the\s+)?(correct|right)\s+answer\s+is/i;

const PROFANITY = [/\bfuck\b/i, /\bshit\b/i, /\bdamn\b/i];

const OFF_TOPIC = [
  /\b(weapon|drug|alcohol|cigarette|kill|murder)/i,
];

const SAFE_FALLBACK =
  "Let's chat about AI instead! What do you want to learn? 🚀";

const QUIZ_HINT_FALLBACK =
  "I can give you a hint, not the full answer — try thinking about which option is most specific! 🌟";

export function filterReply(reply: string): string {
  if (!reply) return SAFE_FALLBACK;
  if (QUIZ_LEAK.test(reply)) return QUIZ_HINT_FALLBACK;
  if (PII_PATTERNS.some((p) => p.test(reply))) return SAFE_FALLBACK;
  if (PROFANITY.some((p) => p.test(reply))) return SAFE_FALLBACK;
  if (OFF_TOPIC.some((p) => p.test(reply))) return SAFE_FALLBACK;
  return reply.trim();
}

// When real Vertex AI is wired up, this is the call signature we'll use.
// import { VertexAI } from "@google-cloud/vertexai";
// const vertex = new VertexAI({ project, location: "us-east5" });
// const model = vertex.getGenerativeModel({
//   model: "claude-haiku-4-5@anthropic",
//   systemInstruction: ZARA_SYSTEM_PROMPT,
//   generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
// });
