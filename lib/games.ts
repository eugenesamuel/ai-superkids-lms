// Game catalog + trivia question bank.

export type GameCategory = "quiz" | "puzzle" | "memory" | "challenge";

export type GameDef = {
  slug: string; // route segment under /games
  title: string;
  tagline: string;
  description: string;
  category: GameCategory;
  pp: string; // PP reward summary
  timeMins: number; // approx playtime
  status: "available" | "coming_soon";
  accent: string; // brand color for the card
  bestScore?: number;
};

export const GAMES: GameDef[] = [
  {
    slug: "quick-quiz",
    title: "Rapid Fire Quiz",
    tagline: "Speed-round MCQs · 5 questions · 15s each",
    description:
      "Test your AI knowledge against the clock. Earn +10 PP per correct answer plus a +5 PP speed bonus when you answer in under 5 seconds.",
    category: "quiz",
    pp: "Up to +75 PP",
    timeMins: 2,
    status: "available",
    accent: "#FF6B35",
    bestScore: 60,
  },
  {
    slug: "memory-match",
    title: "AI Memory Match",
    tagline: "Flip cards · match pairs · beat the clock",
    description:
      "Match pairs of AI tools and concepts. Faster matches = bigger Power Points payout.",
    category: "memory",
    pp: "Up to +50 PP",
    timeMins: 3,
    status: "coming_soon",
    accent: "#A855F7",
  },
  {
    slug: "prompt-puzzle",
    title: "Prompt Puzzle",
    tagline: "Drag the pieces to build the perfect prompt",
    description:
      "Snippets are scrambled — re-order them into a clear, specific prompt. Five rounds, harder each time.",
    category: "puzzle",
    pp: "Up to +60 PP",
    timeMins: 4,
    status: "coming_soon",
    accent: "#00D4FF",
  },
  {
    slug: "spot-the-better",
    title: "Spot the Better Prompt",
    tagline: "A vs B · which one wins?",
    description:
      "We show you two prompts. You pick the one that would get a stronger answer from AI. Ten rounds, +5 PP each.",
    category: "challenge",
    pp: "Up to +50 PP",
    timeMins: 3,
    status: "coming_soon",
    accent: "#00E676",
  },
  {
    slug: "ai-vocab",
    title: "AI Vocab Word Hunt",
    tagline: "Find AI terms hidden in a 12×12 grid",
    description:
      "Classic word search with 10 AI vocabulary words. +3 PP per word, +20 PP completion bonus.",
    category: "puzzle",
    pp: "Up to +50 PP",
    timeMins: 5,
    status: "coming_soon",
    accent: "#FFD700",
  },
  {
    slug: "daily-challenge",
    title: "Daily Challenge",
    tagline: "Today only · double Power Points",
    description:
      "A different mini-game every day. Today's challenge counts double toward the leaderboard.",
    category: "challenge",
    pp: "+50 PP (2× today)",
    timeMins: 2,
    status: "coming_soon",
    accent: "#FF4D4D",
  },
];

export type TriviaQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explainer: string;
  difficulty: "easy" | "medium" | "hard";
};

export const TRIVIA: TriviaQuestion[] = [
  {
    id: "t1",
    question: "What does the 'AI' in ChatGPT stand for?",
    options: [
      "Automatic Interface",
      "Artificial Intelligence",
      "Algorithmic Instinct",
      "Auto-Indexing",
    ],
    correctIndex: 1,
    explainer:
      "AI = Artificial Intelligence. It's software that learns patterns from huge amounts of data.",
    difficulty: "easy",
  },
  {
    id: "t2",
    question: "Which of these makes a prompt MORE effective?",
    options: [
      "Adding emojis everywhere",
      "Being vague so the AI is creative",
      "Specific role + format + example",
      "Writing in all caps",
    ],
    correctIndex: 2,
    explainer:
      "Specificity wins. Tell the AI who it is, what format you want, and show one example.",
    difficulty: "easy",
  },
  {
    id: "t3",
    question: "What is a 'token' in an AI model?",
    options: [
      "A login password",
      "A unit of text — about 4 characters",
      "A free trial credit",
      "A type of robot",
    ],
    correctIndex: 1,
    explainer:
      "Tokens are how AI breaks down text. Roughly 4 characters or 3/4 of a word per token.",
    difficulty: "medium",
  },
  {
    id: "t4",
    question: "Why do AI models sometimes 'hallucinate'?",
    options: [
      "They get tired",
      "They predict plausible-sounding text without checking facts",
      "Their batteries are low",
      "Someone unplugged them",
    ],
    correctIndex: 1,
    explainer:
      "AI predicts the next likely word. If it doesn't actually know, it can confidently make stuff up.",
    difficulty: "medium",
  },
  {
    id: "t5",
    question: "Which is NOT a real AI model?",
    options: ["Claude", "Gemini", "GPT-4", "Brainwave-9000"],
    correctIndex: 3,
    explainer:
      "Claude (Anthropic), Gemini (Google), and GPT-4 (OpenAI) are real. Brainwave-9000 is made up.",
    difficulty: "easy",
  },
  {
    id: "t6",
    question: "What does 'open source' mean for an AI model?",
    options: [
      "Anyone can see and modify the code",
      "It's free forever",
      "It only runs outdoors",
      "It writes its own source code",
    ],
    correctIndex: 0,
    explainer:
      "Open source means the model's code (and sometimes weights) are public so anyone can study or improve it.",
    difficulty: "medium",
  },
  {
    id: "t7",
    question: "Best way to ask AI to write a poem about your dog?",
    options: [
      "Poem about dog.",
      "Write me something nice.",
      "Write a 4-line funny rhyming poem about my golden retriever, Max, who loves bacon.",
      "Dog poem now please thanks.",
    ],
    correctIndex: 2,
    explainer:
      "Specific length + tone + name + key detail (bacon!) gives AI everything it needs to do a great job.",
    difficulty: "easy",
  },
  {
    id: "t8",
    question: "If AI gives a wrong answer, you should...",
    options: [
      "Believe it anyway — AI is always right",
      "Cross-check important answers with another source",
      "Give up using AI forever",
      "Restart your computer",
    ],
    correctIndex: 1,
    explainer:
      "AI is a powerful helper but it can be wrong. For anything important, double-check.",
    difficulty: "easy",
  },
  {
    id: "t9",
    question: "What's a 'system prompt'?",
    options: [
      "A reminder that pops up on your screen",
      "Hidden instructions that set the AI's role and rules",
      "An error message",
      "A type of malware",
    ],
    correctIndex: 1,
    explainer:
      "System prompts shape how the AI behaves — its personality, what it can and can't do.",
    difficulty: "hard",
  },
  {
    id: "t10",
    question: "Which task is AI generally GOOD at?",
    options: [
      "Predicting tomorrow's lottery numbers",
      "Tasting your dinner",
      "Summarizing a long article",
      "Knowing what you secretly think",
    ],
    correctIndex: 2,
    explainer:
      "Summarization, drafting, brainstorming — anything text-pattern-based — is where AI shines.",
    difficulty: "easy",
  },
  {
    id: "t11",
    question: "What does 'fine-tuning' an AI model mean?",
    options: [
      "Cleaning the keyboard",
      "Training it more on a specific task or dataset",
      "Adjusting the brightness",
      "Putting it on silent mode",
    ],
    correctIndex: 1,
    explainer:
      "Fine-tuning takes a general model and trains it further on your specific data so it gets really good at one job.",
    difficulty: "hard",
  },
  {
    id: "t12",
    question: "Best practice when sharing AI output as your own work?",
    options: [
      "Hide it forever",
      "Copy and paste exactly",
      "Use it as a starting point, then make it your own + cite when needed",
      "Tell everyone you wrote a robot",
    ],
    correctIndex: 2,
    explainer:
      "Use AI as a thinking partner, not a replacement. Add your own ideas and be transparent.",
    difficulty: "medium",
  },
];

export function pickRandomTrivia(n: number, seed?: number): TriviaQuestion[] {
  const arr = [...TRIVIA];
  // Simple seeded shuffle for stable demo runs (or pure random if no seed)
  const rand = seed
    ? mulberry32(seed)
    : Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
