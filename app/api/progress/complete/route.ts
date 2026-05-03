import { NextRequest, NextResponse } from "next/server";
import { PP_ACTIONS } from "@/lib/xp";

// Called when a video hits 80% watched. Awards Power Points + checks badge unlocks.
// In production: verify Firebase ID token, write progress doc, evaluate badges.

export async function POST(req: NextRequest) {
  const { lessonId, watchPercent } = (await req.json()) as {
    lessonId?: string;
    watchPercent?: number;
  };
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const eligible = (watchPercent ?? 0) >= 80;
  const xpEarned = eligible ? PP_ACTIONS.WATCH_MISSION : 0;

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.GCP_PROJECT_ID;
  if (useMock) {
    return NextResponse.json({
      ok: true,
      lessonId,
      xpEarned,
      newBadges: eligible && lessonId === "mission-1" ? ["first_launch"] : [],
    });
  }

  // ---- Real Firestore write + badge evaluation ----
  // const admin = await import("@/lib/firebase/admin");
  // const decoded = await admin.verifyTokenFromRequest(req);
  // const userRef = admin.db.collection("users").doc(decoded.uid);
  // await userRef.collection("progress").doc(lessonId).set({
  //   completedAt: admin.serverTimestamp(),
  //   watchPercent,
  //   xpEarned,
  // }, { merge: true });
  // await userRef.update({ powerPoints: admin.increment(xpEarned) });
  // const newBadges = await evaluateBadges(decoded.uid);
  // return NextResponse.json({ ok: true, lessonId, xpEarned, newBadges });

  return NextResponse.json({ ok: true, lessonId, xpEarned, newBadges: [] });
}

export const runtime = "nodejs";
