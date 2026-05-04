import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import type { BatchRecording } from "@/lib/types";
import { mockBatchRecordings, mockMissions } from "@/lib/mock-data";

// GET /api/admin/recordings?batchId=...   — list recordings for a batch
// POST /api/admin/recordings              — create or upsert a recording (after Cloud Storage upload)

export async function GET(req: NextRequest) {
  const batchId = req.nextUrl.searchParams.get("batchId");
  if (!batchId) {
    return NextResponse.json({ error: "batchId required" }, { status: 400 });
  }
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      recordings: mockBatchRecordings.filter((r) => r.batchId === batchId),
    });
  }
  try {
    const snap = await db
      .collection("recordings")
      .where("batchId", "==", batchId)
      .get();
    if (snap.empty) {
      return NextResponse.json({
        recordings: mockBatchRecordings.filter((r) => r.batchId === batchId),
      });
    }
    return NextResponse.json({
      recordings: snap.docs.map((d) => d.data() as BatchRecording),
    });
  } catch (err) {
    console.error("[recordings GET]", err);
    return NextResponse.json({
      recordings: mockBatchRecordings.filter((r) => r.batchId === batchId),
    });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    batchId?: string;
    missionId?: string;
    sizeMB?: number;
    durationMins?: number;
  };
  const { batchId, missionId, sizeMB, durationMins } = body;
  if (!batchId || !missionId) {
    return NextResponse.json(
      { error: "batchId, missionId required" },
      { status: 400 },
    );
  }

  const mission = mockMissions.find((m) => m.id === missionId);
  const id = `r-${batchId}-${missionId}`;
  const recording: BatchRecording = {
    id,
    batchId,
    missionId,
    title: mission?.title ?? missionId,
    recordingPath: `recordings/${batchId}/${missionId}.mp4`,
    uploadedAt: new Date().toISOString(),
    durationMins: durationMins ?? mission?.durationMins ?? 45,
    views: 0,
    status: "ready",
    sizeMB: sizeMB ?? 400,
  };

  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, recording, mock: true });

  try {
    await db.collection("recordings").doc(id).set(recording);
    return NextResponse.json({ ok: true, recording });
  } catch (err) {
    console.error("[recordings POST]", err);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
