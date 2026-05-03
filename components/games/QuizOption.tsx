"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type State = "idle" | "correct" | "wrong";

export function QuizOption({
  option,
  index,
  state,
  onPick,
  disabled,
}: {
  option: string;
  index: number;
  state: State;
  onPick: () => void;
  disabled?: boolean;
}) {
  const letters = ["A", "B", "C", "D"];
  const colors = ["#FF6B35", "#00D4FF", "#A855F7", "#00E676"];

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onPick}
      whileHover={!disabled ? { y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      animate={
        state === "wrong"
          ? { x: [0, -8, 8, -8, 8, 0] }
          : state === "correct"
            ? { scale: [1, 1.05, 1] }
            : undefined
      }
      transition={{ duration: 0.4 }}
      className={cn(
        "relative w-full text-left rounded-2xl p-5 border-2 transition-all flex items-center gap-4",
        state === "correct" && "bg-neon-green/15 border-neon-green",
        state === "wrong" && "bg-ds-orange/10 border-ds-orange/40",
        state === "idle" && "bg-white border-space-navy/10 hover:border-ds-orange",
        disabled && state === "idle" && "opacity-60",
      )}
    >
      <span
        className="grid place-items-center w-10 h-10 rounded-full font-display text-white text-lg shrink-0"
        style={{ background: colors[index % 4] }}
      >
        {letters[index] ?? index + 1}
      </span>
      <span className="font-body text-base text-space-navy">{option}</span>
      {state === "correct" && (
        <span className="absolute top-2 right-3 text-xs font-display text-neon-green">
          ⭐ You got it!
        </span>
      )}
      {state === "wrong" && (
        <span className="absolute top-2 right-3 text-xs font-display text-ds-orange">
          Try again!
        </span>
      )}
    </motion.button>
  );
}
