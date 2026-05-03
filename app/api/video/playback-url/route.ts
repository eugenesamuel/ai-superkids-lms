import { NextRequest, NextResponse } from "next/server";
import { getPlaybackUrl, recordingObjectPath } from "@/lib/storage/signer";
import { getRecordingFor } from "@/lib/data";
import { getCurrentUser } from "@/lib/data";

// Returns a short-lived V4-signed Cloud Storage URL for the requested lesson's recording.
// In production: the URL is the actual playback source for the <video> element.
// In mock mode: returns null + a friendly message.

export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Storage signed URLs activate when GCP_PROJECT_ID + VIDEO_BUCKET are set.
  if (!process.env.GCP_PROJECT_ID || !process.env.VIDEO_BUCKET) {
    return NextResponse.json({
      url: null,
      message: "No real video storage configured",
    });
  }

  const user = await getCurrentUser();
  const recording = await getRecordingFor(lessonId, user.batchId);
  if (!recording || recording.status !== "ready") {
    return NextResponse.json({
      url: null,
      message: "No recording for this batch yet",
    });
  }

  const bucket = process.env.VIDEO_BUCKET ?? "ai-superkids-recordings";
  const path = recordingObjectPath(user.batchId, lessonId);
  const url = await getPlaybackUrl(bucket, path, 4 * 3600);

  return NextResponse.json({
    url,
    expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    watermark: `${user.childName} · AI SuperKids`,
  });
}

export const runtime = "nodejs";
