// Spec §7 — Power Points and Levels.
export const PP_ACTIONS = {
  WATCH_MISSION: 20, // when video hits 80%
  COMPLETE_ACTIVITY: 50,
  PERFECT_QUIZ: 75,
  DAILY_STREAK: 10,
  SUBMIT_PROJECT: 100,
  ATTEND_LIVE: 30,
} as const;

export type PPAction = keyof typeof PP_ACTIONS;

export type Level = {
  level: number;
  title: string;
  min: number;
  max: number;
};

export const LEVELS: Level[] = [
  { level: 1, title: "AI Rookie", min: 0, max: 200 },
  { level: 2, title: "AI Learner", min: 201, max: 500 },
  { level: 3, title: "AI Builder", min: 501, max: 1000 },
  { level: 4, title: "AI Creator", min: 1001, max: 2000 },
  { level: 5, title: "AI Innovator", min: 2001, max: 3500 },
  { level: 6, title: "AI Wizard", min: 3501, max: 5000 },
  { level: 7, title: "AI Champion", min: 5001, max: 7000 },
  { level: 8, title: "AI Master", min: 7001, max: 9500 },
  { level: 9, title: "AI Legend", min: 9501, max: 12000 },
  { level: 10, title: "AI Superhero", min: 12001, max: Number.MAX_SAFE_INTEGER },
];

export function getLevel(pp: number): Level {
  return LEVELS.find((l) => pp >= l.min && pp <= l.max) ?? LEVELS[0];
}

export function progressInLevel(pp: number): { percent: number; toNext: number } {
  const lvl = getLevel(pp);
  if (lvl.level === 10) return { percent: 100, toNext: 0 };
  const span = lvl.max - lvl.min + 1;
  const into = pp - lvl.min;
  return {
    percent: Math.max(0, Math.min(100, Math.round((into / span) * 100))),
    toNext: lvl.max + 1 - pp,
  };
}
