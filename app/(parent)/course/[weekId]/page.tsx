"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Play,
  HelpCircle,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  Lock,
  Clock,
  CheckCircle2,
  Globe,
  FileText,
  Presentation,
  Download,
  ExternalLink,
  GraduationCap,
  Star,
  BookOpen,
  Files,
} from "lucide-react";
import { mockTrainerNote } from "@/lib/mock-data";
import { useAppData } from "@/lib/use-app-data";
import type { Activity, Document, Mission } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PlanetPage({ params }: { params: { weekId: string } }) {
  const data = useAppData();
  const planet = data.planets.find((p) => p.id === params.weekId);

  if (!planet) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="font-display font-bold text-2xl text-space-navy">Planet not found</h2>
        <p className="text-sm text-space-navy/60 mt-2">
          That planet ID doesn't exist yet.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
        >
          <ChevronLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const missions = data.missions
    .filter((m) => m.planetId === planet.id)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const totalDuration = missions.reduce((sum, m) => sum + m.durationMins, 0);
  const completed = missions.filter((m) => m.status === "completed").length;
  const totalActivities = data.activities.filter((a) =>
    missions.some((m) => m.id === a.missionId),
  ).length;
  const totalDocs = data.documents.filter((d) =>
    missions.some((m) => m.id === d.missionId),
  ).length;

  // Two-section curriculum to mirror the reference layout.
  const half = Math.ceil(missions.length / 2);
  const sections: { title: string; description: string; missions: Mission[] }[] = [
    {
      title: "Foundations",
      description:
        "Core concepts you'll need before tackling the bigger build. Recordings, light reading, and a short check-in.",
      missions: missions.slice(0, half),
    },
    {
      title: "Build & Apply",
      description:
        "Apply what you learned in longer, project-driven sessions. Assignments are reviewed by Eugene before you advance.",
      missions: missions.slice(half),
    },
  ].filter((s) => s.missions.length > 0);

  return (
    <div className="px-6 py-6 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display font-medium tap-scale"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Planet header */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${planet.color}1A 0%, white 70%)`,
          borderColor: planet.color + "33",
        }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          <div
            className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-white font-display font-bold text-2xl sm:text-3xl shrink-0"
            style={{ background: planet.color }}
          >
            {planet.planetNumber}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider font-display font-semibold" style={{ color: planet.color }}>
              Planet {planet.planetNumber} · {planet.weekRange}
            </p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-space-navy leading-tight">
              {planet.title}
            </h1>
            <p className="text-space-navy/65 text-sm mt-0.5 max-w-2xl">
              {planet.topic} — {missions.length} missions, {totalDuration} minutes of recordings, {totalActivities} assignments to complete.
            </p>
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Chip icon={<Clock className="w-3 h-3" />} label={`${totalDuration} min`} />
            <Chip icon={<Play className="w-3 h-3" />} label={`${missions.length} missions`} />
            <Chip icon={<BookOpen className="w-3 h-3" />} label={`${totalActivities} assignments`} />
            <Chip icon={<Files className="w-3 h-3" />} label={`${totalDocs} docs`} />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Progress
            </span>
            <span className="text-sm font-display font-semibold text-space-navy tabular-nums">
              {completed} of {missions.length} missions · {planet.progressPercent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-space-navy/8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${planet.progressPercent}%`,
                background: `linear-gradient(90deg, ${planet.color}, #FF6B35)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum + meta sidebar */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* CURRICULUM */}
        <div className="space-y-5 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-space-navy">
              Course curriculum
            </h2>
            <span className="text-xs text-space-navy/50 font-display">
              {missions.length} missions · {totalDuration} min
            </span>
          </div>

          {sections.map((section, sIdx) => (
            <section key={sIdx} className="kid-card p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-space-navy">
                  {section.title}
                </h3>
                <p className="text-sm text-space-navy/60 mt-1">
                  {section.description}
                </p>
              </div>
              <div className="-mx-5 sm:-mx-6">
                {section.missions.map((m, idx) => (
                  <MissionRow
                    key={m.id}
                    mission={m}
                    activities={data.activities.filter((a) => a.missionId === m.id)}
                    documents={data.documents.filter((d) => d.missionId === m.id)}
                    planetColor={planet.color}
                    isLast={idx === section.missions.length - 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* META SIDEBAR */}
        <aside className="space-y-4">
          <div className="kid-card p-5">
            <h3 className="font-display font-bold text-base text-space-navy mb-3">
              Course details
            </h3>
            <ul className="space-y-3 text-sm">
              <MetaRow icon={<Clock className="w-4 h-4" />} label="Duration" value={`${totalDuration} min`} />
              <MetaRow icon={<Play className="w-4 h-4" />} label="Sessions" value={`${missions.length}`} />
              <MetaRow icon={<BookOpen className="w-4 h-4" />} label="Assignments" value={`${totalActivities}`} />
              <MetaRow icon={<Files className="w-4 h-4" />} label="Documents" value={`${totalDocs}`} />
              <MetaRow icon={<GraduationCap className="w-4 h-4" />} label="Skill Level" value="Beginner" />
              <MetaRow icon={<Globe className="w-4 h-4" />} label="Language" value="English" />
              <MetaRow
                icon={<Star className="w-4 h-4" />}
                label="Rating"
                value="4.8 / 5"
              />
            </ul>
          </div>

          {/* Trainer */}
          <div className="kid-card p-5">
            <h3 className="font-display font-bold text-base text-space-navy mb-3">
              Trainer
            </h3>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-ds-orange text-white font-display font-bold text-sm">
                ES
              </span>
              <div>
                <p className="font-display font-semibold text-sm text-space-navy">
                  {mockTrainerNote.author}
                </p>
                <p className="text-xs text-space-navy/55">Lead Trainer · DS</p>
              </div>
            </div>
            <p className="text-xs text-space-navy/60 mt-3 leading-relaxed">
              {mockTrainerNote.body}
            </p>
          </div>

          {/* Other planets */}
          <div className="kid-card p-5">
            <h3 className="font-display font-bold text-base text-space-navy mb-3">
              Other planets
            </h3>
            <ul className="space-y-2">
              {data.planets
                .filter((p) => p.id !== planet.id)
                .slice(0, 4)
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      href={p.status === "locked" ? "#" : `/course/${p.id}`}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
                        p.status === "locked"
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-neutral-50 tap-scale",
                      )}
                    >
                      <span
                        className="grid place-items-center w-9 h-9 rounded-lg text-white font-display font-bold text-sm shrink-0"
                        style={{ background: p.color }}
                      >
                        {p.planetNumber}
                      </span>
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-sm text-space-navy truncate">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-space-navy/55">{p.weekRange}</p>
                      </div>
                      {p.status === "locked" && (
                        <Lock className="w-3.5 h-3.5 text-space-navy/40 ml-auto" />
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── Mission row with nested assignments + documents ───────────── */

function MissionRow({
  mission,
  activities,
  documents,
  planetColor,
  isLast,
}: {
  mission: Mission;
  activities: Activity[];
  documents: Document[];
  planetColor: string;
  isLast?: boolean;
}) {
  const isLocked = mission.status === "locked";
  const isCompleted = mission.status === "completed";
  const href = isLocked ? "#" : `/lesson/${mission.id}`;
  const hasAttachments = activities.length > 0 || documents.length > 0;

  return (
    <div className={cn("border-t border-neutral-100", isLast && "border-b")}>
      {/* The mission itself */}
      <Link
        href={href}
        className={cn(
          "flex items-start gap-3 sm:gap-4 px-5 sm:px-6 py-4 transition-colors",
          isLocked ? "cursor-not-allowed opacity-60" : "hover:bg-neutral-50",
        )}
      >
        <span
          className="grid place-items-center w-10 h-10 rounded-full shrink-0 mt-0.5"
          style={
            !isLocked
              ? { background: planetColor + "22", color: planetColor }
              : { background: "#F1F2F5", color: "#9CA3AF" }
          }
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display font-semibold text-sm sm:text-base text-space-navy">
              <span className="text-space-navy/40 mr-1.5">{mission.orderIndex}.</span>
              {mission.title}
            </p>
            <StatusTag status={mission.status} />
          </div>
          <p className="text-xs sm:text-sm text-space-navy/60 mt-1 leading-relaxed line-clamp-2 max-w-2xl">
            {mission.description}
          </p>
        </div>

        <span className="text-xs sm:text-sm text-space-navy/60 font-display tabular-nums shrink-0 inline-flex items-center gap-1 mt-2">
          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />}
          {mission.durationMins} min
        </span>
      </Link>

      {/* Nested attachments */}
      {hasAttachments && !isLocked && (
        <div className="px-5 sm:px-6 pb-4 -mt-1 space-y-3">
          {/* Assignments */}
          {activities.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-space-navy/45 font-display font-semibold pl-14 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Assignments · {activities.length}
              </p>
              <ul className="space-y-0.5">
                {activities.map((a) => (
                  <AssignmentRow
                    key={a.id}
                    activity={a}
                    isCompleted={isCompleted}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-space-navy/45 font-display font-semibold pl-14 mb-1.5 flex items-center gap-1.5">
                <Files className="w-3 h-3" /> Resources · {documents.length}
              </p>
              <ul className="space-y-0.5">
                {documents.map((d) => (
                  <DocumentRow key={d.id} doc={d} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Single assignment row ─────────────────────────────────────── */

function AssignmentRow({
  activity,
  isCompleted,
}: {
  activity: Activity;
  isCompleted: boolean;
}) {
  const meta = activityMeta(activity);
  return (
    <li>
      <Link
        href={`/activity/${activity.id}`}
        className="flex items-center gap-3 pl-14 pr-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors tap-scale"
      >
        <span
          className="grid place-items-center w-7 h-7 rounded-md shrink-0"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-medium text-sm text-space-navy truncate">
            {activity.title}
          </p>
          <p className="text-xs text-space-navy/55">{meta.label}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0",
            isCompleted
              ? "bg-neon-green/15 text-neon-green"
              : "bg-neutral-100 text-space-navy/55",
          )}
        >
          {isCompleted ? "Submitted" : "Pending"}
        </span>
      </Link>
    </li>
  );
}

function activityMeta(a: Activity): {
  icon: React.ReactNode;
  bg: string;
  color: string;
  label: string;
} {
  if (a.type === "quiz")
    return {
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      bg: "#A855F71A",
      color: "#A855F7",
      label: `Quiz · ${a.quiz?.options.length ?? 4} options`,
    };
  if (a.type === "upload")
    return {
      icon: <Upload className="w-3.5 h-3.5" />,
      bg: "#FF6B351A",
      color: "#FF6B35",
      label: "Upload · screenshot or image",
    };
  if (a.type === "link")
    return {
      icon: <LinkIcon className="w-3.5 h-3.5" />,
      bg: "#00D4FF1A",
      color: "#00D4FF",
      label: "Link submission",
    };
  return {
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    bg: "#00E6761A",
    color: "#00C853",
    label: "Short reflection · 2-3 sentences",
  };
}

/* ─── Single document row ───────────────────────────────────────── */

function DocumentRow({ doc }: { doc: Document }) {
  const meta = docMeta(doc);
  const external = doc.type === "link";
  return (
    <li>
      <a
        href={doc.url}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-3 pl-14 pr-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors tap-scale"
      >
        <span
          className="grid place-items-center w-7 h-7 rounded-md shrink-0"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-medium text-sm text-space-navy truncate">
            {doc.title}
          </p>
          <p className="text-xs text-space-navy/55">
            {meta.label}
            {doc.size ? ` · ${doc.size}` : ""}
          </p>
        </div>
        <span className="text-space-navy/40 shrink-0">
          {external ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        </span>
      </a>
    </li>
  );
}

function docMeta(d: Document): {
  icon: React.ReactNode;
  bg: string;
  color: string;
  label: string;
} {
  if (d.type === "pdf")
    return {
      icon: <FileText className="w-3.5 h-3.5" />,
      bg: "#FF4D4D1A",
      color: "#E53E3E",
      label: "PDF",
    };
  if (d.type === "slides")
    return {
      icon: <Presentation className="w-3.5 h-3.5" />,
      bg: "#FF6B351A",
      color: "#FF6B35",
      label: "Slides",
    };
  if (d.type === "link")
    return {
      icon: <LinkIcon className="w-3.5 h-3.5" />,
      bg: "#00D4FF1A",
      color: "#00D4FF",
      label: "External link",
    };
  return {
    icon: <FileText className="w-3.5 h-3.5" />,
    bg: "#1A1A2E12",
    color: "#1A1A2E",
    label: d.type.toUpperCase(),
  };
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function StatusTag({ status }: { status: Mission["status"] }) {
  if (status === "completed")
    return (
      <span className="text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neon-green/15 text-neon-green">
        Watched
      </span>
    );
  if (status === "locked")
    return (
      <span className="text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-space-navy/50">
        Locked
      </span>
    );
  return (
    <span className="text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-electric-cyan/15 text-electric-cyan">
      Preview
    </span>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-space-navy/65">
        <span className="grid place-items-center w-8 h-8 rounded-full bg-neutral-100 text-space-navy/60">
          {icon}
        </span>
        <span className="font-display font-medium text-sm">{label}</span>
      </span>
      <span className="font-display font-bold text-sm text-space-navy tabular-nums">
        {value}
      </span>
    </li>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-display font-semibold text-space-navy/70">
      {icon}
      {label}
    </span>
  );
}
