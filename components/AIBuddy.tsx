"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles } from "lucide-react";

const RATE_LIMIT = 5;

type Message = { role: "user" | "zara"; text: string };

const STARTER_TIPS = [
  "Hey, I'm Zara! 🤖 What do you want to learn today?",
  "Ask me anything about AI! I'm here to help. ✨",
  "Stuck on a mission? Ask me for a hint! 🚀",
];

const MOCK_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /what.*ai|what is ai/i,
    reply:
      "AI is like a super-smart helper that learns from tons of examples! Think of it as a robot brain that gets better the more it practices. 🤖",
  },
  {
    match: /prompt|how.*ask/i,
    reply:
      "A great prompt is clear and specific! Tell the AI exactly what you want, who it's for, and how long it should be. You got this! ⚡",
  },
  {
    match: /quiz|answer/i,
    reply:
      "I can give you hints, but no full answers — that's no fun! Try thinking about which option is most specific. 🌟",
  },
  {
    match: /chatgpt|gemini|claude/i,
    reply:
      "Those are all AI assistants! They each have their own style. Try the same prompt in different ones to compare. 🚀",
  },
  {
    match: /help|stuck/i,
    reply:
      "No worries! Try breaking the problem into tiny steps. What's the first thing you're trying to do? 💪",
  },
];

function mockZaraReply(text: string): string {
  const hit = MOCK_REPLIES.find((r) => r.match.test(text));
  if (hit) return hit.reply;
  return "That's a cool question! Try asking your trainer Eugene during the next live class — he'll love it. ⭐";
}

export function AIBuddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "zara", text: STARTER_TIPS[0] },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const sentCount = messages.filter((m) => m.role === "user").length;
  const remaining = Math.max(0, RATE_LIMIT - sentCount);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || remaining === 0 || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      // Try real API first; fall back to mock if it fails
      const res = await fetch("/api/zara", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply: string };
        setMessages((m) => [...m, { role: "zara", text: data.reply }]);
      } else {
        setMessages((m) => [...m, { role: "zara", text: mockZaraReply(text) }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "zara", text: mockZaraReply(text) }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-ds-orange text-white shadow-glow animate-glow-pulse"
        aria-label="Open Zara AI Buddy"
      >
        <Bot className="w-7 h-7" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white flex flex-col shadow-2xl"
            >
              <header className="flex items-center justify-between p-4 border-b border-space-navy/5 bg-space-navy text-white">
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-ds-orange">
                    <Bot className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-display text-base">Zara</p>
                    <p className="text-xs text-white/60">Your AI buddy ✨</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 tap-scale"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-light-orange/30">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-sm leading-snug ${
                        m.role === "user"
                          ? "bg-ds-orange text-white"
                          : "bg-white text-space-navy border border-space-navy/5"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-white text-space-navy/60 rounded-2xl px-4 py-2.5 text-sm font-body">
                      <Sparkles className="inline w-3.5 h-3.5 mr-1 animate-pulse" />
                      thinking...
                    </div>
                  </div>
                )}
              </div>

              <footer className="p-3 border-t border-space-navy/5 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder={
                      remaining === 0
                        ? "You've used all 5 messages for this mission!"
                        : "Ask Zara anything..."
                    }
                    disabled={remaining === 0 || sending}
                    className="flex-1 rounded-full border-2 border-space-navy/10 px-4 py-2.5 font-body outline-none focus:border-ds-orange disabled:bg-space-navy/5 text-sm"
                  />
                  <button
                    onClick={send}
                    disabled={remaining === 0 || sending || !input.trim()}
                    className="grid place-items-center w-10 h-10 rounded-full bg-ds-orange text-white disabled:opacity-40 tap-scale"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-space-navy/40 mt-1.5 text-center font-body">
                  {remaining}/{RATE_LIMIT} messages left this mission
                </p>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
