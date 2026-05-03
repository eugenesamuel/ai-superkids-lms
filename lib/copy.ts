// Spec §15 — kid-friendly copy map. Use these everywhere in /(parent)/**.
export const copy = {
  welcomeBack: (name: string) =>
    `Hey ${name}, you're back! Let's build something amazing today`,
  course: "Planet",
  module: "World",
  lesson: "Mission",
  submitButton: "Send My Work",
  errorLine: "Oops! Try that again",
  loading: "Getting your stuff ready...",
  locked: "Finish the last mission to unlock this!",
  completed: "Done! You're crushing it!",
  assignment: "Your Challenge",
  xp: "Power Points",
  student: "Explorer",
  score: "Power Points Earned",
  continueMission: "Continue Mission",
  joinLive: "Join Live Class",
  switchToParent: "Switch to Parent View",
  backToLearning: "Back to Learning",
  backToMap: "Back to Map",
} as const;

// Forbidden words: anything generic that should be replaced with the kid-friendly version above.
export const forbiddenInParentUI = [
  "Submit",
  "Lesson",
  "Module",
  "Student",
  "XP",
  "Score",
  "Course",
];
