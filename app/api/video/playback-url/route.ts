import { NextRequest, NextResponse } from "next/server";

// In production this returns a short-lived V4-signed Media CDN URL for the requested lesson.
// The token includes userId+childName so playback is watermarked and audit-traceable.
// Spec §16: never expose the raw bucket path — always sign per request.

export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.MEDIA_CDN_HOST;

  if (useMock) {
    // Return a placeholder URL — the client falls back to mock recordingStoragePath.
    return NextResponse.json({
      url: null,
      expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      message: "Mock mode — using local recording paths",
    });
  }

  // ---- Real signed URL generation (uncomment once Media CDN keyset configured) ----
  // import { getSignedUrl } from "@/lib/storage/signer";
  // const path = `/lessons/${lessonId}.mp4`;
  // const url = await getSignedUrl(path, /* ttl */ 4 * 3600);
  // return NextResponse.json({ url, expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString() });

  return NextResponse.json({ url: null, expiresAt: null });
}

export const runtime = "nodejs";
