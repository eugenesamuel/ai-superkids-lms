"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Clock,
  Zap,
  Lock,
  ChevronRight,
  Gamepad2,
  Timer,
  Brain,
  Puzzle,
  Layers,
  Scan,
  Search,
} from "lucide-react";
import { GAMES, type GameDef } from "@/lib/games";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "quick-quiz": Brain,
  "memory-match": Layers,
  "prompt-puzzle": Puzzle,
  "spot-the-better": Scan,
  "ai-vocab": Search,
  "daily-challenge": Sparkles,
};

export default function GamesPage() {
  const featured = GAMES.find((g) => g.slug === "daily-challenge") ?? GAMES[0];
  const grid = GAMES.filter((g) => g.slug !== featured.slug);
  const totalEarned = 60; // mock — sum of best scores

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-space-navy leading-tight">
            Games
          </h2>
          <p className="text-sm text-space-navy/60 mt-1 max-w-xl">
            Earn extra Power Points by playing. Quizzes, puzzles, and AI challenges that climb the leaderboard.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 font-display">
          <Sparkles className="w-3.5 h-3.5 text-ds-orange" />
          <span className="text-ds-orange font-bold tabular-nums">{totalEarned}</span>
          <span className="text-space-navy/55 text-sm">PP from games</span>
        </span>
      </div>

      {/* Featured / daily challenge banner */}
      <FeaturedGame game={featured} />

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile icon={<Trophy className="w-4 h-4" />} label="Games played" value="3" accent="#FF6B35" />
        <StatTile icon={<Zap className="w-4 h-4" />} label="Best streak" value="6 in a row" accent="#A855F7" />
        <StatTile icon={<Clock className="w-4 h-4" />} label="Fastest answer" value="2.4s" accent="#00D4FF" />
        <StatTile icon={<Sparkles className="w-4 h-4" />} label="Today bonus" value="2× PP" accent="#00C853" />
      </div>

      {/* Game grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-space-navy">All games</h3>
          <span className="text-xs text-space-navy/50 font-display">
            {grid.filter((g) => g.status === "available").length} playable now · {grid.filter((g) => g.status === "coming_soon").length} coming soon
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grid.map((g, i) => (
            <GameCard key={g.slug} game={g} index={i} Icon={ICONS[g.slug] ?? Gamepad2} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Featured / daily challenge ─────────────────────────────────── */

function FeaturedGame({ game }: { game: GameDef }) {
  const playable = game.status === "available";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl text-white p-6 sm:p-8"
      style={{
        background: `linear-gradient(135deg, ${game.accent} 0%, #1F2740 100%)`,
      }}
    >
      <span
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
        style={{ background: `${game.accent}55`, filter: "blur(40px)" }}
      />
      <div className="relative grid sm:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-display font-semibold text-white/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Today's Featured · 2× Power Points
          </span>
          <h3 className="font-display font-bold text-2xl sm:text-3xl mt-2 leading-tight">
            {game.title}
          </h3>
          <p className="text-sm sm:text-base text-white/80 mt-2 max-w-md">{game.description}</p>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Tag>{game.pp}</Tag>
            <Tag><Timer className="w-3 h-3" /> {game.timeMins} min</Tag>
            {playable ? (
              <Link
                href={`/games/${game.slug}`}
                className="ml-1 inline-flex items-center gap-1.5 bg-white text-space-navy font-display font-semibold text-sm px-5 py-2.5 rounded-full tap-scale hover:bg-white/90 transition"
              >
                Play now
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="ml-1 inline-flex items-center gap-1.5 bg-white/15 text-white/85 font-display font-semibold text-sm px-5 py-2.5 rounded-full">
                <Lock className="w-3.5 h-3.5" />
                Coming soon
              </span>
            )}
          </div>
        </div>
        <Sparkles className="w-24 h-24 sm:w-28 sm:h-28 text-white/15 hidden sm:block" />
      </div>
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur text-white text-xs font-display font-semibold px-3 py-1.5 rounded-full">
      {children}
    </span>
  );
}

/* ─── Stat tile ──────────────────────────────────────────────────── */

function StatTile({
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
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide font-display font-semibold" style={{ color: accent }}>
        {icon}
        {label}
      </div>
      <p className="font-display font-bold text-xl text-space-navy mt-1 tabular-nums">{value}</p>
    </div>
  );
}

/* ─── Game card in grid ──────────────────────────────────────────── */

function GameCard({
  game,
  index,
  Icon,
}: {
  game: GameDef;
  index: number;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const playable = game.status === "available";
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={playable ? { y: -2 } : undefined}
      className={`kid-card overflow-hidden h-full flex flex-col transition-shadow ${
        playable ? "hover:shadow-md" : "opacity-75"
      }`}
    >
      {/* Visual header */}
      <div
        className="relative px-5 py-7 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${game.accent}1F 0%, ${game.accent}08 100%)`,
        }}
      >
        <span
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
          style={{ background: `${game.accent}26`, filter: "blur(24px)" }}
        />
        <span
          className="relative grid place-items-center w-12 h-12 rounded-2xl text-white shadow-md"
          style={{ background: game.accent }}
        >
          <Icon className="w-6 h-6" />
        </span>
        {!playable && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur text-[10px] font-display font-semibold text-space-navy/60">
            <Lock className="w-3 h-3" />
            Soon
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <span
          className="self-start text-[10px] uppercase tracking-wider font-display font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${game.accent}15`, color: game.accent }}
        >
          {labelFor(game.category)}
        </span>
        <h4 className="font-display font-bold text-base text-space-navy leading-tight mt-2">
          {game.title}
        </h4>
        <p className="text-xs text-space-navy/55 mt-1 leading-relaxed">{game.tagline}</p>

        <div className="flex items-center gap-3 text-xs text-space-navy/55 mt-3 font-body">
          <span className="inline-flex items-center gap-1">
            <Timer className="w-3 h-3" /> {game.timeMins} min
          </span>
          <span className="inline-flex items-center gap-1 font-display font-semibold text-ds-orange">
            <Sparkles className="w-3 h-3" /> {game.pp}
          </span>
        </div>

        {playable && game.bestScore != null && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-space-navy/60 font-display">
              Your best
            </span>
            <span className="font-display font-bold text-sm text-space-navy">
              {game.bestScore} PP
            </span>
          </div>
        )}

        <div className="mt-4">
          {playable ? (
            <span className="inline-flex items-center gap-1 bg-ds-orange text-white font-display font-semibold text-sm px-4 py-2 rounded-full">
              Play <ChevronRight className="w-4 h-4" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-neutral-100 text-space-navy/55 font-display font-semibold text-sm px-4 py-2 rounded-full">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (!playable) return inner;
  return (
    <Link href={`/games/${game.slug}`} className="block tap-scale h-full">
      {inner}
    </Link>
  );
}

function labelFor(c: GameDef["category"]): string {
  if (c === "quiz") return "Quiz";
  if (c === "puzzle") return "Puzzle";
  if (c === "memory") return "Memory";
  return "Challenge";
}
