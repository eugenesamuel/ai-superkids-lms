import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import { sendEmail, announcementEmail } from "@/lib/email/sendgrid";

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "batch";
  batchId?: string | null;
  channels: { inApp: boolean; email: boolean };
  sentAt: string;
  reads: number;
  total: number;
};

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ announcements: [] });
  try {
    const snap = await db
      .collection("announcements")
      .orderBy("sentAt", "desc")
      .limit(20)
      .get();
    return NextResponse.json({
      announcements: snap.docs.map((d) => d.data() as Announcement),
    });
  } catch (err) {
    console.error("[announcements GET]", err);
    return NextResponse.json({ announcements: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    title?: string;
    body?: string;
    audience?: "all" | "batch";
    batchId?: string | null;
    channels?: { inApp: boolean; email: boolean };
  };
  if (!body.title || !body.body || !body.audience) {
    return NextResponse.json(
      { error: "title, body, audience required" },
      { status: 400 },
    );
  }

  // Estimate reach (read receipts come in over time; we just record total here)
  const db = getDb();
  let total = 0;
  if (db) {
    try {
      if (body.audience === "all") {
        const snap = await db.collection("leaderboard").count().get();
        total = snap.data().count ?? 0;
      } else if (body.batchId) {
        const batchDoc = await db
          .collection("batches")
          .doc(body.batchId)
          .get();
        const ids =
          (batchDoc.data()?.parentUids as string[] | undefined) ?? [];
        total = ids.length;
      }
    } catch {
      total = 0;
    }
  }

  const announcement: Announcement = {
    id: `ann-${Date.now()}`,
    title: body.title,
    body: body.body,
    audience: body.audience,
    batchId: body.batchId ?? null,
    channels: body.channels ?? { inApp: true, email: false },
    sentAt: new Date().toISOString(),
    reads: 0,
    total,
  };

  if (!db) return NextResponse.json({ ok: true, announcement, mock: true });

  try {
    await db
      .collection("announcements")
      .doc(announcement.id)
      .set(announcement);

    // Fan out emails if email channel is enabled (fire-and-forget)
    if (announcement.channels.email) {
      (async () => {
        try {
          let emails: string[] = [];
          if (announcement.audience === "all") {
            const usersSnap = await db
              .collection("users")
              .where("isActive", "==", true)
              .get();
            emails = usersSnap.docs
              .map((d) => d.data().email as string | undefined)
              .filter((e): e is string => Boolean(e));
          } else if (announcement.batchId) {
            const batchDoc = await db
              .collection("batches")
              .doc(announcement.batchId)
              .get();
            const ids =
              (batchDoc.data()?.parentUids as string[] | undefined) ?? [];
            for (const id of ids) {
              const u = await db.collection("users").doc(id).get();
              const e = u.data()?.email as string | undefined;
              if (e) emails.push(e);
            }
          }
          if (emails.length > 0) {
            await sendEmail(
              announcementEmail({
                to: emails,
                title: announcement.title,
                body: announcement.body,
              }),
            );
          }
        } catch (err) {
          console.warn("[announcements POST] fan-out failed:", err);
        }
      })();
    }

    return NextResponse.json({ ok: true, announcement });
  } catch (err) {
    console.error("[announcements POST]", err);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
