import { NextResponse } from "next/server";
import {
  getPlanets,
  getMissions,
  getActivities,
  getDocuments,
  getLeaderboard,
  getCurrentUser,
} from "@/lib/data";

// One-shot endpoint: returns all the read-only data the kid app needs in a single call.
// Pages on the parent side hydrate from this, so they show real Firestore data instead
// of the in-memory mock fallbacks.

export async function GET() {
  try {
    const [planets, missions, activities, documents, leaderboard, user] = await Promise.all([
      getPlanets(),
      getMissions(),
      getActivities(),
      getDocuments(),
      getLeaderboard(),
      getCurrentUser(),
    ]);
    return NextResponse.json({
      planets,
      missions,
      activities,
      documents,
      leaderboard,
      user,
    });
  } catch (err) {
    console.error("[public GET]", err);
    return NextResponse.json({ error: "load failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
