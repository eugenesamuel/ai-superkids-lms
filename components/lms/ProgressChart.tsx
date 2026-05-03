"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ChevronRight } from "lucide-react";

type Bar = { week: string; completed: number; inProgress: number };

const DEFAULT_DATA: Bar[] = [
  { week: "1w", completed: 60, inProgress: 30 },
  { week: "2w", completed: 110, inProgress: 50 },
  { week: "3w", completed: 80, inProgress: 70 },
  { week: "4w", completed: 140, inProgress: 40 },
];

const CHART_HEIGHT = 160; // matches the chart container's pixel height

export function ProgressChart({ data = DEFAULT_DATA }: { data?: Bar[] }) {
  const max = Math.max(
    ...data.map((d) => d.completed + d.inProgress),
    200,
  );

  return (
    <div className="kid-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base text-space-navy flex items-center gap-1.5">
          Your progress
          <TrendingUp className="w-4 h-4 text-ds-orange" />
        </h3>
        <Link
          href="/dashboard/parent"
          className="text-xs font-display text-ds-orange inline-flex items-center"
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div
        className="flex items-end justify-around gap-3 border-b border-neutral-200 pt-2"
        style={{ height: CHART_HEIGHT }}
      >
        {data.map((d, i) => {
          const completedPx = (d.completed / max) * (CHART_HEIGHT - 8);
          const inProgressPx = (d.inProgress / max) * (CHART_HEIGHT - 8);
          return (
            <div key={d.week} className="flex flex-col items-center justify-end flex-1 max-w-[36px] h-full">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: inProgressPx }}
                transition={{ duration: 0.6, delay: i * 0.07 + 0.05 }}
                className="w-full rounded-t-md bg-ds-orange/30"
                style={{ minHeight: d.inProgress > 0 ? 4 : 0 }}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: completedPx }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="w-full rounded-b-md bg-ds-orange"
                style={{ minHeight: d.completed > 0 ? 4 : 0 }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-around mt-2">
        {data.map((d) => (
          <span key={d.week} className="text-xs text-space-navy/55 font-display">
            {d.week}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs font-display">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ds-orange" />
          <span className="text-space-navy/70">Completed</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ds-orange/30" />
          <span className="text-space-navy/70">In progress</span>
        </span>
      </div>
    </div>
  );
}
