"use client";

import { useEffect, useState } from "react";
import { Send, Megaphone, Mail, Bell, TrendingUp, Inbox, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Batch } from "@/lib/types";

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "batch";
  batchId?: string | null;
  channels: { inApp: boolean; email: boolean };
  sentAt: string;
  reads: number;
  total: number;
};

const FALLBACK_HISTORY: Announcement[] = [
  {
    id: "a1",
    title: "Live class moved to Saturday 4pm",
    body: "Hey explorers — this week's session got moved by 24 hours due to a scheduling conflict.",
    audience: "batch",
    batchId: "batch-chennai-may-2026",
    channels: { inApp: true, email: true },
    sentAt: "2026-05-02T09:30:00.000Z",
    reads: 22,
    total: 24,
  },
  {
    id: "a2",
    title: "New badge unlocked: Streak Star",
    body: "Anyone who logs in for 5 days in a row gets a new badge — keep going!",
    audience: "all",
    channels: { inApp: true, email: false },
    sentAt: "2026-04-28T11:00:00.000Z",
    reads: 71,
    total: 73,
  },
];

export default function AnnouncementsPage() {
  const [audience, setAudience] = useState<"all" | "batch">("all");
  const [batchId, setBatchId] = useState("batch-chennai-may-2026");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [history, setHistory] = useState<Announcement[]>(FALLBACK_HISTORY);

  async function loadBatches() {
    try {
      const res = await fetch("/api/admin/batches");
      const data = (await res.json()) as { batches: Batch[] };
      setBatches(data.batches);
      if (data.batches[0]) setBatchId(data.batches[0].id);
    } catch {}
  }
  async function loadHistory() {
    try {
      const res = await fetch("/api/admin/announcements");
      const data = (await res.json()) as { announcements: Announcement[] };
      if (data.announcements && data.announcements.length > 0) {
        setHistory(data.announcements);
      }
    } catch {}
  }
  useEffect(() => {
    loadBatches();
    loadHistory();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          audience,
          batchId: audience === "batch" ? batchId : null,
          channels: { inApp, email },
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Send failed");
      setSent(true);
      setTitle("");
      setBody("");
      window.setTimeout(() => setSent(false), 3000);
      await loadHistory();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
          Announcements
        </h2>
        <p className="text-sm text-space-navy/60 mt-0.5">
          Send a message to all kids or a specific batch — in-app, email, or both.
        </p>
      </div>

      {/* Full-width KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RailStat icon={<Inbox className="w-3.5 h-3.5" />} label="Sent (30d)" value={`${history.length}`} accent="#FF6B35" />
        <RailStat icon={<Eye className="w-3.5 h-3.5" />} label="Avg read rate" value={history.length === 0 ? "—" : `${Math.round(history.reduce((s, h) => s + (h.total > 0 ? (h.reads / h.total) * 100 : 0), 0) / history.length)}%`} accent="#00C853" />
        <RailStat icon={<TrendingUp className="w-3.5 h-3.5" />} label="Total reach" value={`${history.reduce((s, h) => s + h.total, 0)}`} accent="#00D4FF" />
        <RailStat icon={<Bell className="w-3.5 h-3.5" />} label="Channels active" value="In-app · Email" accent="#A855F7" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Compose */}
        <form onSubmit={handleSend} className="kid-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-ds-orange/15 text-ds-orange">
              <Megaphone className="w-4 h-4" />
            </span>
            <h3 className="font-display font-bold text-base text-space-navy">Compose</h3>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Audience
            </span>
            <div className="mt-1.5 flex gap-2">
              {([
                ["all", "All explorers"],
                ["batch", "Specific batch"],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setAudience(k)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-display font-semibold text-sm tap-scale transition-colors",
                    audience === k
                      ? "bg-ds-orange text-white"
                      : "bg-neutral-50 border border-neutral-200 text-space-navy/65 hover:bg-neutral-100",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {audience === "batch" && (
            <Field label="Batch">
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange outline-none p-3 font-body text-sm"
              >
                {batches.length === 0 ? (
                  <option>No batches loaded</option>
                ) : (
                  batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))
                )}
              </select>
            </Field>
          )}

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Class moved to Saturday!"
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
          </Field>

          <Field label="Message">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={5}
              placeholder="Hey explorers! Just a heads-up..."
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm resize-none"
            />
          </Field>

          <div>
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Channels
            </span>
            <div className="flex gap-2 mt-1.5">
              <Toggle on={inApp} onClick={() => setInApp((v) => !v)} icon={<Bell className="w-3.5 h-3.5" />} label="In-app" />
              <Toggle on={email} onClick={() => setEmail((v) => !v)} icon={<Mail className="w-3.5 h-3.5" />} label="Email" />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {busy ? "Sending..." : sent ? "Sent!" : "Send announcement"}
          </button>
        </form>

        {/* Right column — history only (stats moved to full-width strip above) */}
        <div className="kid-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base text-space-navy">
                Recent sends
              </h3>
              <span className="text-xs text-space-navy/50 font-display">
                Last 30 days
              </span>
            </div>
            <ul className="space-y-3">
              {history.length === 0 && (
                <li className="text-center py-8 text-sm text-space-navy/55">No announcements sent yet.</li>
              )}
              {history.map((h) => {
                const readPct = h.total === 0 ? 0 : Math.round((h.reads / h.total) * 100);
                const audienceLabel =
                  h.audience === "all"
                    ? "ALL"
                    : (batches.find((b) => b.id === h.batchId)?.name ?? "BATCH").toUpperCase();
                return (
                  <li key={h.id} className="border border-neutral-200 rounded-xl p-4 hover:bg-neutral-50/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display font-bold text-sm text-space-navy">
                        {h.title}
                      </p>
                      <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-space-navy/55 px-2 py-0.5 rounded-full bg-neutral-100 shrink-0">
                        {audienceLabel}
                      </span>
                    </div>
                    <p className="text-xs text-space-navy/60 mt-1 line-clamp-2">{h.body}</p>
                    <div className="flex items-center justify-between mt-3 gap-3">
                      <p className="text-[10px] text-space-navy/45">
                        {new Date(h.sentAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <div className="flex-1 max-w-[120px] h-1 rounded-full bg-neutral-200 overflow-hidden">
                        <div className="h-full rounded-full bg-neon-green" style={{ width: `${readPct}%` }} />
                      </div>
                      <p className="text-xs font-display font-semibold text-space-navy/70 tabular-nums shrink-0">
                        <span className="text-neon-green">{readPct}%</span>
                        <span className="text-space-navy/40 ml-1 text-[10px]">
                          {h.reads}/{h.total}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
      </div>
    </div>
  );
}

function RailStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="kid-card p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-display font-semibold" style={{ color: accent }}>
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="font-display font-bold text-xl text-space-navy mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-display font-semibold text-xs tap-scale transition-colors",
        on
          ? "bg-ds-orange/15 text-ds-orange border border-ds-orange/30"
          : "bg-neutral-50 border border-neutral-200 text-space-navy/55 hover:text-space-navy",
      )}
    >
      {icon}
      {label}
    </button>
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
