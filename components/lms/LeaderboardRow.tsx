"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";
import { RobotAvatar } from "./AvatarPicker";
import { cn } from "@/lib/utils";

const PODIUM_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export function LeaderboardRow({
  entry,
  rank,
  isYou,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isYou?: boolean;
}) {
  const podium = rank <= 3;

  return (
    <motion.div
      layout
      whileHover={{ x: 2 }}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-2xl border",
        isYou ? "bg-ds-orange/10 border-ds-orange shadow-glow" : "bg-white border-space-navy/5",
      )}
    >
      <span
        className="grid place-items-center w-9 h-9 rounded-full font-display text-white text-base shrink-0"
        style={{
          background: podium
            ? PODIUM_COLORS[rank - 1]
            : "linear-gradient(135deg, #1A1A2E, #3D3D5C)",
        }}
      >
        {rank}
      </span>
      <RobotAvatar id={entry.avatarId} size={40} />
      <div className="flex-1 min-w-0">
        <p className="font-display text-base text-space-navy leading-tight truncate">
          {entry.firstName} {isYou && <span className="text-ds-orange ml-1">(You!)</span>}
        </p>
        <p className="text-xs text-space-navy/60">
          {entry.city} · {entry.missionsDone} missions
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-display text-lg text-ds-orange flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          {entry.powerPoints.toLocaleString()}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-space-navy/40">
          Power Points
        </p>
      </div>
    </motion.div>
  );
}
