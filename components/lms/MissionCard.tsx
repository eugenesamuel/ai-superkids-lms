"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Lock, PlayCircle, Radio } from "lucide-react";
import type { Mission } from "@/lib/types";
import { cn, timeUntil } from "@/lib/utils";

function statusBadge(mission: Mission) {
  if (mission.status === "completed")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neon-green/15 text-neon-green text-xs font-display">
        <CheckCircle2 className="w-3.5 h-3.5" /> Done!
      </span>
    );
  if (mission.status === "locked")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-space-navy/5 text-space-navy/40 text-xs font-display">
        <Lock className="w-3.5 h-3.5" /> Locked
      </span>
    );
  // available — could be live coming up or recording ready
  if (mission.scheduledAt && new Date(mission.scheduledAt).getTime() > Date.now()) {
    const t = timeUntil(new Date(mission.scheduledAt));
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-electric-cyan/15 text-electric-cyan text-xs font-display">
        <Radio className="w-3.5 h-3.5 animate-pulse" /> Live in {t.days > 0 ? `${t.days}d` : `${t.hours}h ${t.minutes}m`}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ds-orange/15 text-ds-orange text-xs font-display">
      <PlayCircle className="w-3.5 h-3.5" /> Start Now
    </span>
  );
}

export function MissionCard({ mission, isCurrent }: { mission: Mission; isCurrent?: boolean }) {
  const isLocked = mission.status === "locked";
  const inner = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={!isLocked ? { x: 4 } : undefined}
      className={cn(
        "relative kid-card p-5",
        isCurrent && "border-l-[6px] border-l-ds-orange shadow-glow",
        isLocked && "opacity-65",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-ds-orange font-display mb-1">
            Mission {mission.orderIndex}
          </p>
          <h3 className="font-display text-lg sm:text-xl text-space-navy leading-tight">
            {mission.title}
          </h3>
          <p className="text-sm text-space-navy/65 mt-1.5 leading-snug">
            {mission.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-space-navy/55 font-body">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {mission.durationMins} min
            </span>
            <span className="inline-flex items-center gap-1 font-display text-ds-orange">
              ⚡ +{mission.xpReward} PP
            </span>
          </div>
        </div>
        <div className="shrink-0">{statusBadge(mission)}</div>
      </div>
    </motion.div>
  );

  if (isLocked) return inner;
  return (
    <Link href={`/lesson/${mission.id}`} className="block tap-scale">
      {inner}
    </Link>
  );
}
