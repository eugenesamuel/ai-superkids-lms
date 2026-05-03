import { NextRequest, NextResponse } from "next/server";

// Admin-only: returns a V4-signed PUT URL for direct browser-to-bucket upload of a recording.
// In production: verify the caller's Firebase ID token, check role==admin, then sign.

export async function POST(req: NextRequest) {
  const { lessonId, contentType } = (await req.json()) as {
    lessonId?: string;
    contentType?: string;
  };
  if (!lessonId || !contentType) {
    return NextResponse.json({ error: "lessonId and contentType required" }, { status: 400 });
  }

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.VIDEO_BUCKET;
  if (useMock) {
    return NextResponse.json({
      url: null,
      message: "Mock mode — recording uploads disabled",
    });
  }

  // ---- Real signed PUT URL (uncomment once @google-cloud/storage is installed) ----
  // const { Storage } = await import("@google-cloud/storage");
  // const storage = new Storage();
  // const file = storage.bucket(process.env.VIDEO_BUCKET!).file(`lessons/${lessonId}.mp4`);
  // const [url] = await file.getSignedUrl({
  //   version: "v4",
  //   action: "write",
  //   expires: Date.now() + 60 * 60 * 1000,
  //   contentType,
  // });
  // return NextResponse.json({ url });

  return NextResponse.json({ url: null });
}

export const runtime = "nodejs";
