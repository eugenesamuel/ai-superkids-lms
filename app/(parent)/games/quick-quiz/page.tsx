"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Timer,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { pickRandomTrivia, type TriviaQuestion } from "@/lib/games";
import { ConfettiBlast } from "@/components/games/ConfettiBlast";
import { cn } from "@/lib/utils";

const QUESTIONS_PER_ROUND = 5;
const TIME_PER_QUESTION = 15; // seconds
const PP_CORRECT = 10;
const PP_SPEED_BONUS = 5;
const SPEED_BONUS_THRESHOLD = 5; // seconds

type Phase = "idle" | "playing" | "result";

type Answer = {
  q: TriviaQuestion;
  picked: number | null;
  timeUsed: number;
  earnedPP: number;
  correct: boolean;
  speedBonus: boolean;
};

export default function QuickQuizPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(0);
  const [confetti, setConfetti] = useState(0);

  function start() {
    const qs = pickRandomTrivia(QUESTIONS_PER_ROUND);
    setQuestions(qs);
    setIdx(0);
    setAnswers([]);
    setPicked(null);
    setSecondsLeft(TIME_PER_QUESTION);
    setQuestionStartedAt(Date.now());
    setPhase("playing");
  }

  function handlePick(i: number, autoTimeout = false) {
    if (picked !== null || phase !== "playing") return;
    const q = questions[idx];
    const timeUsed = (Date.now() - questionStartedAt) / 1000;
    const correct = !autoTimeout && i === q.correctIndex;
    const speedBonus = correct && timeUsed < SPEED_BONUS_THRESHOLD;
    const earnedPP =
      (correct ? PP_CORRECT : 0) + (speedBonus ? PP_SPEED_BONUS : 0);
    setPicked(autoTimeout ? -1 : i);
    if (correct) setConfetti((c) => c + 1);
    setAnswers((arr) => [
      ...arr,
      {
        q,
        picked: autoTimeout ? null : i,
        timeUsed,
        earnedPP,
        correct,
        speedBonus,
      },
    ]);
    // Brief reveal then advance
    window.setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setPhase("result");
      } else {
        setIdx(idx + 1);
        setPicked(null);
        setSecondsLeft(TIME_PER_QUESTION);
        setQuestionStartedAt(Date.now());
      }
    }, 1500);
  }

  useEffect(() => {
    if (phase !== "playing") return;
    if (picked !== null) return; // pause timer once answered
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          handlePick(-1, true); // auto-timeout
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, picked, idx]);

  const totalPP = answers.reduce((s, a) => s + a.earnedPP, 0);
  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy = answers.length === 0 ? 0 : Math.round((correctCount / answers.length) * 100);

  return (
    <div className="px-6 py-6 space-y-6">
      <ConfettiBlast trigger={confetti} />

      <Link
        href="/games"
        className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display font-medium tap-scale"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Games
      </Link>

      <AnimatePresence mode="wait">
        {phase === "idle" && <IdleScreen key="idle" onStart={start} />}
        {phase === "playing" && (
          <PlayingScreen
            key="playing"
            question={questions[idx]}
            qIndex={idx}
            total={questions.length}
            secondsLeft={secondsLeft}
            picked={picked}
            onPick={handlePick}
          />
        )}
        {phase === "result" && (
          <ResultScreen
            key="result"
            answers={answers}
            totalPP={totalPP}
            correctCount={correctCount}
            accuracy={accuracy}
            onRestart={start}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Idle (intro) ───────────────────────────────────────────────── */

function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="kid-card p-8 sm:p-10 text-center max-w-2xl mx-auto"
    >
      <span className="grid place-items-center w-16 h-16 rounded-2xl bg-ds-orange text-white mx-auto shadow-md">
        <Zap className="w-8 h-8" />
      </span>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-space-navy mt-4">
        Rapid Fire Quiz
      </h1>
      <p className="text-space-navy/65 mt-2 max-w-md mx-auto">
        5 questions · 15 seconds each · earn up to 75 Power Points.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mt-6 text-left">
        <Rule
          icon={<Timer className="w-4 h-4" />}
          title="15 sec / question"
          body="Pick fast, but think. Timer auto-submits."
        />
        <Rule
          icon={<CheckCircle2 className="w-4 h-4" />}
          title="+10 PP correct"
          body="Wrong answers are zero — no penalty."
        />
        <Rule
          icon={<Sparkles className="w-4 h-4" />}
          title="+5 PP speed bonus"
          body="Answer in under 5 seconds for the bonus."
        />
      </div>

      <button
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 bg-ds-orange text-white font-display font-semibold text-base px-7 py-3 rounded-full tap-scale hover:brightness-110 transition shadow-md"
      >
        Start Quiz
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function Rule({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
      <div className="flex items-center gap-1.5 text-ds-orange font-display font-semibold text-xs uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <p className="text-xs text-space-navy/65 mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}

/* ─── Playing screen ────────────────────────────────────────────── */

function PlayingScreen({
  question,
  qIndex,
  total,
  secondsLeft,
  picked,
  onPick,
}: {
  question: TriviaQuestion;
  qIndex: number;
  total: number;
  secondsLeft: number;
  picked: number | null;
  onPick: (i: number) => void;
}) {
  if (!question) return null;
  const timerColor =
    secondsLeft > 8 ? "#00C853" : secondsLeft > 4 ? "#FF6B35" : "#FF4D4D";
  const correct = question.correctIndex;
  const colors = ["#FF6B35", "#00D4FF", "#A855F7", "#00E676"];
  const letters = ["A", "B", "C", "D"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-5 max-w-3xl mx-auto"
    >
      {/* Top progress bar + timer */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs uppercase tracking-wide text-space-navy/55 font-display font-semibold">
              Question {qIndex + 1} of {total}
            </span>
            <span className="font-display font-bold text-sm text-space-navy/70 tabular-nums">
              {Math.round(((qIndex) / total) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
            <motion.div
              key={qIndex}
              className="h-full bg-ds-orange"
              initial={{ width: `${(qIndex / total) * 100}%` }}
              animate={{ width: `${((qIndex + (picked !== null ? 1 : 0)) / total) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div
          className="grid place-items-center w-16 h-16 rounded-2xl text-white font-display font-bold tabular-nums shrink-0 transition-colors"
          style={{ background: timerColor }}
        >
          <Timer className="w-3.5 h-3.5 -mb-0.5" />
          <span className="text-lg leading-none">{secondsLeft}s</span>
        </div>
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="kid-card p-6 sm:p-8"
      >
        <p className="text-xs uppercase tracking-wider text-ds-orange font-display font-semibold">
          {labelDifficulty(question.difficulty)}
        </p>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-space-navy leading-tight mt-2">
          {question.question}
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {question.options.map((opt, i) => {
            const showResult = picked !== null;
            const isCorrect = i === correct;
            const isPicked = i === picked;
            return (
              <motion.button
                key={i}
                disabled={showResult}
                onClick={() => onPick(i)}
                whileHover={!showResult ? { y: -2 } : undefined}
                whileTap={!showResult ? { scale: 0.97 } : undefined}
                animate={
                  showResult && isPicked && !isCorrect
                    ? { x: [0, -6, 6, -6, 6, 0] }
                    : undefined
                }
                transition={{ duration: 0.4 }}
                className={cn(
                  "relative w-full text-left rounded-xl p-4 border-2 transition-all flex items-center gap-3",
                  !showResult && "bg-white border-neutral-200 hover:border-ds-orange",
                  showResult && isCorrect && "bg-neon-green/10 border-neon-green",
                  showResult && isPicked && !isCorrect && "bg-ds-orange/5 border-ds-orange/40",
                  showResult && !isPicked && !isCorrect && "opacity-60",
                )}
              >
                <span
                  className="grid place-items-center w-9 h-9 rounded-full font-display font-bold text-white text-sm shrink-0"
                  style={{ background: colors[i % 4] }}
                >
                  {letters[i] ?? i + 1}
                </span>
                <span className="font-body text-sm sm:text-base text-space-navy">{opt}</span>
                {showResult && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-neon-green ml-auto shrink-0" />
                )}
                {showResult && isPicked && !isCorrect && (
                  <XCircle className="w-5 h-5 text-ds-orange ml-auto shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {picked !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mt-5 rounded-xl p-4 text-sm leading-relaxed",
                picked === correct
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                  : "bg-neutral-100 text-space-navy/75 border border-neutral-200",
              )}
            >
              <p className="font-display font-semibold mb-0.5">
                {picked === correct ? "Correct! ⚡" : picked === -1 ? "Out of time!" : "Not quite"}
              </p>
              <p className="font-body">{question.explainer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function labelDifficulty(d: TriviaQuestion["difficulty"]) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

/* ─── Result screen ─────────────────────────────────────────────── */

function ResultScreen({
  answers,
  totalPP,
  correctCount,
  accuracy,
  onRestart,
}: {
  answers: Answer[];
  totalPP: number;
  correctCount: number;
  accuracy: number;
  onRestart: () => void;
}) {
  const speedBonusCount = answers.filter((a) => a.speedBonus).length;
  const isPerfect = correctCount === answers.length && answers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto space-y-5"
    >
      {/* Hero */}
      <div className="kid-card p-8 sm:p-10 text-center">
        <span className="grid place-items-center w-20 h-20 rounded-3xl bg-gradient-to-br from-ds-orange to-electric-cyan text-white mx-auto shadow-md">
          <Trophy className="w-10 h-10" />
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-space-navy mt-4">
          {isPerfect ? "Perfect run!" : "Round complete"}
        </h1>
        <p className="text-space-navy/65 mt-1">
          {correctCount} of {answers.length} correct · {accuracy}% accuracy
        </p>

        <div className="inline-flex items-center gap-2 mt-6 bg-ds-orange/10 border border-ds-orange/20 rounded-full px-5 py-2.5">
          <Sparkles className="w-4 h-4 text-ds-orange" />
          <span className="font-display font-bold text-2xl text-ds-orange tabular-nums">
            +{totalPP}
          </span>
          <span className="font-display text-sm text-space-navy/65">Power Points</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 text-left">
          <Stat label="Correct" value={`${correctCount}/${answers.length}`} accent="#00C853" />
          <Stat label="Speed bonuses" value={`${speedBonusCount}× +5 PP`} accent="#FF6B35" />
          <Stat
            label="Avg. time"
            value={`${(
              answers.reduce((s, a) => s + a.timeUsed, 0) / Math.max(1, answers.length)
            ).toFixed(1)}s`}
            accent="#00D4FF"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-7 flex-wrap">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 bg-ds-orange text-white font-display font-semibold text-sm px-6 py-3 rounded-full tap-scale hover:brightness-110 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            Play again
          </button>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-space-navy font-display font-semibold text-sm px-6 py-3 rounded-full tap-scale hover:bg-neutral-50"
          >
            More games
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-space-navy font-display font-semibold text-sm px-6 py-3 rounded-full tap-scale hover:bg-neutral-50"
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Per-question recap */}
      <div className="kid-card p-5 sm:p-6">
        <h2 className="font-display font-bold text-base text-space-navy mb-3">
          Question recap
        </h2>
        <ol className="space-y-3">
          {answers.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={cn(
                  "grid place-items-center w-8 h-8 rounded-full font-display font-bold text-white text-xs shrink-0 mt-0.5",
                  a.correct ? "bg-neon-green" : "bg-space-navy/50",
                )}
              >
                {a.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-space-navy">
                  {a.q.question}
                </p>
                <p className="text-xs text-space-navy/60 mt-0.5">
                  {a.correct ? "Correct" : a.picked === null ? "Timed out" : "Wrong"} ·{" "}
                  {a.timeUsed.toFixed(1)}s ·{" "}
                  <span className="font-display font-semibold text-ds-orange">
                    +{a.earnedPP} PP
                  </span>
                  {a.speedBonus && <span className="ml-1 text-ds-orange">⚡ Speed bonus</span>}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
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
      <div className="text-[10px] uppercase tracking-wide font-display font-semibold" style={{ color: accent }}>
        {label}
      </div>
      <p className="font-display font-bold text-base text-space-navy mt-0.5">{value}</p>
    </div>
  );
}
