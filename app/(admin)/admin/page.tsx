"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  CheckSquare,
  Video,
  Plus,
  UserPlus,
  Megaphone,
  Upload,
  ArrowUpRight,
  Activity,
  Gamepad2,
  GraduationCap,
} from "lucide-react";
import {
  mockLeaderboard,
  mockMissions,
  mockLiveClasses,
} from "@/lib/mock-data";

export default function AdminOverview() {
  const totalKids = mockLeaderboard.length;
  const recordingsUp = mockLiveClasses.filter((l) => l.recordingStoragePath).length;
  const pendingSubs = 4;
  const avgProgress = Math.round(
    (mockMissions.filter((m) => m.status === "completed").length / mockMissions.length) * 100,
  );

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Title row */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Overview
          </h2>
          <p className="text-sm text-space-navy/60 mt-0.5">
            Today's snapshot — students, content, and pending tasks.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-space-navy font-display font-semibold text-sm tap-scale"
          >
            <UserPlus className="w-4 h-4" />
            Add Parent
          </Link>
          <Link
            href="/admin/batches"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-space-navy font-display font-semibold text-sm tap-scale"
          >
            <Upload className="w-4 h-4" />
            Upload Recording
          </Link>
          <Link
            href="/admin/announcements"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
          >
            <Megaphone className="w-4 h-4" />
            Send Announcement
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          icon={<Users className="w-4 h-4" />}
          label="Active Explorers"
          value={`${totalKids}`}
          delta="+3 this week"
          accent="#FF6B35"
          href="/admin/students"
        />
        <KPI
          icon={<TrendingUp className="w-4 h-4" />}
          label="Avg Progress"
          value={`${avgProgress}%`}
          delta="+8% vs last week"
          accent="#00D4FF"
        />
        <KPI
          icon={<Video className="w-4 h-4" />}
          label="Recordings Live"
          value={`${recordingsUp}`}
          delta="2 uploaded today"
          accent="#A855F7"
          href="/admin/batches"
        />
        <KPI
          icon={<CheckSquare className="w-4 h-4" />}
          label="Pending Reviews"
          value={`${pendingSubs}`}
          delta="oldest 14h ago"
          accent="#00C853"
          href="/admin/submissions"
        />
      </div>

      {/* Charts + activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <EnrollmentChart />
        <ActivityFeed />
      </div>

      {/* Top performers + content health */}
      <div className="grid lg:grid-cols-2 gap-4">
        <TopExplorers />
        <ContentHealth />
      </div>
    </div>
  );
}

/* ─── KPI ──────────────────────────────────────────────────────── */

function KPI({
  icon,
  label,
  value,
  delta,
  accent,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  accent: string;
  href?: string;
}) {
  const inner = (
    <motion.div
      whileHover={href ? { y: -2 } : undefined}
      className="kid-card p-5 transition-shadow hover:shadow-md h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide font-display font-semibold" style={{ color: accent }}>
          {icon}
          {label}
        </div>
        {href && <ArrowUpRight className="w-3.5 h-3.5 text-space-navy/40" />}
      </div>
      <p className="font-display font-bold text-3xl text-space-navy mt-1.5 tabular-nums">
        {value}
      </p>
      <p className="text-xs text-space-navy/55 mt-1">{delta}</p>
    </motion.div>
  );
  if (href)
    return (
      <Link href={href} className="block tap-scale">
        {inner}
      </Link>
    );
  return inner;
}

/* ─── Enrollment chart (mini bar chart) ───────────────────────── */

function EnrollmentChart() {
  const data = [
    { week: "W1", value: 18 },
    { week: "W2", value: 24 },
    { week: "W3", value: 31 },
    { week: "W4", value: 42 },
    { week: "W5", value: 55 },
    { week: "W6", value: 68 },
    { week: "W7", value: 73 },
  ];
  const max = Math.max(...data.map((d) => d.value));
  const H = 160;

  return (
    <div className="kid-card p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-base text-space-navy flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-ds-orange" />
          Enrollment trend
        </h3>
        <span className="text-xs font-display font-semibold text-neon-green">
          ↑ 12% MoM
        </span>
      </div>
      <p className="text-xs text-space-navy/55 mb-4">
        Cumulative student count over the last 7 weeks.
      </p>

      <div
        className="flex items-end justify-around gap-2 border-b border-neutral-200"
        style={{ height: H }}
      >
        {data.map((d, i) => {
          const barH = (d.value / max) * (H - 10);
          return (
            <div key={d.week} className="flex flex-col items-center justify-end flex-1 max-w-[44px] h-full">
              <span className="text-[10px] font-display font-semibold text-space-navy/55 mb-1 tabular-nums">
                {d.value}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barH }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="w-full rounded-t-md"
                style={{
                  background: `linear-gradient(180deg, #FF6B35 0%, #FF8B5C 100%)`,
                  minHeight: 4,
                }}
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
    </div>
  );
}

/* ─── Activity feed ────────────────────────────────────────────── */

function ActivityFeed() {
  const items = [
    { time: "12 min", text: "Aarav submitted Quick Quiz · 60 PP", type: "play" },
    { time: "32 min", text: "Recording uploaded: Prompt patterns", type: "upload" },
    { time: "1 hr", text: "Priya completed Mission 4 · +20 PP", type: "complete" },
    { time: "2 hr", text: "New parent: rohan@email.com", type: "user" },
    { time: "3 hr", text: "Submission needs review (Diya)", type: "submit" },
    { time: "5 hr", text: "Announcement sent to Mumbai batch", type: "send" },
  ];
  return (
    <div className="kid-card p-5">
      <h3 className="font-display font-bold text-base text-space-navy flex items-center gap-1.5">
        <Activity className="w-4 h-4 text-ds-orange" />
        Recent activity
      </h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="grid place-items-center w-7 h-7 rounded-full text-[10px] font-display font-bold shrink-0 mt-0.5"
              style={{
                background: typeColor(it.type) + "1A",
                color: typeColor(it.type),
              }}
            >
              {typeChar(it.type)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-space-navy leading-snug">{it.text}</p>
              <p className="text-[10px] text-space-navy/45 mt-0.5">{it.time} ago</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function typeColor(t: string) {
  return t === "play"
    ? "#A855F7"
    : t === "upload"
      ? "#00D4FF"
      : t === "complete"
        ? "#00C853"
        : t === "submit"
          ? "#FF6B35"
          : t === "send"
            ? "#FFD700"
            : "#1A1A2E";
}
function typeChar(t: string) {
  return t === "play"
    ? "🎮"
    : t === "upload"
      ? "↑"
      : t === "complete"
        ? "✓"
        : t === "submit"
          ? "📝"
          : t === "send"
            ? "📣"
            : "+";
}

/* ─── Top explorers ────────────────────────────────────────────── */

function TopExplorers() {
  const top = [...mockLeaderboard]
    .sort((a, b) => b.powerPoints - a.powerPoints)
    .slice(0, 5);
  return (
    <div className="kid-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-base text-space-navy flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-ds-orange" />
          Top explorers
        </h3>
        <Link
          href="/admin/students"
          className="text-xs font-display text-ds-orange inline-flex items-center"
        >
          All students
        </Link>
      </div>
      <ol className="space-y-1.5">
        {top.map((u, i) => (
          <li
            key={u.uid}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50"
          >
            <span
              className="grid place-items-center w-7 h-7 rounded-full text-xs font-display font-bold text-white shrink-0"
              style={{
                background:
                  i === 0
                    ? "#FFD700"
                    : i === 1
                      ? "#C0C0C0"
                      : i === 2
                        ? "#CD7F32"
                        : "#1A1A2E",
              }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-space-navy">{u.firstName}</p>
              <p className="text-[10px] text-space-navy/55">{u.city}</p>
            </div>
            <span className="font-display font-bold text-sm text-ds-orange tabular-nums">
              {u.powerPoints.toLocaleString()} PP
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─── Content health ───────────────────────────────────────────── */

function ContentHealth() {
  const data = [
    { label: "Recordings uploaded", value: 4, total: 5, color: "#00D4FF" },
    { label: "Activities published", value: 4, total: 4, color: "#00C853" },
    { label: "Documents attached", value: 7, total: 10, color: "#A855F7" },
    { label: "Trivia questions ready", value: 12, total: 20, color: "#FF6B35" },
  ];
  return (
    <div className="kid-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-base text-space-navy flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-ds-orange" />
          Content health
        </h3>
        <Link
          href="/admin/courses"
          className="text-xs font-display text-ds-orange inline-flex items-center"
        >
          Manage
        </Link>
      </div>
      <ul className="space-y-3">
        {data.map((d) => {
          const pct = Math.round((d.value / d.total) * 100);
          return (
            <li key={d.label}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-display font-medium text-space-navy">
                  {d.label}
                </span>
                <span className="text-xs font-display text-space-navy/60 tabular-nums">
                  {d.value} / {d.total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: d.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
