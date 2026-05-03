"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Users, Calendar, MapPin } from "lucide-react";
import { mockBatches } from "@/lib/mock-data";

export default function BatchesPage() {
  const [showNew, setShowNew] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Batches
          </h2>
          <p className="text-sm text-space-navy/60 mt-0.5">
            Group kids into cohorts by city and start date. Each batch has its own recordings and announcements.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
        >
          <Plus className="w-4 h-4" />
          New batch
        </button>
      </div>

      {created && (
        <div className="kid-card p-4 border-2 border-neon-green/30 bg-neon-green/5 flex items-center gap-3">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-neon-green text-white font-bold text-sm">
            ✓
          </span>
          <p className="text-sm text-space-navy">
            <strong className="font-display font-semibold">{created}</strong> created. Add explorers from the batch detail page.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active batches" value={`${mockBatches.filter((b) => b.status === "active").length}`} accent="#FF6B35" />
        <Stat label="Total kids" value={`${mockBatches.reduce((s, b) => s + b.parentUids.length, 0)}`} accent="#A855F7" />
        <Stat label="Cities" value={`${new Set(mockBatches.map((b) => b.city)).size}`} accent="#00D4FF" />
        <Stat
          label="Avg cohort"
          value={`${Math.round(mockBatches.reduce((s, b) => s + b.parentUids.length, 0) / mockBatches.length)}`}
          accent="#00C853"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBatches.map((b) => (
          <div key={b.id} className="kid-card p-5 space-y-3 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display font-bold text-lg text-space-navy">
                  {b.name}
                </p>
                <p className="text-xs text-space-navy/55 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {b.city}
                  <span className="mx-1">·</span>
                  <Calendar className="w-3 h-3" />
                  Starts {new Date(b.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-display font-semibold uppercase tracking-wider ${
                  b.status === "active"
                    ? "bg-neon-green/15 text-neon-green"
                    : b.status === "scheduled"
                      ? "bg-electric-cyan/15 text-electric-cyan"
                      : "bg-neutral-100 text-space-navy/55"
                }`}
              >
                {b.status}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-3xl text-space-navy tabular-nums">
                {b.parentUids.length}
              </span>
              <span className="text-xs text-space-navy/55 font-display flex items-center gap-1">
                <Users className="w-3 h-3" />
                explorers
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wide text-space-navy/55 font-display font-semibold">
                  Cohort progress
                </span>
                <span className="text-xs font-display font-semibold text-space-navy tabular-nums">
                  {b.progressPercent}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-ds-orange"
                  style={{ width: `${b.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 mt-auto">
              <Link
                href={`/admin/batches/${b.id}`}
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-space-navy text-center font-display font-semibold text-xs tap-scale"
              >
                Manage
              </Link>
              <Link
                href={`/admin/batches/${b.id}`}
                className="flex-1 px-3 py-2 rounded-lg bg-ds-orange/10 text-ds-orange text-center font-display font-semibold text-xs tap-scale hover:bg-ds-orange/20"
              >
                Roster →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {showNew && <NewBatchModal onCancel={() => setShowNew(false)} onCreated={(name) => { setShowNew(false); setCreated(name); window.setTimeout(() => setCreated(null), 4000); }} />}
    </div>
  );
}

function NewBatchModal({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Chennai");
  const [date, setDate] = useState("");
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-space-navy">
          New batch
        </h2>
        <p className="text-sm text-space-navy/60">
          Cohorts are how students are grouped. Recordings and announcements are sent per-batch.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreated(name);
          }}
          className="space-y-3"
        >
          <Field label="Batch name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bangalore July 2026"
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange outline-none p-3 font-body text-sm"
              >
                <option>Chennai</option>
                <option>Mumbai</option>
                <option>Online</option>
                <option>Bangalore</option>
                <option>Delhi</option>
                <option>Hyderabad</option>
              </select>
            </Field>
            <Field label="Start date">
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange outline-none p-3 font-body text-sm"
              />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm hover:brightness-110 shadow-sm"
            >
              Create batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
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
