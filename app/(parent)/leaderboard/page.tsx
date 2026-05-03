"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { LeaderboardRow } from "@/components/lms/LeaderboardRow";
import { RobotAvatar } from "@/components/lms/AvatarPicker";
import { mockLeaderboard, mockUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PODIUM_HEIGHTS = ["h-32", "h-24", "h-20"];
const PODIUM_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"week" | "all" | "batch">("all");

  const sorted = [...mockLeaderboard].sort((a, b) => b.powerPoints - a.powerPoints);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const youIdx = sorted.findIndex((u) => u.uid === mockUser.uid);
  const you = sorted[youIdx];

  return (
    <div className="px-6 py-6 space-y-5">
      <div>
        <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
          Leaderboard
        </h2>
        <p className="text-space-navy/60 mt-0.5 text-sm">
          Top explorers by Power Points across the program.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-white border border-neutral-200">
        {([
          ["week", "This Week"],
          ["all", "All Time"],
          ["batch", "My Batch"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "px-4 py-1.5 rounded-lg font-display font-semibold text-xs tap-scale transition-colors",
              tab === k ? "bg-ds-orange text-white" : "text-space-navy/65 hover:text-space-navy",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="kid-card p-5 sm:p-8">
        <div className="grid grid-cols-3 gap-3 items-end">
          {[1, 0, 2].map((sortIdx) => {
            const u = top3[sortIdx];
            if (!u) return <div key={sortIdx} />;
            const rank = sortIdx + 1;
            return (
              <motion.div
                key={u.uid}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: rank * 0.08 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-2">
                  <RobotAvatar id={u.avatarId} size={64} />
                  <span
                    className="absolute -top-1 -right-1 grid place-items-center w-7 h-7 rounded-full text-xs font-display font-bold text-white shadow-md"
                    style={{ background: PODIUM_COLORS[rank - 1] }}
                  >
                    {rank}
                  </span>
                </div>
                <p className="font-display font-semibold text-space-navy text-sm leading-tight">{u.firstName}</p>
                <p className="text-xs text-space-navy/55">{u.city}</p>
                <p className="font-display font-bold text-ds-orange text-base flex items-center gap-1 mt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {u.powerPoints.toLocaleString()}
                </p>
                <div
                  className={cn("w-full rounded-t-2xl mt-2", PODIUM_HEIGHTS[rank - 1])}
                  style={{
                    background: `linear-gradient(180deg, ${PODIUM_COLORS[rank - 1]}, ${PODIUM_COLORS[rank - 1]}55)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {rest.map((u, i) => (
          <LeaderboardRow
            key={u.uid}
            entry={u}
            rank={i + 4}
            isYou={u.uid === mockUser.uid}
          />
        ))}
      </div>

      {you && youIdx > 9 && (
        <div className="sticky bottom-24 lg:bottom-4">
          <LeaderboardRow entry={you} rank={youIdx + 1} isYou />
        </div>
      )}

      <p className="flex items-center justify-center gap-1 text-xs text-space-navy/45 font-body pt-2">
        <Lock className="w-3 h-3" />
        Only first names and city are shown — full name and email stay private.
      </p>
    </div>
  );
}
