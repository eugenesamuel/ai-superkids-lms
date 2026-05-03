/**
 * Seeds Firestore from mock-data.ts.
 *
 * Run locally:
 *   gcloud auth application-default login
 *   GCP_PROJECT_ID=gen-lang-client-0242584615 npx tsx scripts/seed-firestore.ts
 *
 * Idempotent: re-running upserts the same docs.
 */

import { Firestore } from "@google-cloud/firestore";
import {
  mockBatches,
  mockBatchRecordings,
  mockMissions,
  mockPlanets,
  mockActivities,
  mockDocuments,
  mockEarnedBadges,
  mockLeaderboard,
} from "../lib/mock-data";
import { BADGES } from "../lib/badges";

async function main() {
  const projectId = process.env.GCP_PROJECT_ID;
  if (!projectId) {
    console.error("Set GCP_PROJECT_ID, e.g. gen-lang-client-0242584615");
    process.exit(1);
  }
  const db = new Firestore({ projectId });
  console.log(`Seeding Firestore in project ${projectId}...`);

  await batchWrite(db, "planets", mockPlanets, (p) => p.id);
  await batchWrite(db, "missions", mockMissions, (m) => m.id);
  await batchWrite(db, "activities", mockActivities, (a) => a.id);
  await batchWrite(db, "documents", mockDocuments, (d) => d.id);
  await batchWrite(db, "batches", mockBatches, (b) => b.id);
  await batchWrite(db, "recordings", mockBatchRecordings, (r) => r.id);
  await batchWrite(db, "badges", BADGES, (b) => b.id);
  await batchWrite(
    db,
    "leaderboard",
    mockLeaderboard.map((u) => ({
      uid: u.uid,
      firstName: u.firstName,
      city: u.city,
      powerPoints: u.powerPoints,
      missionsDone: u.missionsDone,
      avatarId: u.avatarId,
    })),
    (u) => u.uid,
  );

  // Demo user doc
  const demoUser = mockLeaderboard.find((u) => u.uid === "demo-parent-1");
  if (demoUser) {
    await db
      .collection("users")
      .doc(demoUser.uid)
      .set({
        uid: demoUser.uid,
        email: "demo@digitalscholar.in",
        role: "parent",
        childName: demoUser.firstName,
        childAge: 13,
        childAvatarId: demoUser.avatarId,
        city: demoUser.city,
        batchId: "batch-chennai-may-2026",
        powerPoints: demoUser.powerPoints,
        consentGivenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        streakDays: 4,
        isActive: true,
      });
    // Earned badges as subcollection
    for (const b of mockEarnedBadges) {
      await db
        .collection("users")
        .doc(demoUser.uid)
        .collection("userBadges")
        .doc(b.id)
        .set(b);
    }
    console.log(`✓ users/${demoUser.uid} (with ${mockEarnedBadges.length} badges)`);
  }

  console.log("\n✅ Seed complete.");
}

async function batchWrite<T>(
  db: Firestore,
  collection: string,
  rows: T[],
  idFn: (row: T) => string,
) {
  const batch = db.batch();
  for (const row of rows) {
    batch.set(db.collection(collection).doc(idFn(row)), row as Record<string, unknown>);
  }
  await batch.commit();
  console.log(`✓ ${collection}: ${rows.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
