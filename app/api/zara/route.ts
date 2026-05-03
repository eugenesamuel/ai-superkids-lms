import { NextRequest, NextResponse } from "next/server";
import { callZara, filterReply } from "@/lib/vertex/zara";

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

export async function POST(req: NextRequest) {
  const { message } = (await req.json()) as { message?: string };
  if (!message || typeof message !== "string" || message.length > 500) {
    return NextResponse.json({ error: "Message required (under 500 chars)" }, { status: 400 });
  }

  // Vertex AI: tries Claude first (when subscribed on Marketplace), then Gemini
  // (always available in any GCP project), then falls back to mock canned replies.
  if (process.env.GCP_PROJECT_ID) {
    const real = await callZara(message);
    if (real) {
      return NextResponse.json({ reply: filterReply(real.reply), via: real.via });
    }
  }

  return NextResponse.json({ reply: filterReply(mockReply(message)), via: "mock" });
}

export const runtime = "nodejs";
export const maxDuration = 30;
