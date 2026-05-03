"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  Mail,
  MessageSquare,
  Pause,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Trophy,
  Flame,
  Award,
} from "lucide-react";
import {
  mockLeaderboard,
  mockBatches,
  mockMissions,
  mockEarnedBadges,
  getBatchById,
} from "@/lib/mock-data";
import { BADGES } from "@/lib/badges";
import { RobotAvatar } from "@/components/lms/AvatarPicker";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { getLevel } from "@/lib/xp";

export default function StudentDetailPage({ params }: { params: { uid: string } }) {
  const student = mockLeaderboard.find((u) => u.uid === params.uid);
  if (!student) notFound();

  const [tab, setTab] = useState<"progress" | "badges" | "submissions">("progress");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const batch = mockBatches.find((b) => b.parentUids.includes(student.uid));
  const lvl = getLevel(student.powerPoints);

  const earnedSet = new Set(mockEarnedBadges.map((e) => e.id));
  const earnedBadges = BADGES.filter((b) => earnedSet.has(b.id));

  return (
    <div className="px-6 py-6 space-y-6">
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display font-medium tap-scale"
      >
        <ChevronLeft className="w-4 h-4" /> All students
      </Link>

      {/* Header card */}
      <div className="kid-card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <RobotAvatar id={student.avatarId} size={64} />
            <div>
              <p className="text-xs uppercase tracking-wider text-space-navy/45 font-display font-semibold">
                Explorer
              </p>
              <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
                {student.firstName}
              </h2>
              <p className="text-sm text-space-navy/60 mt-0.5">
                {student.city}
                {batch && (
                  <>
                    <span className="mx-1.5 text-space-navy/30">·</span>
                    <Link
                      href={`/admin/batches/${batch.id}`}
                      className="text-ds-orange font-display font-semibold"
                    >
                      {batch.name}
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmail(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 font-display font-semibold text-sm tap-scale"
            >
              <Mail className="w-4 h-4" />
              Email parent
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 font-display font-semibold text-sm tap-scale">
              <MessageSquare className="w-4 h-4" />
              Note
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 font-display font-semibold text-sm tap-scale">
              <Pause className="w-4 h-4" />
              Pause access
            </button>
            <button
              onClick={() => setConfirmRemove(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-display font-semibold text-sm tap-scale"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={<Sparkles className="w-4 h-4" />}
          label="Power Points"
          value={student.powerPoints.toLocaleString()}
          accent="#FF6B35"
        />
        <Stat
          icon={<Trophy className="w-4 h-4" />}
          label="Level"
          value={`${lvl.level} · ${lvl.title}`}
          accent="#A855F7"
        />
        <Stat
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Missions done"
          value={`${student.missionsDone}/${mockMissions.length}`}
          accent="#00C853"
        />
        <Stat
          icon={<Flame className="w-4 h-4" />}
          label="Badges earned"
          value={`${earnedBadges.length}/${BADGES.length}`}
          accent="#00D4FF"
        />
      </div>

      {/* Tabs */}
      <div className="kid-card overflow-hidden">
        <div className="flex border-b border-neutral-100">
          {([
            ["progress", `Mission progress`],
            ["badges", `Badges · ${earnedBadges.length}`],
            ["submissions", "Submissions"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "px-5 py-3 font-display font-semibold text-sm border-b-2 transition-colors",
                tab === k
                  ? "border-ds-orange text-ds-orange"
                  : "border-transparent text-space-navy/55 hover:text-space-navy",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "progress" && (
          <ul className="divide-y divide-neutral-100">
            {mockMissions.map((m, i) => {
              const done = i < student.missionsDone;
              return (
                <li key={m.id} className="px-5 py-3 flex items-center gap-3">
                  <span
                    className={cn(
                      "grid place-items-center w-9 h-9 rounded-full shrink-0 font-display font-bold text-xs",
                      done
                        ? "bg-neon-green text-white"
                        : "bg-neutral-200 text-space-navy/50",
                    )}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-space-navy">
                      Mission {m.orderIndex} · {m.title}
                    </p>
                    <p className="text-xs text-space-navy/55">
                      {done
                        ? "Watched · activities submitted · +20 PP"
                        : "Not started"}
                    </p>
                  </div>
                  <span className="text-xs text-space-navy/55 inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3 h-3" /> {m.durationMins} min
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "badges" && (
          <div className="p-5">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {BADGES.map((b) => {
                const got = earnedSet.has(b.id);
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "border rounded-xl p-4 text-center",
                      got ? "border-neutral-200 bg-white" : "border-neutral-200 bg-neutral-50 opacity-50",
                    )}
                  >
                    <span
                      className="grid place-items-center w-10 h-10 rounded-full mx-auto text-white"
                      style={{ background: b.color }}
                    >
                      <Award className="w-5 h-5" />
                    </span>
                    <p className="font-display font-semibold text-sm text-space-navy mt-2">
                      {b.name}
                    </p>
                    <p className="text-[10px] text-space-navy/55 mt-0.5">
                      {got ? "Earned" : b.trigger}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "submissions" && (
          <div className="p-5">
            <p className="text-sm text-space-navy/60 mb-3">
              Recent submissions from {student.firstName}.
            </p>
            <ul className="space-y-2">
              {[
                { activity: "Try a pattern in ChatGPT", status: "approved", date: "2 days ago" },
                { activity: "Reflect on what worked", status: "approved", date: "5 days ago" },
                { activity: "Pick the strongest prompt", status: "approved", date: "8 days ago" },
              ].map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200"
                >
                  <div>
                    <p className="font-display font-semibold text-sm text-space-navy">
                      {s.activity}
                    </p>
                    <p className="text-xs text-space-navy/55">{s.date}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold uppercase tracking-wider text-neon-green px-2 py-0.5 rounded-full bg-neon-green/15">
                    <CheckCircle2 className="w-3 h-3" />
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Email modal */}
      {showEmail && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="font-display font-bold text-xl text-space-navy">
              Email parent
            </h2>
            <p className="text-sm text-space-navy/60">
              Sends to <strong className="text-space-navy">parent of {student.firstName}</strong>.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEmail(false);
              }}
              className="space-y-3"
            >
              <input
                required
                placeholder="Subject"
                className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
              />
              <textarea
                required
                rows={5}
                placeholder="Hi! Just wanted to check in on..."
                className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm resize-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmail(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove confirm */}
      {confirmRemove && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-space-navy">
              Remove {student.firstName}?
            </h2>
            <p className="text-sm text-space-navy/60">
              The parent's account will be deactivated. Their data is retained for 30 days, after which it's permanently deleted (per DPDP).
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmRemove(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmRemove(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-display font-semibold text-sm hover:brightness-110"
              >
                Remove account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="kid-card p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-display font-semibold" style={{ color: accent }}>
        {icon}
        {label}
      </div>
      <p className="font-display font-bold text-xl text-space-navy mt-1 tabular-nums">
        {value}
      </p>
    </div>
  );
}
