"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Radio, Calendar } from "lucide-react";
import type { LiveClass } from "@/lib/types";
import { timeUntil } from "@/lib/utils";

export function LiveClassCountdown({ liveClass }: { liveClass: LiveClass | null }) {
  const [, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!liveClass) {
    return (
      <div className="kid-card p-5 text-space-navy/60 text-sm">
        No live class scheduled. Eugene will add the next session soon!
      </div>
    );
  }

  const target = new Date(liveClass.scheduledAt);
  const t = timeUntil(target);
  const withinJoinWindow = t.totalMs <= 1000 * 60 * 15 && t.totalMs > -1000 * 60 * 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6 border border-electric-cyan/30 shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, #E0F7FF 0%, #FFF3EE 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="grid place-items-center w-7 h-7 rounded-full bg-electric-cyan/20">
          <Radio className="w-3.5 h-3.5 text-electric-cyan animate-pulse" />
        </span>
        <span className="font-display text-electric-cyan text-xs uppercase tracking-wider">
          Next Live Class
        </span>
      </div>
      <h3 className="font-display text-xl sm:text-2xl text-space-navy leading-tight">
        {liveClass.title}
      </h3>
      <p className="flex items-center gap-2 text-space-navy/65 text-sm mt-1">
        <Calendar className="w-3.5 h-3.5" />
        {target.toLocaleString(undefined, {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          month: "short",
          day: "numeric",
        })}
      </p>

      {/* countdown */}
      <div className="grid grid-cols-4 gap-2 mt-4 max-w-md">
        {[
          { v: t.days, l: "days" },
          { v: t.hours, l: "hrs" },
          { v: t.minutes, l: "min" },
          { v: t.seconds, l: "sec" },
        ].map(({ v, l }) => (
          <div
            key={l}
            className="bg-white rounded-2xl py-2.5 text-center border border-space-navy/5 shadow-sm"
          >
            <p className="font-display text-2xl text-space-navy tabular-nums">
              {String(v).padStart(2, "0")}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-space-navy/50">{l}</p>
          </div>
        ))}
      </div>

      {withinJoinWindow ? (
        <Link
          href={liveClass.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center w-full sm:w-auto sm:px-8 py-3 rounded-2xl bg-ds-orange text-white font-display text-lg shadow-glow tap-scale animate-glow-pulse"
        >
          Join Live Class →
        </Link>
      ) : (
        <p className="mt-4 text-xs text-space-navy/50 font-body">
          ⏰ Join button appears 15 minutes before class starts.
        </p>
      )}
    </motion.div>
  );
}
