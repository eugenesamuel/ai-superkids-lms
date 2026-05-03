"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, Clock, ImageIcon, Link as LinkIcon, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Submission = {
  id: string;
  explorer: string;
  city: string;
  activity: string;
  type: "upload" | "link" | "text";
  submittedAt: string;
  preview: string;
  mission: string;
};

const MOCK: Submission[] = [
  {
    id: "s1",
    explorer: "Aarav",
    city: "Chennai",
    activity: "Try a pattern in ChatGPT",
    type: "upload",
    submittedAt: "2026-05-03T10:00:00.000Z",
    preview: "screenshot-001.png",
    mission: "Prompt patterns that work",
  },
  {
    id: "s2",
    explorer: "Priya",
    city: "Mumbai",
    activity: "Share your project link",
    type: "link",
    submittedAt: "2026-05-03T11:30:00.000Z",
    preview: "https://replit.com/@priya/ai-poem",
    mission: "Prompt patterns that work",
  },
  {
    id: "s3",
    explorer: "Arjun",
    city: "Chennai",
    activity: "Reflect on what worked",
    type: "text",
    submittedAt: "2026-05-02T14:00:00.000Z",
    preview:
      "I asked AI to write a story about my dog as a superhero. Adding the part about him flying using bacon power made it really funny — specificity worked!",
    mission: "Your first useful prompt",
  },
  {
    id: "s4",
    explorer: "Diya",
    city: "Online",
    activity: "Try a pattern in ChatGPT",
    type: "upload",
    submittedAt: "2026-05-02T09:15:00.000Z",
    preview: "screenshot-002.png",
    mission: "Prompt patterns that work",
  },
];

export default function SubmissionsPage() {
  const [items, setItems] = useState(MOCK);
  const [tab, setTab] = useState<"pending" | "approved" | "revision">("pending");

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Submissions
          </h2>
          <p className="text-sm text-space-navy/60 mt-0.5">
            Review what kids sent in. Approve or request a revision.
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-neutral-100">
          {([
            ["pending", `Pending · ${items.length}`],
            ["approved", "Approved"],
            ["revision", "Revisions"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "px-4 py-1.5 rounded-lg font-display font-semibold text-xs transition-colors",
                tab === k
                  ? "bg-white text-space-navy shadow-sm"
                  : "text-space-navy/55 hover:text-space-navy",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Awaiting review" value={`${items.length}`} accent="#FF6B35" />
        <Stat label="Approved this week" value="14" accent="#00C853" />
        <Stat label="Revisions sent" value="3" accent="#A855F7" />
        <Stat label="Avg review time" value="42 min" accent="#00D4FF" />
      </div>

      {/* Submissions list */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="kid-card p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-neon-green mx-auto" />
            <p className="font-display font-bold text-lg text-space-navy mt-2">
              All caught up
            </p>
            <p className="text-sm text-space-navy/60 mt-1">
              No submissions waiting on review.
            </p>
          </div>
        ) : (
          items.map((s) => <SubmissionCard key={s.id} sub={s} onAct={() => setItems((arr) => arr.filter((x) => x.id !== s.id))} />)
        )}
      </div>
    </div>
  );
}

function SubmissionCard({
  sub,
  onAct,
}: {
  sub: Submission;
  onAct: () => void;
}) {
  const Icon =
    sub.type === "upload" ? ImageIcon : sub.type === "link" ? LinkIcon : MessageSquare;
  const typeLabel =
    sub.type === "upload" ? "Screenshot" : sub.type === "link" ? "Link submission" : "Text reflection";
  const accent =
    sub.type === "upload" ? "#FF6B35" : sub.type === "link" ? "#00D4FF" : "#00C853";

  return (
    <div className="kid-card p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span
            className="grid place-items-center w-10 h-10 rounded-xl shrink-0 mt-1"
            style={{ background: accent + "1A", color: accent }}
          >
            <Icon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-bold text-sm text-space-navy">
                {sub.explorer}
              </p>
              <span className="text-xs text-space-navy/45">·</span>
              <p className="text-xs text-space-navy/60">{sub.city}</p>
              <span
                className="ml-1 text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: accent + "15", color: accent }}
              >
                {typeLabel}
              </span>
            </div>
            <p className="text-sm text-space-navy/70 mt-1">{sub.activity}</p>
            <p className="text-[10px] text-space-navy/45 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(sub.submittedAt).toLocaleString()} · from "{sub.mission}"
            </p>
            <div className="mt-3 bg-neutral-50 rounded-xl p-3 text-sm text-space-navy/85 font-body border border-neutral-200">
              {sub.preview}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onAct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neon-green/15 text-neon-green font-display font-semibold text-sm tap-scale hover:bg-neon-green/25"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={onAct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ds-orange/10 text-ds-orange font-display font-semibold text-sm tap-scale hover:bg-ds-orange/20"
          >
            <RotateCcw className="w-4 h-4" />
            Request revision
          </button>
        </div>
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
