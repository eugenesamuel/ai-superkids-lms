// V4-signed URL helper for Cloud Storage objects.
// Uses Application Default Credentials on Cloud Run (via the runtime SA).
//
// Spec §16: every video URL is signed with max 4-hour TTL.

import type { Storage } from "@google-cloud/storage";

let cachedStorage: Storage | null = null;

async function getStorage(): Promise<Storage | null> {
  if (cachedStorage) return cachedStorage;
  try {
    const mod = await import("@google-cloud/storage");
    cachedStorage = new mod.Storage({
      projectId: process.env.GCP_PROJECT_ID,
    });
    return cachedStorage;
  } catch (err) {
    console.error("[storage] init failed:", err);
    return null;
  }
}

export async function getPlaybackUrl(
  bucket: string,
  objectPath: string,
  ttlSeconds: number = 4 * 3600,
): Promise<string | null> {
  const storage = await getStorage();
  if (!storage) return null;
  try {
    const [url] = await storage
      .bucket(bucket)
      .file(objectPath)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + ttlSeconds * 1000,
      });
    return url;
  } catch (err) {
    console.error("[storage] signed read URL failed:", err);
    return null;
  }
}

export async function getUploadUrl(
  bucket: string,
  objectPath: string,
  contentType: string,
  ttlSeconds: number = 3600,
): Promise<string | null> {
  const storage = await getStorage();
  if (!storage) return null;
  try {
    const [url] = await storage
      .bucket(bucket)
      .file(objectPath)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + ttlSeconds * 1000,
        contentType,
      });
    return url;
  } catch (err) {
    console.error("[storage] signed write URL failed:", err);
    return null;
  }
}

export function recordingObjectPath(batchId: string, missionId: string): string {
  return `recordings/${batchId}/${missionId}.mp4`;
}
