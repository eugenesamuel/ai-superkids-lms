"use client";

import Link from "next/link";
import { Download, ChevronLeft, MessageCircle } from "lucide-react";
import { ParentStatsCard } from "@/components/lms/ParentStatsCard";
import { mockTrainerNote } from "@/lib/mock-data";
import { useAppData } from "@/lib/use-app-data";
import { relativeTime } from "@/lib/utils";

function ParentReportActions({
  childName,
  completed,
  totalMissions,
  sessionsThisWeek,
  streakDays,
  powerPoints,
  overall,
}: {
  childName: string;
  completed: number;
  totalMissions: number;
  sessionsThisWeek: number;
  streakDays: number;
  powerPoints: number;
  overall: number;
}) {
  function downloadReport() {
    const lines = [
      "AI SUPERKIDS — PROGRESS REPORT",
      "================================",
      "",
      `Explorer: ${childName}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Trainer: ${mockTrainerNote.author}`,
      "",
      "OVERALL",
      "-------",
      `Missions completed: ${completed} / ${totalMissions} (${overall}%)`,
      `Power Points: ${powerPoints.toLocaleString()}`,
      `Day streak: ${streakDays}`,
      `Sessions this week: ${sessionsThisWeek}`,
      "",
      "TRAINER NOTE",
      "------------",
      mockTrainerNote.body,
      "",
      "— Digital Scholar · digitalscholar.in",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${childName.toLowerCase()}-progress-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <button
        type="button"
        onClick={downloadReport}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale hover:brightness-110"
      >
        <Download className="w-4 h-4" />
        Download Progress Report
      </button>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 text-space-navy font-display font-semibold text-sm tap-scale hover:bg-neutral-50"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default function ParentStatsPage() {
  const { user, missions } = useAppData();
  const totalMissions = missions.length;
  const completed = missions.filter((m) => m.status === "completed").length;
  const overall = Math.round((completed / totalMissions) * 100);
  const sessionsThisWeek = missions.filter(
    (m) => m.status === "completed" && new Date(m.scheduledAt ?? 0).getTime() > Date.now() - 7 * 86400_000,
  ).length;

  return (
    <div className="px-6 py-6 space-y-5">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display font-medium tap-scale"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div>
        <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
          Parent View · {user.childName}'s Progress
        </h2>
        <p className="text-space-navy/60 text-sm mt-0.5">
          Last active {relativeTime(user.lastActiveAt)}
        </p>
      </div>

      <ParentStatsCard
        childName={user.childName}
        progressPercent={overall}
        lastActiveLabel={relativeTime(user.lastActiveAt)}
        sessionsThisWeek={sessionsThisWeek}
        totalSessions={totalMissions}
        streakDays={user.streakDays}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="kid-card p-5 sm:p-6">
          <p className="text-xs uppercase tracking-wider text-space-navy/45 font-display font-semibold">
            Latest sessions
          </p>
          <ul className="mt-3 space-y-2">
            {missions
              .filter((m) => m.status === "completed")
              .slice(0, 3)
              .map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3">
                  <span className="font-display text-sm text-space-navy truncate">{m.title}</span>
                  <span className="text-xs text-space-navy/55 shrink-0">
                    {m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : "—"}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5 sm:p-6 border border-ds-orange/20 bg-ds-orange/5">
          <p className="text-xs uppercase tracking-wider text-ds-orange font-display font-semibold flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            Trainer note · {mockTrainerNote.author}
          </p>
          <p className="text-sm text-space-navy mt-2 font-body leading-relaxed">
            {mockTrainerNote.body}
          </p>
          <p className="text-xs text-space-navy/45 mt-3">
            {relativeTime(mockTrainerNote.date)}
          </p>
        </div>
      </div>

      <ParentReportActions
        childName={user.childName}
        completed={completed}
        totalMissions={totalMissions}
        sessionsThisWeek={sessionsThisWeek}
        streakDays={user.streakDays}
        powerPoints={user.powerPoints}
        overall={overall}
      />
    </div>
  );
}
