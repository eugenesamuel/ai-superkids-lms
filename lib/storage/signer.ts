import crypto from "node:crypto";

// V4-signed URL helper for Media CDN.
// Spec §16: every video URL is signed, max 4-hour TTL, never expose raw bucket path.
// Docs: https://cloud.google.com/media-cdn/docs/sign-requests

const KEY_NAME = process.env.MEDIA_CDN_KEY_NAME ?? "";
const KEY_BASE64 = process.env.MEDIA_CDN_KEY_VALUE_BASE64 ?? "";
const HOST = process.env.MEDIA_CDN_HOST ?? "";

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function getSignedUrl(
  path: string,
  ttlSeconds: number = 4 * 3600,
  watermark?: string,
): string {
  if (!HOST || !KEY_NAME || !KEY_BASE64) {
    throw new Error("Media CDN signing keys not configured — see .env.example");
  }
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const params = new URLSearchParams({
    Expires: expires.toString(),
    KeyName: KEY_NAME,
  });
  if (watermark) params.set("Watermark", watermark);

  const stringToSign = `${path}?${params.toString()}`;
  const key = Buffer.from(KEY_BASE64, "base64");
  const sig = crypto.createHmac("sha1", key).update(stringToSign).digest();
  params.set("Signature", base64UrlEncode(sig));
  return `https://${HOST}${path}?${params.toString()}`;
}
