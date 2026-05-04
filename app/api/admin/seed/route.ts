import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import {
  mockBatches,
  mockBatchRecordings,
  mockMissions,
  mockPlanets,
  mockActivities,
  mockDocuments,
  mockEarnedBadges,
  mockLeaderboard,
} from "@/lib/mock-data";
import { BADGES } from "@/lib/badges";

// Idempotent seed — re-running upserts the same docs.
// Protected by SEED_TOKEN: caller must send `Authorization: Bearer <SEED_TOKEN>`.
//
// Trigger from terminal once:
//   curl -X POST -H "Authorization: Bearer $SEED_TOKEN" https://YOUR_URL/api/admin/seed

export async function POST(req: NextRequest) {
  const expected = process.env.SEED_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "SEED_TOKEN not configured" },
      { status: 503 },
    );
  }
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbOrNull = getDb();
  if (!dbOrNull) {
    return NextResponse.json(
      { error: "Firestore not configured (GCP_PROJECT_ID + ADC required)" },
      { status: 503 },
    );
  }
  const db = dbOrNull;

  const counts: Record<string, number> = {};

  async function batchWrite<T>(
    collection: string,
    rows: T[],
    idFn: (row: T) => string,
  ) {
    if (rows.length === 0) return;
    // Firestore batch limit is 500 — chunk if needed
    for (let i = 0; i < rows.length; i += 450) {
      const chunk = rows.slice(i, i + 450);
      const batch = db.batch();
      for (const row of chunk) {
        batch.set(
          db.collection(collection).doc(idFn(row)),
          row as Record<string, unknown>,
        );
      }
      await batch.commit();
    }
    counts[collection] = (counts[collection] ?? 0) + rows.length;
  }

  await batchWrite("planets", mockPlanets, (p) => p.id);
  await batchWrite("missions", mockMissions, (m) => m.id);
  await batchWrite("activities", mockActivities, (a) => a.id);
  await batchWrite("documents", mockDocuments, (d) => d.id);
  await batchWrite("batches", mockBatches, (b) => b.id);
  await batchWrite("recordings", mockBatchRecordings, (r) => r.id);
  await batchWrite("badges", BADGES, (b) => b.id);
  await batchWrite(
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

  // Demo user + their earned badges as a subcollection
  const demoUser = mockLeaderboard.find((u) => u.uid === "demo-parent-1");
  if (demoUser) {
    await db.collection("users").doc(demoUser.uid).set({
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
    for (const b of mockEarnedBadges) {
      await db
        .collection("users")
        .doc(demoUser.uid)
        .collection("userBadges")
        .doc(b.id)
        .set(b);
    }
    counts["users"] = 1;
    counts["users/demo-parent-1/userBadges"] = mockEarnedBadges.length;
  }

  return NextResponse.json({ ok: true, counts });
}

export const runtime = "nodejs";
export const maxDuration = 60;
