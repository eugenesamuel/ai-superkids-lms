// Data access layer.
// - When Firestore is configured (NEXT_PUBLIC_USE_MOCK_DATA != "true" + GCP_PROJECT_ID set + Admin SDK available),
//   reads come from Firestore.
// - Otherwise falls back to in-memory mock data.
//
// Pages call these helpers instead of importing mockX directly, so the same UI
// works in both modes with no rewrites.
//
// All functions are async, even mock-mode ones, so the caller signature stays
// consistent when Firestore is wired in.

import {
  mockBatches,
  mockBatchRecordings,
  mockMissions,
  mockPlanets,
  mockActivities,
  mockDocuments,
  mockEarnedBadges,
  mockLeaderboard,
  mockTrainerNote,
  mockUser,
  mockStreakDays,
} from "./mock-data";
import type {
  Activity,
  Batch,
  BatchRecording,
  Document as Doc,
  EarnedBadge,
  LeaderboardEntry,
  Mission,
  Planet,
  User,
} from "./types";
import { getDb } from "./firebase/admin";

function isMockMode(): boolean {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") return true;
  if (!process.env.GCP_PROJECT_ID) return true;
  return false;
}

/* ─── Planets ──────────────────────────────────────────────── */

export async function getPlanets(): Promise<Planet[]> {
  if (isMockMode()) return mockPlanets;
  const db = getDb();
  if (!db) return mockPlanets;
  const snap = await db.collection("planets").orderBy("planetNumber").get();
  if (snap.empty) return mockPlanets;
  return snap.docs.map((d) => d.data() as Planet);
}

/* ─── Missions ─────────────────────────────────────────────── */

export async function getMissions(planetId?: string): Promise<Mission[]> {
  if (isMockMode()) {
    return planetId
      ? mockMissions.filter((m) => m.planetId === planetId)
      : mockMissions;
  }
  const db = getDb();
  if (!db) return mockMissions;
  let q = db.collection("missions").orderBy("orderIndex");
  if (planetId) q = q.where("planetId", "==", planetId) as typeof q;
  const snap = await q.get();
  if (snap.empty) return mockMissions;
  return snap.docs.map((d) => d.data() as Mission);
}

/* ─── Activities ───────────────────────────────────────────── */

export async function getActivities(missionId?: string): Promise<Activity[]> {
  if (isMockMode()) {
    return missionId
      ? mockActivities.filter((a) => a.missionId === missionId)
      : mockActivities;
  }
  const db = getDb();
  if (!db) return mockActivities;
  const ref = missionId
    ? db.collection("activities").where("missionId", "==", missionId)
    : db.collection("activities");
  const snap = await ref.get();
  if (snap.empty) return mockActivities;
  return snap.docs.map((d) => d.data() as Activity);
}

/* ─── Documents ────────────────────────────────────────────── */

export async function getDocuments(missionId?: string): Promise<Doc[]> {
  if (isMockMode()) {
    return missionId
      ? mockDocuments.filter((d) => d.missionId === missionId)
      : mockDocuments;
  }
  const db = getDb();
  if (!db) return mockDocuments;
  const ref = missionId
    ? db.collection("documents").where("missionId", "==", missionId)
    : db.collection("documents");
  const snap = await ref.get();
  if (snap.empty) return mockDocuments;
  return snap.docs.map((d) => d.data() as Doc);
}

/* ─── Batches ──────────────────────────────────────────────── */

export async function getBatches(): Promise<Batch[]> {
  if (isMockMode()) return mockBatches;
  const db = getDb();
  if (!db) return mockBatches;
  const snap = await db.collection("batches").get();
  if (snap.empty) return mockBatches;
  return snap.docs.map((d) => d.data() as Batch);
}

export async function getBatchById(id: string): Promise<Batch | undefined> {
  const all = await getBatches();
  return all.find((b) => b.id === id);
}

/* ─── Batch recordings ──────────────────────────────────────── */

export async function getRecordingsForBatch(
  batchId: string,
): Promise<BatchRecording[]> {
  if (isMockMode()) return mockBatchRecordings.filter((r) => r.batchId === batchId);
  const db = getDb();
  if (!db) return mockBatchRecordings.filter((r) => r.batchId === batchId);
  const snap = await db
    .collection("recordings")
    .where("batchId", "==", batchId)
    .get();
  if (snap.empty) return mockBatchRecordings.filter((r) => r.batchId === batchId);
  return snap.docs.map((d) => d.data() as BatchRecording);
}

export async function getRecordingFor(
  missionId: string,
  batchId: string,
): Promise<BatchRecording | undefined> {
  if (isMockMode()) {
    return mockBatchRecordings.find(
      (r) => r.missionId === missionId && r.batchId === batchId,
    );
  }
  const db = getDb();
  if (!db) {
    return mockBatchRecordings.find(
      (r) => r.missionId === missionId && r.batchId === batchId,
    );
  }
  const snap = await db
    .collection("recordings")
    .where("batchId", "==", batchId)
    .where("missionId", "==", missionId)
    .limit(1)
    .get();
  if (snap.empty) {
    return mockBatchRecordings.find(
      (r) => r.missionId === missionId && r.batchId === batchId,
    );
  }
  return snap.docs[0].data() as BatchRecording;
}

/* ─── Leaderboard ──────────────────────────────────────────── */

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (isMockMode()) return mockLeaderboard;
  const db = getDb();
  if (!db) return mockLeaderboard;
  const snap = await db
    .collection("leaderboard")
    .orderBy("powerPoints", "desc")
    .limit(50)
    .get();
  if (snap.empty) return mockLeaderboard;
  return snap.docs.map((d) => d.data() as LeaderboardEntry);
}

/* ─── Current user (mock-only for now — real auth pending) ─── */

export async function getCurrentUser(): Promise<User> {
  return mockUser;
}

/* ─── Earned badges ────────────────────────────────────────── */

export async function getEarnedBadges(uid?: string): Promise<EarnedBadge[]> {
  if (isMockMode() || !uid) return mockEarnedBadges;
  const db = getDb();
  if (!db) return mockEarnedBadges;
  const snap = await db
    .collection("users")
    .doc(uid)
    .collection("userBadges")
    .get();
  if (snap.empty) return mockEarnedBadges;
  return snap.docs.map((d) => d.data() as EarnedBadge);
}

/* ─── Misc ─────────────────────────────────────────────────── */

export async function getStreakDays(): Promise<number[]> {
  return mockStreakDays;
}

export async function getTrainerNote() {
  return mockTrainerNote;
}
