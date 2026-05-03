import type { BadgeId } from "./badges";

export type Role = "parent" | "admin";
export type City = "Chennai" | "Mumbai" | "Online";

export type User = {
  uid: string;
  email: string;
  role: Role;
  childName: string;
  childAge: number;
  childAvatarId: number;
  city: City;
  batchId: string;
  consentGivenAt: string | null;
  createdAt: string;
  powerPoints: number;
  streakDays: number;
  lastActiveAt: string;
};

export type PlanetStatus = "completed" | "current" | "locked";

export type Planet = {
  id: string;
  planetNumber: number;
  weekRange: string;
  title: string;
  topic: string;
  color: string;
  status: PlanetStatus;
  progressPercent: number; // 0-100
};

export type MissionStatus = "completed" | "available" | "locked";

export type Mission = {
  id: string;
  planetId: string;
  orderIndex: number;
  title: string;
  description: string;
  durationMins: number;
  xpReward: number;
  status: MissionStatus;
  recordingStoragePath: string | null;
  scheduledAt: string | null;
  liveClassId: string | null;
};

export type ActivityType = "quiz" | "upload" | "text" | "link";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type Activity = {
  id: string;
  missionId: string;
  type: ActivityType;
  title: string;
  prompt: string;
  quiz?: QuizQuestion;
};

export type DocumentType = "pdf" | "doc" | "slides" | "link" | "image";

export type Document = {
  id: string;
  missionId: string;
  title: string;
  type: DocumentType;
  size?: string;
  url: string;
};

export type LiveClass = {
  id: string;
  batchId: string;
  missionId: string | null;
  title: string;
  scheduledAt: string;
  joinUrl: string;
  recordingStoragePath: string | null;
  status: "scheduled" | "live" | "completed";
};

export type RecordingStatus = "ready" | "processing" | "pending";

export type BatchRecording = {
  id: string;
  batchId: string;
  missionId: string;
  title: string;
  recordingPath: string | null;
  uploadedAt: string | null;
  durationMins: number;
  views: number;
  status: RecordingStatus;
  sizeMB?: number;
};

export type Batch = {
  id: string;
  name: string;
  city: City;
  startDate: string;
  trainerName: string;
  parentUids: string[];
  status: "active" | "scheduled" | "completed";
  progressPercent: number;
};

export type LeaderboardEntry = {
  uid: string;
  firstName: string;
  city: City;
  powerPoints: number;
  missionsDone: number;
  avatarId: number;
};

export type EarnedBadge = {
  id: BadgeId;
  earnedAt: string;
};
