"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";
import { RobotAvatar } from "./AvatarPicker";
import { cn } from "@/lib/utils";

export function RankingCard({
  entries,
  currentUid,
}: {
  entries: LeaderboardEntry[];
  currentUid: string;
}) {
  const sorted = [...entries].sort((a, b) => b.powerPoints - a.powerPoints);
  const top3 = sorted.slice(0, 3);
  const youIdx = sorted.findIndex((u) => u.uid === currentUid);
  const you = sorted[youIdx];

  function suffix(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return (
    <div className="kid-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-base text-space-navy">My ranking</h3>
        <Link
          href="/leaderboard"
          className="text-xs font-display text-ds-orange inline-flex items-center"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ul className="space-y-2.5">
        {you && youIdx > 2 && (
          <li
            key={you.uid}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-ds-orange/8 border border-ds-orange/20"
          >
            <RobotAvatar id={you.avatarId} size={32} />
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-space-navy">
                {you.firstName} <span className="text-ds-orange">(You)</span>
              </p>
            </div>
            <span className="font-display text-sm text-space-navy/70 tabular-nums">
              {suffix(youIdx + 1)}
            </span>
          </li>
        )}
        {top3.map((u, i) => (
          <li
            key={u.uid}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl",
              u.uid === currentUid && "bg-ds-orange/8 border border-ds-orange/20",
            )}
          >
            <RobotAvatar id={u.avatarId} size={32} />
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-space-navy truncate">
                {u.firstName}
                {u.uid === currentUid && <span className="text-ds-orange ml-1">(You)</span>}
              </p>
            </div>
            <span className="font-display text-sm text-space-navy/70 tabular-nums">
              {suffix(i + 1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
