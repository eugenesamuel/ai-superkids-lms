"use client";

import { cn } from "@/lib/utils";

// GitHub-style activity heatmap. Days array oldest -> newest.
export function StreakCalendar({ days }: { days: number[] }) {
  // We render 10 columns (weeks) x 7 rows (days) — 70 cells.
  const cells = [...days];
  while (cells.length < 70) cells.push(0);
  const padded = cells.slice(-70);

  return (
    <div className="space-y-2">
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-fit">
        {padded.map((v, i) => (
          <span
            key={i}
            className={cn(
              "w-3.5 h-3.5 rounded-sm",
              v ? "bg-neon-green" : "bg-space-navy/10",
            )}
            title={v ? "Active day" : "No activity"}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-space-navy/60 font-body">
        <span>Less</span>
        <span className="w-3 h-3 rounded-sm bg-space-navy/10" />
        <span className="w-3 h-3 rounded-sm bg-neon-green/40" />
        <span className="w-3 h-3 rounded-sm bg-neon-green/70" />
        <span className="w-3 h-3 rounded-sm bg-neon-green" />
        <span>More</span>
      </div>
    </div>
  );
}
