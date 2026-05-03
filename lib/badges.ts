// Spec §4 page 7 — Achievements.
export type BadgeId =
  | "first_launch"
  | "prompt_pro"
  | "builder_badge"
  | "streak_star"
  | "ai_whiz"
  | "graduation_crown"
  | "speed_learner";

export type Badge = {
  id: BadgeId;
  name: string;
  description: string;
  trigger: string;
  icon: string; // lucide-react icon name
  color: string;
};

export const BADGES: Badge[] = [
  {
    id: "first_launch",
    name: "First Launch",
    description: "You finished your very first mission!",
    trigger: "Complete Mission 1",
    icon: "Rocket",
    color: "#FF6B35",
  },
  {
    id: "prompt_pro",
    name: "Prompt Pro",
    description: "You're a master at talking to AI!",
    trigger: "Complete Planet 2",
    icon: "Wand2",
    color: "#00D4FF",
  },
  {
    id: "builder_badge",
    name: "Builder Badge",
    description: "You sent in your first activity!",
    trigger: "Submit first activity",
    icon: "Hammer",
    color: "#FFB800",
  },
  {
    id: "streak_star",
    name: "Streak Star",
    description: "5 days in a row — wow!",
    trigger: "5-day login streak",
    icon: "Flame",
    color: "#FF4D4D",
  },
  {
    id: "ai_whiz",
    name: "AI Whiz",
    description: "You aced every quiz!",
    trigger: "Complete all quizzes",
    icon: "Brain",
    color: "#A855F7",
  },
  {
    id: "graduation_crown",
    name: "Graduation Crown",
    description: "You finished the whole AI SuperKids program!",
    trigger: "Finish full program",
    icon: "Crown",
    color: "#FFD700",
  },
  {
    id: "speed_learner",
    name: "Speed Learner",
    description: "3 missions in one day — speed of light!",
    trigger: "3 missions in one day",
    icon: "Zap",
    color: "#00E676",
  },
];

export function getBadge(id: BadgeId): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
