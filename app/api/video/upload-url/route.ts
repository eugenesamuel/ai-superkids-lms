import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl, recordingObjectPath } from "@/lib/storage/signer";

// Admin-only: returns a V4-signed PUT URL for direct browser → Cloud Storage upload of a recording.
// In production this requires the caller to be authenticated as admin (TODO: token verification).

export async function POST(req: NextRequest) {
  const { batchId, missionId, contentType } = (await req.json()) as {
    batchId?: string;
    missionId?: string;
    contentType?: string;
  };
  if (!batchId || !missionId || !contentType) {
    return NextResponse.json(
      { error: "batchId, missionId, contentType required" },
      { status: 400 },
    );
  }

  if (!process.env.GCP_PROJECT_ID || !process.env.VIDEO_BUCKET) {
    return NextResponse.json({
      url: null,
      message: "No real video storage configured",
    });
  }

  // TODO: verify caller is admin via session cookie / Firebase Auth claim
  // For now: trust the call (Cloud Run with --allow-unauthenticated).
  // In production, add: const decoded = await verifySession(req); if (decoded?.role !== "admin") return 403;

  const bucket = process.env.VIDEO_BUCKET ?? "ai-superkids-recordings";
  const path = recordingObjectPath(batchId, missionId);
  const url = await getUploadUrl(bucket, path, contentType, 3600);

  return NextResponse.json({
    url,
    bucket,
    path,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  });
}

export const runtime = "nodejs";
