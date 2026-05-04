"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Video,
  Megaphone,
  UserPlus,
  Edit2,
  Settings,
  Trash2,
} from "lucide-react";
import {
  mockBatches,
  mockLeaderboard,
  mockMissions,
  getRecordingsForBatch,
} from "@/lib/mock-data";
import type { Batch, BatchRecording, LeaderboardEntry } from "@/lib/types";
import { RobotAvatar } from "@/components/lms/AvatarPicker";
import { BatchRecordingsManager } from "@/components/admin/BatchRecordingsManager";
import { cn } from "@/lib/utils";

export default function BatchDetailPage({ params }: { params: { batchId: string } }) {
  const [batch, setBatch] = useState<Batch | null>(
    mockBatches.find((b) => b.id === params.batchId) ?? null,
  );
  const [allStudents, setAllStudents] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [recordings, setRecordings] = useState<BatchRecording[]>(
    getRecordingsForBatch(params.batchId),
  );
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);

  const [tab, setTab] = useState<"roster" | "recordings" | "settings">("roster");
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/admin/batches/${params.batchId}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/admin/students`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/admin/recordings?batchId=${params.batchId}`).then((r) => r.ok ? r.json() : null),
    ]).then(([b, s, r]) => {
      if (cancelled) return;
      if (b?.batch) setBatch(b.batch);
      else if (!mockBatches.find((x) => x.id === params.batchId)) setNotFound404(true);
      if (s?.students) setAllStudents(s.students);
      if (r?.recordings) setRecordings(r.recordings);
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [params.batchId]);

  if (notFound404 && !batch) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="font-display font-bold text-2xl text-space-navy">Batch not found</h2>
        <p className="text-sm text-space-navy/60 mt-2">
          That batch ID doesn't exist. It may have been archived.
        </p>
        <Link
          href="/admin/batches"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
        >
          <ChevronLeft className="w-4 h-4" /> All batches
        </Link>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="px-6 py-12 text-center text-space-navy/55 text-sm">
        Loading batch...
      </div>
    );
  }

  const roster = allStudents.filter((u) => batch.parentUids.includes(u.uid));

  return (
    <div className="px-6 py-6 space-y-6">
      <Link
        href="/admin/batches"
        className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display font-medium tap-scale"
      >
        <ChevronLeft className="w-4 h-4" /> All batches
      </Link>

      {/* Header card */}
      <div className="kid-card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full mt-2.5",
                batch.status === "active"
                  ? "bg-neon-green"
                  : batch.status === "scheduled"
                    ? "bg-electric-cyan"
                    : "bg-space-navy/30",
              )}
            />
            <div>
              <p className="text-xs uppercase tracking-wider text-space-navy/45 font-display font-semibold">
                Batch
              </p>
              <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
                {batch.name}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-space-navy/60 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {batch.city}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Starts{" "}
                  {new Date(batch.startDate).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {roster.length} kids
                </span>
                <span className="inline-flex items-center gap-1">
                  Trainer · {batch.trainerName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 font-display font-semibold text-sm tap-scale">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 font-display font-semibold text-sm tap-scale">
              <Megaphone className="w-4 h-4" />
              Announce
            </button>
            <button
              onClick={() => setTab("recordings")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
            >
              <Video className="w-4 h-4" />
              Manage recordings
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Cohort progress
            </span>
            <span className="text-sm font-display font-semibold text-space-navy tabular-nums">
              {batch.progressPercent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ds-orange to-electric-cyan"
              style={{ width: `${batch.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Enrolled kids" value={`${roster.length}`} accent="#FF6B35" />
        <Stat
          label="Recordings ready"
          value={`${recordings.filter((r) => r.status === "ready").length}/${mockMissions.length}`}
          accent="#00C853"
        />
        <Stat
          label="Avg progress"
          value={`${Math.round(roster.reduce((s, u) => s + u.missionsDone * 10, 0) / Math.max(1, roster.length))}%`}
          accent="#00D4FF"
        />
        <Stat
          label="Total Power Points"
          value={roster.reduce((s, u) => s + u.powerPoints, 0).toLocaleString()}
          accent="#A855F7"
        />
      </div>

      {/* Tabs */}
      <div className="kid-card overflow-hidden">
        <div className="flex border-b border-neutral-100">
          {([
            ["roster", `Roster · ${roster.length}`],
            ["recordings", `Recordings · ${recordings.length}`],
            ["settings", "Settings"],
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

        {tab === "roster" && (
          <div>
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-end">
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ds-orange text-white font-display font-semibold text-xs tap-scale"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add to batch
              </button>
            </div>
            {roster.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-display font-semibold text-space-navy">
                  No kids in this batch yet
                </p>
                <p className="text-sm text-space-navy/55 mt-1">
                  Add the first parent to get started.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-space-navy/55 font-display font-semibold">
                  <tr>
                    <th className="px-5 py-3">Explorer</th>
                    <th className="px-5 py-3">Missions</th>
                    <th className="px-5 py-3">Power Points</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {roster.map((u) => (
                    <tr key={u.uid} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/students/${u.uid}`}
                          className="flex items-center gap-3 tap-scale"
                        >
                          <RobotAvatar id={u.avatarId} size={32} />
                          <span className="font-display font-semibold text-sm text-space-navy">
                            {u.firstName}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-space-navy/65 tabular-nums">
                        {u.missionsDone}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-display font-bold text-sm text-ds-orange tabular-nums">
                          {u.powerPoints.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/students/${u.uid}`}
                          className="text-xs font-display font-semibold text-electric-cyan"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "recordings" && (
          <BatchRecordingsManager
            batch={batch}
            missions={mockMissions}
            initialRecordings={recordings}
          />
        )}

        {tab === "settings" && (
          <div className="p-6 space-y-5">
            <div>
              <h3 className="font-display font-bold text-base text-space-navy mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-ds-orange" />
                Batch settings
              </h3>
              <p className="text-sm text-space-navy/60">
                Edit batch info — name, start date, trainer assignment.
              </p>
              <button className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 font-display font-semibold text-sm tap-scale">
                <Edit2 className="w-4 h-4" />
                Edit batch info
              </button>
            </div>

            <hr className="border-neutral-200" />

            <div>
              <h3 className="font-display font-bold text-base text-red-600 mb-3 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Danger zone
              </h3>
              <p className="text-sm text-space-navy/60">
                Archive this batch — kids will lose access to recordings. Cannot be undone.
              </p>
              <button
                onClick={() => setConfirmDelete(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-display font-semibold text-sm tap-scale"
              >
                <Trash2 className="w-4 h-4" />
                Archive batch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add to batch modal */}
      {showAdd && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="font-display font-bold text-xl text-space-navy">
              Add explorer to {batch.name}
            </h2>
            <p className="text-sm text-space-navy/60">
              Pick an existing parent to assign to this batch, or create a new account.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockLeaderboard
                .filter((u) => !batch.parentUids.includes(u.uid))
                .map((u) => (
                  <button
                    key={u.uid}
                    onClick={() => {
                      setShowAdd(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 tap-scale text-left"
                  >
                    <RobotAvatar id={u.avatarId} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-space-navy">
                        {u.firstName}
                      </p>
                      <p className="text-xs text-space-navy/55">
                        {u.city} · currently in another batch
                      </p>
                    </div>
                  </button>
                ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
              >
                Cancel
              </button>
              <Link
                href="/admin/students"
                className="flex-1 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm text-center hover:brightness-110"
              >
                Create new
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Archive confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-space-navy">
              Archive {batch.name}?
            </h2>
            <p className="text-sm text-space-navy/60">
              {roster.length} kids will lose access to {recordings.length} recordings. This action can be reversed by a Super Admin within 30 days.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-display font-semibold text-sm hover:brightness-110"
              >
                Archive batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="kid-card p-4">
      <p className="text-[10px] uppercase tracking-wider font-display font-semibold" style={{ color: accent }}>
        {label}
      </p>
      <p className="font-display font-bold text-2xl text-space-navy mt-1 tabular-nums">
        {value}
      </p>
    </div>
  );
}
