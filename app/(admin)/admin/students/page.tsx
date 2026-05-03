"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, UserPlus, Mail, Upload, MoreHorizontal, Eye, Pause, Trash2, Download } from "lucide-react";
import { mockLeaderboard, mockBatches } from "@/lib/mock-data";
import { RobotAvatar } from "@/components/lms/AvatarPicker";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [cityFilter, setCityFilter] = useState<"all" | "Chennai" | "Mumbai" | "Online">("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  const filtered = mockLeaderboard.filter((u) => {
    if (q && !u.firstName.toLowerCase().includes(q.toLowerCase())) return false;
    if (cityFilter !== "all" && u.city !== cityFilter) return false;
    return true;
  });

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Students
          </h2>
          <p className="text-sm text-space-navy/60 mt-0.5">
            Manage parent accounts, send welcome emails, and onboard new explorers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCSV(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-space-navy font-display font-semibold text-sm tap-scale"
          >
            <Upload className="w-4 h-4" />
            Bulk CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
          >
            <UserPlus className="w-4 h-4" />
            Add Parent
          </button>
        </div>
      </div>

      {created && (
        <div className="kid-card p-4 border-2 border-neon-green/30 bg-neon-green/5 flex items-center gap-3">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-neon-green text-white font-bold text-sm">
            ✓
          </span>
          <p className="text-sm text-space-navy">
            Welcome email sent to <strong className="font-display font-semibold">{created}</strong>.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total enrolled" value={`${mockLeaderboard.length}`} accent="#FF6B35" />
        <Stat label="Active this week" value="9" accent="#00C853" />
        <Stat label="Inactive 7+ days" value="2" accent="#A855F7" />
        <Stat label="Avg PP / kid" value="708" accent="#00D4FF" />
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 rounded-xl border border-neutral-200 bg-white focus-within:border-ds-orange transition-colors">
          <Search className="w-4 h-4 text-space-navy/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by child name..."
            className="py-2 outline-none font-body text-sm w-56 bg-transparent"
          />
        </div>
        <div className="inline-flex p-1 rounded-xl bg-neutral-100">
          {(["all", "Chennai", "Mumbai", "Online"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={cn(
                "px-3 py-1 rounded-lg font-display font-semibold text-xs transition-colors",
                cityFilter === c
                  ? "bg-white text-space-navy shadow-sm"
                  : "text-space-navy/55 hover:text-space-navy",
              )}
            >
              {c === "all" ? "All cities" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="kid-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-space-navy/55 font-display font-semibold">
              <tr>
                <th className="px-5 py-3">Explorer</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Missions</th>
                <th className="px-5 py-3">Power Points</th>
                <th className="px-5 py-3">Last active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid} className="border-t border-neutral-100 hover:bg-neutral-50/50 group">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/students/${u.uid}`}
                      className="flex items-center gap-3 tap-scale"
                    >
                      <RobotAvatar id={u.avatarId} size={32} />
                      <span className="font-display font-semibold text-sm text-space-navy group-hover:text-ds-orange transition-colors">
                        {u.firstName}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-space-navy/65">{u.city}</td>
                  <td className="px-5 py-3 text-sm text-space-navy/65 tabular-nums">
                    {u.missionsDone}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-display font-bold text-sm text-ds-orange tabular-nums">
                      {u.powerPoints.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-space-navy/60">
                    {(u.uid.charCodeAt(2) % 9) + 1}h ago
                  </td>
                  <td className="px-5 py-3 relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === u.uid ? null : u.uid)}
                      className="grid place-items-center w-8 h-8 rounded-lg hover:bg-neutral-100 text-space-navy/60"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === u.uid && (
                      <>
                        <button
                          aria-label="Close menu"
                          onClick={() => setOpenMenu(null)}
                          className="fixed inset-0 z-30"
                        />
                        <div className="absolute right-2 top-12 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-40">
                          <Link
                            href={`/admin/students/${u.uid}`}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-neutral-50 font-display"
                          >
                            <Eye className="w-3.5 h-3.5 text-space-navy/55" />
                            View profile
                          </Link>
                          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-neutral-50 font-display text-left">
                            <Mail className="w-3.5 h-3.5 text-space-navy/55" />
                            Email parent
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-neutral-50 font-display text-left">
                            <Pause className="w-3.5 h-3.5 text-space-navy/55" />
                            Pause access
                          </button>
                          <hr className="border-neutral-100" />
                          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 font-display text-red-600 text-left">
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <AddParentModal
          onCancel={() => setShowAdd(false)}
          onCreated={(name) => {
            setShowAdd(false);
            setCreated(name);
            window.setTimeout(() => setCreated(null), 4000);
          }}
        />
      )}

      {/* Bulk CSV modal */}
      {showCSV && <BulkCSVModal onCancel={() => setShowCSV(false)} />}
    </div>
  );
}

function AddParentModal({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-space-navy">
          Add new parent
        </h2>
        <p className="text-sm text-space-navy/60">
          We'll send them a welcome email with a one-time login link.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreated(email);
          }}
          className="space-y-3"
        >
          <Field label="Parent email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
          </Field>
          <Field label="Child first name">
            <input
              required
              placeholder="Aarav"
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Child age">
              <input
                type="number"
                required
                placeholder="13"
                min={9}
                max={17}
                className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
              />
            </Field>
            <Field label="City">
              <select className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange outline-none p-3 font-body text-sm">
                <option>Chennai</option>
                <option>Mumbai</option>
                <option>Online</option>
              </select>
            </Field>
          </div>
          <Field label="Assign to batch">
            <select className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange outline-none p-3 font-body text-sm">
              {mockBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Send welcome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BulkCSVModal({ onCancel }: { onCancel: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const sampleCSV =
    "parent_email,child_first_name,child_age,city,batch_id\n" +
    "rohan@email.com,Rohan,12,Chennai,batch-chennai-may-2026\n" +
    "kavya@email.com,Kavya,14,Mumbai,batch-mumbai-may-2026\n";

  function downloadSample() {
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-superkids-parents-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-space-navy">
          Bulk import parents
        </h2>
        <p className="text-sm text-space-navy/60">
          Upload a CSV with one row per parent. We'll create accounts and send welcome emails to everyone.
        </p>

        <button
          onClick={downloadSample}
          className="inline-flex items-center gap-2 text-xs font-display font-semibold text-electric-cyan hover:underline"
        >
          <Download className="w-3.5 h-3.5" />
          Download sample CSV
        </button>

        <label
          htmlFor="csv-input"
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer block",
            file
              ? "border-neon-green bg-neon-green/5"
              : "border-neutral-200 hover:border-ds-orange",
          )}
        >
          <Upload className="w-6 h-6 mx-auto text-space-navy/40" />
          <p className="text-sm text-space-navy/65 mt-1">
            {file ? `Picked: ${file.name} (${Math.round(file.size / 1024)} KB)` : "Drop CSV or click to browse"}
          </p>
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-space-navy/55 mb-1">
            Required columns
          </p>
          <p className="text-xs text-space-navy/65 font-mono">
            parent_email · child_first_name · child_age · city · batch_id
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            disabled={!file}
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import & invite
          </button>
        </div>
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
