"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BadgeCard } from "@/components/lms/BadgeCard";
import { BADGES, type Badge } from "@/lib/badges";
import { mockEarnedBadges } from "@/lib/mock-data";

export default function AchievementsPage() {
  const [open, setOpen] = useState<Badge | null>(null);
  const earned = mockEarnedBadges.length;

  return (
    <div className="px-6 py-6 space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Achievements
          </h2>
          <p className="text-space-navy/60 mt-0.5 text-sm">
            Earn badges by completing missions, submitting projects, and showing up.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 font-display">
          <span className="text-ds-orange font-bold text-lg tabular-nums">{earned}</span>
          <span className="text-space-navy/55 text-sm">of {BADGES.length} earned</span>
        </span>
      </div>

      <div className="kid-card p-5 sm:p-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {BADGES.map((b) => {
            const got = mockEarnedBadges.find((e) => e.id === b.id);
            return (
              <BadgeCard
                key={b.id}
                badge={b}
                earned={Boolean(got)}
                earnedAt={got?.earnedAt}
                onClick={() => setOpen(b)}
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white rounded-2xl p-6 shadow-2xl"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-space-navy/5 tap-scale"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center">
                <BadgeCard
                  badge={open}
                  earned={Boolean(mockEarnedBadges.find((e) => e.id === open.id))}
                />
                <p className="font-display text-sm text-space-navy/70 mt-2">
                  {open.description}
                </p>
                <p className="text-xs text-space-navy/40 mt-3 font-body">
                  How to earn: {open.trigger}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
