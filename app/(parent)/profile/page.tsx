"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, BarChart3, Save, Plus } from "lucide-react";
import { AvatarPicker } from "@/components/lms/AvatarPicker";
import { StreakCalendar } from "@/components/lms/StreakCalendar";
import { mockStreakDays } from "@/lib/mock-data";
import { useAppData } from "@/lib/use-app-data";
import { getLevel } from "@/lib/xp";

const PROJECTS_KEY = "superkids:projects";
const AVATAR_KEY = "superkids:avatar";

type Project = { title: string; url: string };

const DEFAULT_PROJECTS: Project[] = [
  { title: "AI poem generator", url: "https://chat.openai.com/" },
  { title: "Space cat story", url: "https://docs.google.com/" },
];

export default function ProfilePage() {
  const { user } = useAppData();
  const lvl = getLevel(user.powerPoints);
  const [avatar, setAvatar] = useState(user.childAvatarId);
  const [savedAvatar, setSavedAvatar] = useState(user.childAvatarId);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [showAddProject, setShowAddProject] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Load persisted avatar + projects on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = window.localStorage.getItem(AVATAR_KEY);
    if (a) {
      const id = parseInt(a, 10);
      setAvatar(id);
      setSavedAvatar(id);
    }
    const p = window.localStorage.getItem(PROJECTS_KEY);
    if (p) {
      try {
        setProjects(JSON.parse(p));
      } catch {}
    }
  }, []);

  function saveAvatar() {
    window.localStorage.setItem(AVATAR_KEY, String(avatar));
    setSavedAvatar(avatar);
    flash("Avatar saved");
  }

  function addProject(p: Project) {
    const next = [...projects, p];
    setProjects(next);
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    setShowAddProject(false);
    flash("Project added");
  }

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="px-6 py-6 space-y-5">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ds-orange text-white font-display font-semibold text-sm py-2 px-5 rounded-full shadow-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {toast}
        </div>
      )}
      <div>
        <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
          Profile
        </h2>
        <p className="text-space-navy/60 mt-0.5 text-sm">
          Manage your avatar, view stats, and track your streak.
        </p>
      </div>

      {/* Identity card */}
      <div className="kid-card p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-display font-bold text-2xl text-space-navy leading-tight">
              {user.childName}
            </p>
            <p className="text-xs text-space-navy/50 mt-0.5">
              {user.city} · Age {user.childAge}
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <Stat label="Power Points" value={user.powerPoints.toLocaleString()} accent="#FF6B35" />
            <Stat label="Level" value={`${lvl.level} · ${lvl.title}`} accent="#00D4FF" />
          </div>
        </div>
      </div>

      {/* Avatar picker */}
      <section className="kid-card p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 className="font-display font-bold text-base text-space-navy">
            Pick your avatar
          </h3>
          {avatar !== savedAvatar && (
            <button
              onClick={saveAvatar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-orange text-white font-display font-semibold text-xs tap-scale shadow-sm hover:brightness-110"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          )}
        </div>
        <AvatarPicker selected={avatar} onSelect={setAvatar} />
        <p className="text-xs text-space-navy/55 mt-3 font-body">
          Choose one of 12 robot avatars — these protect your privacy on the leaderboard.
        </p>
      </section>

      {/* Streak calendar */}
      <section className="kid-card p-5 sm:p-6">
        <h3 className="font-display font-bold text-base text-space-navy mb-1">
          Your streak
        </h3>
        <p className="text-xs text-space-navy/55 mb-4 font-body">
          Each green square is a day you logged in and made progress.
        </p>
        <StreakCalendar days={mockStreakDays} />
      </section>

      {/* My projects */}
      <section className="kid-card p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 className="font-display font-bold text-base text-space-navy">My projects</h3>
          <button
            onClick={() => setShowAddProject(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-orange/10 text-ds-orange font-display font-semibold text-xs tap-scale hover:bg-ds-orange/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add project
          </button>
        </div>
        <div className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-sm text-space-navy/55 font-body">
              No projects yet — once you build something cool, paste the link here!
            </p>
          ) : (
            projects.map((p, i) => (
              <a
                key={i}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 rounded-xl p-3 tap-scale transition-colors"
              >
                <span className="font-display text-sm font-medium text-space-navy">{p.title}</span>
                <ExternalLink className="w-4 h-4 text-ds-orange" />
              </a>
            ))
          )}
        </div>
      </section>

      <Link
        href="/dashboard/parent"
        className="inline-flex items-center gap-2 text-ds-orange font-display font-semibold text-sm"
      >
        <BarChart3 className="w-4 h-4" />
        Switch to Parent View
      </Link>

      {showAddProject && (
        <AddProjectModal
          onCancel={() => setShowAddProject(false)}
          onAdd={addProject}
        />
      )}
    </div>
  );
}

function AddProjectModal({
  onCancel,
  onAdd,
}: {
  onCancel: () => void;
  onAdd: (p: Project) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const valid = title.trim() && /^https?:\/\/.+\..+/.test(url.trim());
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-space-navy">
          Add a project
        </h2>
        <p className="text-sm text-space-navy/60">
          Paste the link to something you built — Replit, Google Doc, ChatGPT chat, anything.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onAdd({ title: title.trim(), url: url.trim() });
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Project name
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Space cat story"
              className="mt-1.5 w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Link
            </span>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1.5 w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
          </label>
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
              disabled={!valid}
              className="flex-1 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Add project
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
    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-display font-semibold" style={{ color: accent }}>
        <Sparkles className="w-3 h-3" />
        {label}
      </div>
      <p className="font-display font-bold text-base text-space-navy leading-tight mt-0.5">{value}</p>
    </div>
  );
}
