import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import type { Batch, City } from "@/lib/types";
import { mockBatches } from "@/lib/mock-data";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ batches: mockBatches });
  try {
    const snap = await db.collection("batches").get();
    if (snap.empty) return NextResponse.json({ batches: mockBatches });
    return NextResponse.json({
      batches: snap.docs.map((d) => d.data() as Batch),
    });
  } catch (err) {
    console.error("[batches GET]", err);
    return NextResponse.json({ batches: mockBatches });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Batch>;
  const { name, city, startDate } = body;
  if (!name || !city || !startDate) {
    return NextResponse.json(
      { error: "name, city, startDate required" },
      { status: 400 },
    );
  }

  const id =
    "batch-" +
    String(city).toLowerCase().replace(/\s+/g, "-") +
    "-" +
    new Date(startDate).toISOString().slice(0, 7);

  const batch: Batch = {
    id,
    name,
    city: city as City,
    startDate,
    trainerName: body.trainerName ?? "Eugene Samuel",
    parentUids: [],
    status: "scheduled",
    progressPercent: 0,
  };

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: true, batch, mock: true });
  }
  try {
    await db.collection("batches").doc(id).set(batch);
    return NextResponse.json({ ok: true, batch });
  } catch (err) {
    console.error("[batches POST]", err);
    return NextResponse.json({ error: "Firestore write failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
