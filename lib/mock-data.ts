import type {
  Activity,
  Batch,
  BatchRecording,
  Document,
  EarnedBadge,
  LeaderboardEntry,
  LiveClass,
  Mission,
  Planet,
  User,
} from "./types";

// One demo parent so the app runs without GCP credentials.
export const mockUser: User = {
  uid: "demo-parent-1",
  email: "demo@digitalscholar.in",
  role: "parent",
  childName: "Aarav",
  childAge: 13,
  childAvatarId: 3,
  city: "Chennai",
  batchId: "batch-chennai-may-2026",
  consentGivenAt: "2026-04-15T10:00:00.000Z",
  createdAt: "2026-04-15T10:00:00.000Z",
  powerPoints: 420,
  streakDays: 4,
  lastActiveAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
};

// Five Planets per spec §4.
export const mockPlanets: Planet[] = [
  {
    id: "planet-1",
    planetNumber: 1,
    weekRange: "Week 1-2",
    title: "AI Foundations",
    topic: "Introduction to AI",
    color: "#00D4FF",
    status: "completed",
    progressPercent: 100,
  },
  {
    id: "planet-2",
    planetNumber: 2,
    weekRange: "Week 3-4",
    title: "Prompt Engineering",
    topic: "Talking to AI effectively",
    color: "#FF6B35",
    status: "current",
    progressPercent: 40,
  },
  {
    id: "planet-3",
    planetNumber: 3,
    weekRange: "Week 5-6",
    title: "Building with AI",
    topic: "Creator tools and workflows",
    color: "#A855F7",
    status: "locked",
    progressPercent: 0,
  },
  {
    id: "planet-4",
    planetNumber: 4,
    weekRange: "Week 7-8",
    title: "Vibe Coding",
    topic: "AI-assisted programming",
    color: "#00E676",
    status: "locked",
    progressPercent: 0,
  },
  {
    id: "planet-5",
    planetNumber: 5,
    weekRange: "Week 9-10",
    title: "Final Project",
    topic: "Build something real",
    color: "#FFD700",
    status: "locked",
    progressPercent: 0,
  },
];

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

export const mockMissions: Mission[] = [
  // Planet 1 — all complete
  {
    id: "mission-1",
    planetId: "planet-1",
    orderIndex: 1,
    title: "What AI actually is",
    description: "An honest introduction to large language models, what they're good at, and what they're not.",
    durationMins: 35,
    xpReward: 20,
    status: "completed",
    recordingStoragePath: "/mock/recording-1.mp4",
    scheduledAt: daysAgo(13),
    liveClassId: "live-1",
  },
  {
    id: "mission-2",
    planetId: "planet-1",
    orderIndex: 2,
    title: "How models learn from data",
    description: "Training data, parameters, and why the same prompt can give different answers.",
    durationMins: 40,
    xpReward: 20,
    status: "completed",
    recordingStoragePath: "/mock/recording-2.mp4",
    scheduledAt: daysAgo(11),
    liveClassId: "live-2",
  },
  // Planet 2 — current
  {
    id: "mission-3",
    planetId: "planet-2",
    orderIndex: 1,
    title: "Your first useful prompt",
    description: "Specificity, context, and constraints — the three things that turn vague output into great output.",
    durationMins: 45,
    xpReward: 20,
    status: "completed",
    recordingStoragePath: "/mock/recording-3.mp4",
    scheduledAt: daysAgo(6),
    liveClassId: "live-3",
  },
  {
    id: "mission-4",
    planetId: "planet-2",
    orderIndex: 2,
    title: "Prompt patterns that work",
    description: "Roles, examples, step-by-step — proven structures pros use to get reliable results.",
    durationMins: 45,
    xpReward: 20,
    status: "available",
    recordingStoragePath: "/mock/recording-4.mp4",
    scheduledAt: daysAgo(2),
    liveClassId: "live-4",
  },
  {
    id: "mission-5",
    planetId: "planet-2",
    orderIndex: 3,
    title: "Building a story-writing assistant",
    description: "Combine everything you've learned into one project: an AI assistant that writes in your voice.",
    durationMins: 50,
    xpReward: 20,
    status: "locked",
    recordingStoragePath: null,
    scheduledAt: null,
    liveClassId: null,
  },
];

export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    missionId: "mission-3",
    type: "quiz",
    title: "Pick the strongest prompt",
    prompt: "Which one will produce the best output?",
    quiz: {
      question:
        "Which prompt would help AI write the best short story about a space cat?",
      options: [
        "Write a story.",
        "Tell me about cats.",
        "Write a 5-paragraph story about Whiskers, a brave space cat who saves Mars.",
        "Do something cool.",
      ],
      correctIndex: 2,
    },
  },
  {
    id: "activity-2",
    missionId: "mission-4",
    type: "upload",
    title: "Try a pattern in ChatGPT",
    prompt:
      "Pick one of the prompt patterns from this session, try it in ChatGPT, and upload a screenshot of the result.",
  },
  {
    id: "activity-3",
    missionId: "mission-3",
    type: "text",
    title: "Reflect on what worked",
    prompt:
      "In 2-3 sentences: what was one prompt change that improved the output the most?",
  },
  {
    id: "activity-4",
    missionId: "mission-4",
    type: "link",
    title: "Share your project link",
    prompt:
      "Paste a link to a Replit, Google Doc, or anywhere your work lives so we can review it.",
  },
];

// Batches — cohorts the platform serves.
export const mockBatches: Batch[] = [
  {
    id: "batch-chennai-may-2026",
    name: "Chennai May 2026",
    city: "Chennai",
    startDate: "2026-05-04",
    trainerName: "Eugene Samuel",
    parentUids: ["demo-parent-1", "u-2", "u-5", "u-7"],
    status: "active",
    progressPercent: 38,
  },
  {
    id: "batch-mumbai-may-2026",
    name: "Mumbai May 2026",
    city: "Mumbai",
    startDate: "2026-05-06",
    trainerName: "Eugene Samuel",
    parentUids: ["u-1", "u-4", "u-8", "u-11"],
    status: "active",
    progressPercent: 32,
  },
  {
    id: "batch-online-jun-2026",
    name: "Online June 2026",
    city: "Online",
    startDate: "2026-06-01",
    trainerName: "Eugene Samuel",
    parentUids: ["u-3", "u-6", "u-9"],
    status: "scheduled",
    progressPercent: 0,
  },
];

// Per-batch recordings. Every recording belongs to ONE batch + ONE mission.
// Same mission can have a recording for one batch and not another (Mumbai batch missed live class? still pending).
export const mockBatchRecordings: BatchRecording[] = [
  // Chennai — well ahead, 4 of 5 missions recorded
  { id: "r-c-1", batchId: "batch-chennai-may-2026", missionId: "mission-1", title: "What AI actually is", recordingPath: "/mock/c-1.mp4", uploadedAt: daysAgo(13), durationMins: 35, views: 22, status: "ready", sizeMB: 412 },
  { id: "r-c-2", batchId: "batch-chennai-may-2026", missionId: "mission-2", title: "How models learn from data", recordingPath: "/mock/c-2.mp4", uploadedAt: daysAgo(11), durationMins: 40, views: 19, status: "ready", sizeMB: 478 },
  { id: "r-c-3", batchId: "batch-chennai-may-2026", missionId: "mission-3", title: "Your first useful prompt", recordingPath: "/mock/c-3.mp4", uploadedAt: daysAgo(6), durationMins: 45, views: 14, status: "ready", sizeMB: 524 },
  { id: "r-c-4", batchId: "batch-chennai-may-2026", missionId: "mission-4", title: "Prompt patterns that work", recordingPath: "/mock/c-4.mp4", uploadedAt: daysAgo(2), durationMins: 45, views: 8, status: "ready", sizeMB: 540 },
  // mission-5 not recorded yet for any batch
  // Mumbai — slightly behind, 3 of 5 recorded
  { id: "r-m-1", batchId: "batch-mumbai-may-2026", missionId: "mission-1", title: "What AI actually is", recordingPath: "/mock/m-1.mp4", uploadedAt: daysAgo(11), durationMins: 38, views: 16, status: "ready", sizeMB: 446 },
  { id: "r-m-2", batchId: "batch-mumbai-may-2026", missionId: "mission-2", title: "How models learn from data", recordingPath: "/mock/m-2.mp4", uploadedAt: daysAgo(9), durationMins: 42, views: 14, status: "ready", sizeMB: 502 },
  { id: "r-m-3", batchId: "batch-mumbai-may-2026", missionId: "mission-3", title: "Your first useful prompt", recordingPath: "/mock/m-3.mp4", uploadedAt: daysAgo(4), durationMins: 47, views: 11, status: "processing" }, // currently transcoding
  // mission-4 was a live class today for Mumbai — Eugene hasn't uploaded yet
  // mission-5 not yet
  // Online — just started, no recordings yet
  { id: "r-o-1", batchId: "batch-online-jun-2026", missionId: "mission-1", title: "What AI actually is", recordingPath: null, uploadedAt: null, durationMins: 0, views: 0, status: "pending" },
];

export function getBatchById(id: string): Batch | undefined {
  return mockBatches.find((b) => b.id === id);
}

export function getRecordingFor(missionId: string, batchId: string): BatchRecording | undefined {
  return mockBatchRecordings.find(
    (r) => r.missionId === missionId && r.batchId === batchId,
  );
}

// All recordings (across batches) for a single mission — admin view helper.
export function getAllRecordingsForMission(missionId: string): BatchRecording[] {
  return mockBatchRecordings.filter((r) => r.missionId === missionId);
}

// All recordings for a single batch — used by /admin/recordings tabs and parent lesson page.
export function getRecordingsForBatch(batchId: string): BatchRecording[] {
  return mockBatchRecordings.filter((r) => r.batchId === batchId);
}

// Documents = slide decks, PDFs, external readings attached to a mission.
export const mockDocuments: Document[] = [
  { id: "doc-1", missionId: "mission-1", title: "What AI actually is — slides", type: "slides", size: "2.4 MB", url: "#" },
  { id: "doc-2", missionId: "mission-1", title: "Glossary of AI terms", type: "pdf", size: "0.8 MB", url: "#" },
  { id: "doc-3", missionId: "mission-2", title: "How training data shapes models", type: "pdf", size: "1.6 MB", url: "#" },
  { id: "doc-4", missionId: "mission-3", title: "Prompt template cheat sheet", type: "pdf", size: "1.1 MB", url: "#" },
  { id: "doc-5", missionId: "mission-3", title: "Reading: How LLMs work (Stephen Wolfram)", type: "link", url: "https://example.com/" },
  { id: "doc-6", missionId: "mission-4", title: "Pattern library — 12 prompt structures", type: "pdf", size: "3.2 MB", url: "#" },
  { id: "doc-7", missionId: "mission-4", title: "Session 4 slides", type: "slides", size: "4.1 MB", url: "#" },
];

// Sessions = recorded class videos (post-Zoom). Source of truth for the /sessions library.
export const mockLiveClasses: LiveClass[] = [
  {
    id: "live-4",
    batchId: "batch-chennai-may-2026",
    missionId: "mission-4",
    title: "Prompt patterns that work",
    scheduledAt: daysAgo(2),
    joinUrl: "",
    recordingStoragePath: "/mock/recording-4.mp4",
    status: "completed",
  },
  {
    id: "live-3",
    batchId: "batch-chennai-may-2026",
    missionId: "mission-3",
    title: "Your first useful prompt",
    scheduledAt: daysAgo(6),
    joinUrl: "",
    recordingStoragePath: "/mock/recording-3.mp4",
    status: "completed",
  },
  {
    id: "live-2",
    batchId: "batch-chennai-may-2026",
    missionId: "mission-2",
    title: "How models learn from data",
    scheduledAt: daysAgo(11),
    joinUrl: "",
    recordingStoragePath: "/mock/recording-2.mp4",
    status: "completed",
  },
  {
    id: "live-1",
    batchId: "batch-chennai-may-2026",
    missionId: "mission-1",
    title: "What AI actually is",
    scheduledAt: daysAgo(13),
    joinUrl: "",
    recordingStoragePath: "/mock/recording-1.mp4",
    status: "completed",
  },
];

export const mockEarnedBadges: EarnedBadge[] = [
  { id: "first_launch", earnedAt: daysAgo(13) },
  { id: "builder_badge", earnedAt: daysAgo(10) },
  { id: "streak_star", earnedAt: daysAgo(2) },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { uid: "u-1", firstName: "Priya", city: "Mumbai", powerPoints: 1240, missionsDone: 12, avatarId: 7 },
  { uid: "u-2", firstName: "Arjun", city: "Chennai", powerPoints: 1080, missionsDone: 11, avatarId: 2 },
  { uid: "u-3", firstName: "Diya", city: "Online", powerPoints: 920, missionsDone: 10, avatarId: 9 },
  { uid: "u-4", firstName: "Kabir", city: "Mumbai", powerPoints: 860, missionsDone: 9, avatarId: 4 },
  { uid: "u-5", firstName: "Saanvi", city: "Chennai", powerPoints: 720, missionsDone: 8, avatarId: 11 },
  { uid: "u-6", firstName: "Veer", city: "Online", powerPoints: 690, missionsDone: 8, avatarId: 5 },
  { uid: "u-7", firstName: "Anaya", city: "Chennai", powerPoints: 640, missionsDone: 7, avatarId: 8 },
  { uid: "u-8", firstName: "Reyansh", city: "Mumbai", powerPoints: 580, missionsDone: 7, avatarId: 1 },
  { uid: "u-9", firstName: "Myra", city: "Online", powerPoints: 510, missionsDone: 6, avatarId: 12 },
  { uid: "demo-parent-1", firstName: "Aarav", city: "Chennai", powerPoints: 420, missionsDone: 5, avatarId: 3 },
  { uid: "u-11", firstName: "Ishaan", city: "Mumbai", powerPoints: 380, missionsDone: 5, avatarId: 6 },
];

// Streak heatmap — last 70 days, 1 = active
export const mockStreakDays: number[] = (() => {
  const days = new Array(70).fill(0);
  [0, 1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 17, 18, 22, 24, 25, 28, 30, 31, 33, 35, 38, 40, 42, 45, 47, 50, 52, 55, 58, 60, 63, 65].forEach((i) => {
    if (i < 70) days[i] = 1;
  });
  return days;
})();

// Trainer note from Eugene
export const mockTrainerNote = {
  author: "Eugene Samuel",
  body:
    "Aarav has been engaged through the past two sessions. His prompts are getting noticeably more specific, and he's asking sharper questions. Encourage him to keep experimenting between classes.",
  date: daysAgo(2),
};
