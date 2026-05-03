import { NextRequest, NextResponse } from "next/server";

// Spec §8 — Zara system prompt.
const ZARA_SYSTEM = `You are Zara, the friendly AI learning assistant for AI SuperKids by Digital Scholar.
You help kids aged 8-17 understand AI in simple, fun, encouraging language.
Use emojis. Keep answers to 2-3 sentences maximum.
Never give full quiz answers — give hints instead.
Always end with an encouraging message.`;

// Mock canned replies used when Vertex AI is not configured.
const MOCK: { match: RegExp; reply: string }[] = [
  { match: /what.*ai|what is ai/i, reply: "AI is like a super-smart helper that learns from tons of examples! Think of it as a robot brain that gets better the more it practices. 🤖" },
  { match: /prompt|how.*ask/i, reply: "A great prompt is clear and specific! Tell the AI exactly what you want, who it's for, and how long. You got this! ⚡" },
  { match: /quiz|answer/i, reply: "I can give you hints, not full answers — that's no fun! Try thinking about which option is most specific. 🌟" },
  { match: /help|stuck/i, reply: "No worries! Try breaking the problem into tiny steps. What's the very first thing you want to do? 💪" },
];

function mockReply(message: string): string {
  const hit = MOCK.find((m) => m.match.test(message));
  return hit?.reply ?? "Cool question! Try asking Eugene during the next live class — he'll love it. ⭐";
}

// Lightweight content filter — block anything that looks like PII or full quiz answers.
function safeReply(reply: string): string {
  if (/\b\d{3,}-?\d{3,}-?\d{3,}\b/.test(reply)) return "Let's chat about AI instead! What do you want to learn? 🚀";
  if (/correct answer is/i.test(reply)) return "I can give you a hint, not the full answer — try thinking about which option is most specific! 🌟";
  return reply;
}

export async function POST(req: NextRequest) {
  const { message } = (await req.json()) as { message?: string };
  if (!message || typeof message !== "string" || message.length > 500) {
    return NextResponse.json({ error: "Message required (under 500 chars)" }, { status: 400 });
  }

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.GCP_PROJECT_ID;

  if (useMock) {
    return NextResponse.json({ reply: safeReply(mockReply(message)) });
  }

  // ---- Real Vertex AI call (uncomment once @google-cloud/aiplatform is installed and creds are set) ----
  // const { VertexAI } = await import("@google-cloud/vertexai");
  // const vertex = new VertexAI({
  //   project: process.env.GCP_PROJECT_ID!,
  //   location: process.env.VERTEX_AI_LOCATION ?? "us-east5",
  // });
  // const model = vertex.getGenerativeModel({
  //   model: process.env.VERTEX_AI_MODEL ?? "claude-haiku-4-5@anthropic",
  //   systemInstruction: ZARA_SYSTEM,
  //   generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
  // });
  // const result = await model.generateContent(message);
  // const reply = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hmm, ask me again? ✨";
  // // TODO: write log to Firestore /aiBuddyLogs
  // return NextResponse.json({ reply: safeReply(reply) });

  // Fallback if SDK not yet installed
  return NextResponse.json({ reply: safeReply(mockReply(message)) });
}

export const runtime = "nodejs";
