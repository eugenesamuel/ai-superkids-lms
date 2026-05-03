"use client";

import { motion } from "framer-motion";

export function ProgressRing({ percent, size = 160 }: { percent: number; size?: number }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(26,26,46,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-4xl text-space-navy tabular-nums">
            {percent}%
          </p>
          <p className="text-xs uppercase tracking-wider text-space-navy/50">
            Done
          </p>
        </div>
      </div>
    </div>
  );
}

export function ParentStatsCard({
  childName,
  progressPercent,
  lastActiveLabel,
  sessionsThisWeek,
  totalSessions,
  streakDays,
}: {
  childName: string;
  progressPercent: number;
  lastActiveLabel: string;
  sessionsThisWeek: number;
  totalSessions: number;
  streakDays: number;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-space-navy/5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <ProgressRing percent={progressPercent} />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          <Stat label="Last active" value={lastActiveLabel} />
          <Stat label="This week" value={`${sessionsThisWeek} sessions`} />
          <Stat label="Streak" value={`${streakDays} days`} />
          <Stat label="Total sessions" value={`${totalSessions}`} />
          <Stat label="Explorer" value={childName} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-space-navy/40 font-display">
        {label}
      </p>
      <p className="font-display text-base text-space-navy mt-0.5">{value}</p>
    </div>
  );
}
