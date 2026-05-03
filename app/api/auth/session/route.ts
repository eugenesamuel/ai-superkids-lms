import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";

// POST: verify a Firebase ID token (sent in body) and set a session cookie.
// DELETE: clear the cookie (logout).

const COOKIE_NAME = "session";
const FIVE_DAYS_SEC = 60 * 60 * 24 * 5;

export async function POST(req: NextRequest) {
  const { idToken } = (await req.json()) as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "idToken required" }, { status: 400 });
  }

  const decoded = await verifyIdToken(idToken);
  if (!decoded) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    uid: decoded.uid,
    email: decoded.email,
    role: (decoded as { role?: string }).role ?? "parent",
  });
  res.cookies.set(COOKIE_NAME, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: FIVE_DAYS_SEC,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

export const runtime = "nodejs";
