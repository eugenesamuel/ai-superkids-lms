import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import type { Batch } from "@/lib/types";
import { mockBatches } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  if (!db) {
    const b = mockBatches.find((x) => x.id === params.id);
    return b ? NextResponse.json({ batch: b }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const doc = await db.collection("batches").doc(params.id).get();
    if (!doc.exists) {
      const b = mockBatches.find((x) => x.id === params.id);
      return b ? NextResponse.json({ batch: b }) : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ batch: doc.data() as Batch });
  } catch (err) {
    console.error("[batch GET]", err);
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = (await req.json()) as Partial<Batch>;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, mock: true });
  try {
    await db
      .collection("batches")
      .doc(params.id)
      .set(body, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[batch PATCH]", err);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, mock: true });
  try {
    await db
      .collection("batches")
      .doc(params.id)
      .set({ status: "completed", archivedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[batch DELETE]", err);
    return NextResponse.json({ error: "archive failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
