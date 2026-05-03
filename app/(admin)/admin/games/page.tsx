"use client";

import { useState } from "react";
import {
  Gamepad2,
  Plus,
  Search,
  Edit2,
  Trash2,
  HelpCircle,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import { GAMES, TRIVIA, type TriviaQuestion } from "@/lib/games";
import { cn } from "@/lib/utils";

type EditableTrivia = TriviaQuestion;

export default function AdminGamesPage() {
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | TriviaQuestion["difficulty"]>("all");
  const [questions, setQuestions] = useState<EditableTrivia[]>(TRIVIA);
  const [editing, setEditing] = useState<EditableTrivia | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<EditableTrivia | null>(null);

  const filtered = questions.filter((t) => {
    if (q && !t.question.toLowerCase().includes(q.toLowerCase())) return false;
    if (difficulty !== "all" && t.difficulty !== difficulty) return false;
    return true;
  });

  function saveQuestion(updated: EditableTrivia) {
    setQuestions((prev) => {
      const i = prev.findIndex((p) => p.id === updated.id);
      if (i === -1) return [...prev, updated];
      const copy = [...prev];
      copy[i] = updated;
      return copy;
    });
    setEditing(null);
    setAdding(false);
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
  }

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Games
          </h2>
          <p className="text-sm text-space-navy/60 mt-0.5 max-w-xl">
            Manage the game catalog, trivia question bank, and view play analytics.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
        >
          <Plus className="w-4 h-4" />
          Add question
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<HelpCircle className="w-4 h-4" />} label="Trivia questions" value={`${questions.length}`} accent="#FF6B35" />
        <Stat icon={<Gamepad2 className="w-4 h-4" />} label="Games available" value={`${GAMES.filter((g) => g.status === "available").length}`} accent="#A855F7" />
        <Stat icon={<Users className="w-4 h-4" />} label="Plays this week" value="48" accent="#00D4FF" />
        <Stat icon={<TrendingUp className="w-4 h-4" />} label="PP earned (games)" value="2,140" accent="#00C853" />
      </div>

      {/* Game catalog */}
      <section>
        <h3 className="font-display font-bold text-base text-space-navy mb-3">
          Game catalog
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES.map((g) => (
            <div key={g.slug} className="kid-card p-5 flex items-start gap-4">
              <span
                className="grid place-items-center w-12 h-12 rounded-xl text-white shrink-0"
                style={{ background: g.accent }}
              >
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-space-navy">
                  {g.title}
                </p>
                <p className="text-xs text-space-navy/55 mt-0.5">{g.tagline}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-display">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider",
                      g.status === "available"
                        ? "bg-neon-green/15 text-neon-green"
                        : "bg-neutral-100 text-space-navy/55",
                    )}
                  >
                    {g.status === "available" ? "Live" : "Soon"}
                  </span>
                  <span className="text-space-navy/55">{g.pp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trivia bank */}
      <section className="kid-card overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-display font-bold text-base text-space-navy">
            Trivia question bank
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 rounded-xl border border-neutral-200 bg-white focus-within:border-ds-orange transition-colors">
              <Search className="w-4 h-4 text-space-navy/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search questions"
                className="py-2 outline-none font-body text-sm w-44 sm:w-56 bg-transparent"
              />
            </div>
            <div className="inline-flex p-1 rounded-xl bg-neutral-100">
              {(["all", "easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "px-3 py-1 rounded-lg font-display font-semibold text-xs transition-colors capitalize",
                    difficulty === d
                      ? "bg-white text-space-navy shadow-sm"
                      : "text-space-navy/55 hover:text-space-navy",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-space-navy/55 font-display font-semibold">
              <tr>
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Question</th>
                <th className="px-5 py-3">Answer</th>
                <th className="px-5 py-3">Difficulty</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="px-5 py-3 text-sm text-space-navy/45 font-display tabular-nums">
                    {i + 1}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-display font-medium text-sm text-space-navy">
                      {t.question}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-sm text-space-navy/65">
                    {t.options[t.correctIndex]}
                  </td>
                  <td className="px-5 py-3">
                    <DifficultyBadge d={t.difficulty} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(t)}
                        title="Edit"
                        className="grid place-items-center w-8 h-8 rounded-lg hover:bg-neutral-100 text-space-navy/60"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(t)}
                        title="Delete"
                        className="grid place-items-center w-8 h-8 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit modal */}
      {(adding || editing) && (
        <TriviaEditor
          initial={editing ?? undefined}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={saveQuestion}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-space-navy">
              Delete this question?
            </h2>
            <p className="text-sm text-space-navy/60">
              "<strong className="text-space-navy">{confirmDelete.question}</strong>" will no longer appear in any quiz round.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteQuestion(confirmDelete.id)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-display font-semibold text-sm hover:brightness-110"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TriviaEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial?: EditableTrivia;
  onCancel: () => void;
  onSave: (q: EditableTrivia) => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [options, setOptions] = useState<string[]>(initial?.options ?? ["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex ?? 0);
  const [explainer, setExplainer] = useState(initial?.explainer ?? "");
  const [diff, setDiff] = useState<TriviaQuestion["difficulty"]>(initial?.difficulty ?? "easy");

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="font-display font-bold text-xl text-space-navy">
          {initial ? "Edit question" : "Add trivia question"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              id: initial?.id ?? `t-${Date.now()}`,
              question,
              options,
              correctIndex,
              explainer,
              difficulty: diff,
            });
          }}
          className="space-y-3"
        >
          <Field label="Question">
            <textarea
              rows={2}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm resize-none"
              placeholder="What is..."
            />
          </Field>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCorrectIndex(i)}
                className={cn(
                  "grid place-items-center w-9 h-9 rounded-full text-xs font-display font-bold shrink-0 transition-colors",
                  correctIndex === i
                    ? "bg-neon-green text-white"
                    : "bg-neutral-100 text-space-navy/55 hover:bg-neutral-200",
                )}
                title={correctIndex === i ? "This is the correct answer" : "Mark as correct"}
              >
                {String.fromCharCode(65 + i)}
              </button>
              <input
                required
                value={opt}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
              />
            </div>
          ))}
          <p className="text-xs text-space-navy/55 font-body">
            Tap a letter to mark it as the correct answer (currently:{" "}
            <strong className="text-neon-green">{String.fromCharCode(65 + correctIndex)}</strong>).
          </p>

          <Field label="Difficulty">
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value as typeof diff)}
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange outline-none p-3 font-body text-sm"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </Field>
          <Field label="Explainer (shown after answer)">
            <input
              required
              value={explainer}
              onChange={(e) => setExplainer(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 focus:border-ds-orange focus:ring-2 focus:ring-ds-orange/15 outline-none p-3 font-body text-sm"
            />
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
              className="flex-1 px-4 py-3 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm hover:brightness-110"
            >
              {initial ? "Save changes" : "Save question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DifficultyBadge({ d }: { d: TriviaQuestion["difficulty"] }) {
  const map = {
    easy: { bg: "bg-neon-green/15", color: "text-neon-green" },
    medium: { bg: "bg-electric-cyan/15", color: "text-electric-cyan" },
    hard: { bg: "bg-ds-orange/15", color: "text-ds-orange" },
  } as const;
  const c = map[d];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-display font-semibold uppercase tracking-wider capitalize",
        c.bg,
        c.color,
      )}
    >
      {d}
    </span>
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
      <p className="font-display font-bold text-2xl text-space-navy mt-1 tabular-nums">
        {value}
      </p>
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
