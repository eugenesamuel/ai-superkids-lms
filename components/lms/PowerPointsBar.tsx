"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { getLevel, progressInLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";

export function PowerPointsBar({
  pp,
  className,
  compact,
  variant = "dark",
}: {
  pp: number;
  className?: string;
  compact?: boolean;
  variant?: "dark" | "light";
}) {
  const lvl = getLevel(pp);
  const { percent } = progressInLevel(pp);
  const isLight = variant === "light";

  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(pp);
  }, [pp, spring]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "grid place-items-center w-9 h-9 rounded-full",
          isLight ? "bg-ds-orange/15 border border-ds-orange/30" : "bg-ds-orange/20 border border-ds-orange/40",
        )}
      >
        <Sparkles className="w-4 h-4 text-ds-orange" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 leading-tight">
          <motion.span
            className={cn(
              "font-display text-base",
              isLight ? "text-space-navy" : "text-white",
            )}
          >
            {display}
          </motion.span>
          {!compact && (
            <span
              className={cn(
                "text-[10px] uppercase tracking-wide font-display",
                isLight ? "text-space-navy/60" : "text-white/60",
              )}
            >
              {lvl.title}
            </span>
          )}
        </div>
        <div
          className={cn(
            "mt-1 h-1.5 w-full rounded-full overflow-hidden",
            isLight ? "bg-space-navy/10" : "bg-white/10",
          )}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-ds-orange to-electric-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
