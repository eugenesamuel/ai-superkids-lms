"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Lock } from "lucide-react";
import type { Mission } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  mission: Mission;
  planetColor: string;
  topicCount?: number;
  trainer?: string;
};

export function MissionGridCard({
  mission,
  planetColor,
  topicCount = 4,
  trainer = "Eugene Samuel",
}: Props) {
  const isLocked = mission.status === "locked";
  const isCompleted = mission.status === "completed";
  const percent = isCompleted ? 100 : isLocked ? 0 : 40;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isLocked ? { y: -2 } : undefined}
      className={cn(
        "kid-card p-4 sm:p-5 transition-shadow h-full",
        !isLocked && "hover:shadow-md",
        isLocked && "opacity-60",
      )}
    >
      <div className="flex items-start gap-4">
        <CircularProgress percent={percent} color={planetColor} locked={isLocked} />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm sm:text-base text-space-navy leading-snug line-clamp-2">
            {mission.title}
          </p>
          <ul className="mt-2 space-y-1 text-xs text-space-navy/60">
            <li className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ds-orange shrink-0" />
                {topicCount} topics
              </span>
              <span className="text-space-navy/30">·</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan shrink-0" />
                {trainer}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-space-navy/40" />
              {mission.scheduledAt
                ? new Date(mission.scheduledAt).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Scheduled soon"}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 gap-3">
        <span className="inline-flex items-center gap-1 text-xs text-space-navy/55 font-display">
          <Clock className="w-3 h-3" />
          {mission.durationMins} min
        </span>
        {isLocked ? (
          <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-space-navy/40 px-3 py-1 rounded-full bg-neutral-100">
            <Lock className="w-3 h-3" />
            Locked
          </span>
        ) : isCompleted ? (
          <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-neon-green px-3 py-1 rounded-full bg-neon-green/10">
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-white bg-ds-orange px-4 py-1.5 rounded-full">
            Continue
          </span>
        )}
      </div>
    </motion.div>
  );

  if (isLocked) return inner;
  return (
    <Link href={`/lesson/${mission.id}`} className="block tap-scale h-full">
      {inner}
    </Link>
  );
}

function CircularProgress({
  percent,
  color,
  locked,
}: {
  percent: number;
  color: string;
  locked?: boolean;
}) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} stroke="rgba(26,26,46,0.08)" strokeWidth="5" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={r}
          stroke={locked ? "#CCC" : color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display font-bold text-sm text-space-navy">{percent}%</span>
      </div>
    </div>
  );
}
