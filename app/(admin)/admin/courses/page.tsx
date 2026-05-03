"use client";

import { useState } from "react";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Files,
  HelpCircle,
} from "lucide-react";
import { mockPlanets, mockMissions, mockActivities, mockDocuments } from "@/lib/mock-data";

export default function CoursesPage() {
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<{ kind: "planet" | "mission"; id: string; title: string } | null>(null);

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Course content
          </h2>
          <p className="text-sm text-space-navy/60 mt-0.5">
            Authoring for planets, missions, assignments, and documents.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
        >
          <Plus className="w-4 h-4" />
          New planet
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Planets" value={`${mockPlanets.length}`} accent="#FF6B35" />
        <Stat label="Missions" value={`${mockMissions.length}`} accent="#A855F7" />
        <Stat label="Assignments" value={`${mockActivities.length}`} accent="#00D4FF" />
        <Stat label="Documents" value={`${mockDocuments.length}`} accent="#00C853" />
      </div>

      <div className="space-y-3">
        {mockPlanets.map((p) => {
          const missions = mockMissions.filter((m) => m.planetId === p.id);
          const activities = mockActivities.filter((a) =>
            missions.some((m) => m.id === a.missionId),
          );
          const docs = mockDocuments.filter((d) =>
            missions.some((m) => m.id === d.missionId),
          );
          return (
            <details
              key={p.id}
              className="kid-card overflow-hidden group"
            >
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-neutral-50">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="grid place-items-center w-12 h-12 rounded-xl text-white font-display font-bold text-lg shrink-0"
                    style={{ background: p.color }}
                  >
                    {p.planetNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-base text-space-navy truncate">
                      Planet {p.planetNumber} · {p.title}
                    </p>
                    <p className="text-xs text-space-navy/60">
                      {p.weekRange} · {missions.length} missions · {activities.length} assignments · {docs.length} docs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-green/15 text-neon-green text-[10px] font-display font-semibold uppercase tracking-wider">
                    <Eye className="w-3 h-3" />
                    Live
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditing({ kind: "planet", id: p.id, title: p.title });
                    }}
                    className="grid place-items-center w-8 h-8 rounded-lg hover:bg-neutral-100 text-space-navy/60"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-space-navy/40 group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="border-t border-neutral-100 p-4 space-y-2">
                {missions.map((m) => {
                  const mActs = mockActivities.filter((a) => a.missionId === m.id);
                  const mDocs = mockDocuments.filter((d) => d.missionId === m.id);
                  return (
                    <div
                      key={m.id}
                      className="bg-neutral-50 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-sm text-space-navy">
                            {m.orderIndex}. {m.title}
                          </p>
                          <p className="text-xs text-space-navy/60 mt-0.5">
                            {m.durationMins} min · +{m.xpReward} PP · {mActs.length} assignments · {mDocs.length} docs
                          </p>
                        </div>
                        {m.recordingStoragePath ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold uppercase tracking-wider text-neon-green px-2 py-0.5 rounded-full bg-neon-green/15">
                            <Eye className="w-3 h-3" />
                            Recording up
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold uppercase tracking-wider text-space-navy/55 px-2 py-0.5 rounded-full bg-neutral-200">
                            <EyeOff className="w-3 h-3" />
                            No recording
                          </span>
                        )}
                      </div>
                      {(mActs.length > 0 || mDocs.length > 0) && (
                        <div className="flex items-center gap-3 mt-3 text-[10px] text-space-navy/55 font-display">
                          {mActs.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              {mActs.length} assignments
                            </span>
                          )}
                          {mDocs.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Files className="w-3 h-3" />
                              {mDocs.length} documents
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      {showNew && (
        <ContentModal
          title="New planet"
          onClose={() => setShowNew(false)}
          fields={[
            { label: "Planet title", placeholder: "AI Foundations" },
            { label: "Topic", placeholder: "Introduction to AI" },
            { label: "Week range", placeholder: "Week 1-2" },
          ]}
        />
      )}

      {editing && (
        <ContentModal
          title={`Edit ${editing.kind}: ${editing.title}`}
          onClose={() => setEditing(null)}
          fields={[
            { label: "Title", value: editing.title, placeholder: "Title" },
            { label: "Description", placeholder: "Short description..." },
          ]}
        />
      )}
    </div>
  );
}

function ContentModal({
  title,
  onClose,
  fields,
}: {
  title: string;
  onClose: () => void;
  fields: { label: string; placeholder: string; value?: string }[];
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-space-navy">{title}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="space-y-3"
        >
          {fields.map((f, i) => (
            <label key={i} className="block">
              <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
                {f.label}
              </span>
              <input
                defaultValue={f.value}
                placeholder={f.placeholder}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
              />
            </label>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm hover:brightness-110"
            >
              Save
            </button>
          </div>
        </form>
      </div>
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
