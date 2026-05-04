import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import type { LeaderboardEntry, City } from "@/lib/types";
import { mockLeaderboard } from "@/lib/mock-data";
import { sendEmail, welcomeEmail } from "@/lib/email/sendgrid";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ students: mockLeaderboard });
  try {
    const snap = await db
      .collection("leaderboard")
      .orderBy("powerPoints", "desc")
      .limit(200)
      .get();
    if (snap.empty) return NextResponse.json({ students: mockLeaderboard });
    return NextResponse.json({
      students: snap.docs.map((d) => d.data() as LeaderboardEntry),
    });
  } catch (err) {
    console.error("[students GET]", err);
    return NextResponse.json({ students: mockLeaderboard });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    email?: string;
    childName?: string;
    childAge?: number;
    city?: City;
    batchId?: string;
  };
  const { email, childName, childAge, city, batchId } = body;
  if (!email || !childName || !childAge || !city || !batchId) {
    return NextResponse.json(
      { error: "email, childName, childAge, city, batchId required" },
      { status: 400 },
    );
  }

  const uid = `parent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const avatarId = (childName.charCodeAt(0) % 12) + 1;

  const userDoc = {
    uid,
    email,
    role: "parent",
    childName,
    childAge,
    childAvatarId: avatarId,
    city,
    batchId,
    powerPoints: 0,
    consentGivenAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    streakDays: 0,
    isActive: true,
  };

  const leaderboardDoc: LeaderboardEntry = {
    uid,
    firstName: childName,
    city,
    powerPoints: 0,
    missionsDone: 0,
    avatarId,
  };

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: true, uid, mock: true });
  }
  try {
    await db.collection("users").doc(uid).set(userDoc);
    await db.collection("leaderboard").doc(uid).set(leaderboardDoc);
    // Add UID to batch.parentUids
    await db
      .collection("batches")
      .doc(batchId)
      .set(
        {
          parentUids: [
            ...(((await db.collection("batches").doc(batchId).get()).data()
              ?.parentUids as string[]) ?? []),
            uid,
          ],
        },
        { merge: true },
      );

    // Fire-and-forget welcome email (don't block the response on it)
    const origin = req.nextUrl.origin;
    sendEmail(
      welcomeEmail({
        childName,
        parentEmail: email,
        loginUrl: `${origin}/`,
      }),
    ).then((r) => {
      if (!r.ok) console.warn("[students POST] welcome email skipped:", r.error);
    });

    return NextResponse.json({ ok: true, uid });
  } catch (err) {
    console.error("[students POST]", err);
    return NextResponse.json({ error: "create failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
