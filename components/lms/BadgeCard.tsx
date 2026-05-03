"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { Badge } from "@/lib/badges";
import { cn } from "@/lib/utils";

type Props = {
  badge: Badge;
  earned: boolean;
  earnedAt?: string;
  size?: "sm" | "md";
  onClick?: () => void;
};

export function BadgeCard({ badge, earned, earnedAt, size = "md", onClick }: Props) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[badge.icon] ?? Icons.Award;
  const dim = size === "sm" ? "w-20 h-20" : "w-28 h-28 sm:w-32 sm:h-32";
  const iconSize = size === "sm" ? "w-8 h-8" : "w-12 h-12";

  return (
    <motion.button
      onClick={onClick}
      whileHover={earned ? { scale: 1.06 } : undefined}
      whileTap={{ scale: 0.96 }}
      initial={earned ? { scale: 0.5, opacity: 0 } : { opacity: 0.4 }}
      animate={earned ? { scale: 1, opacity: 1 } : { opacity: 0.4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-2xl text-center",
        earned ? "badge-unlocked" : "badge-locked",
      )}
    >
      <div
        className={cn(
          "grid place-items-center rounded-full border-2",
          dim,
        )}
        style={{
          background: earned
            ? `radial-gradient(circle at 30% 30%, ${badge.color}cc, ${badge.color}55)`
            : "#1A1A2E",
          borderColor: earned ? badge.color : "#666",
          boxShadow: earned ? `0 0 16px ${badge.color}66` : "none",
        }}
      >
        <Icon className={cn(iconSize, "text-white")} />
      </div>
      <p className="font-display text-sm text-space-navy leading-tight">{badge.name}</p>
      {size === "md" && (
        <p className="text-xs text-space-navy/60 leading-snug">
          {earned ? badge.description : badge.trigger}
        </p>
      )}
      {earned && earnedAt && size === "md" && (
        <p className="text-[10px] text-space-navy/40 font-body">
          Earned {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </motion.button>
  );
}
