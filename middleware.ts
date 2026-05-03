import { NextRequest, NextResponse } from "next/server";

// Spec §16 — protect /(parent)/* with parent role; /(admin)/* with admin role.
// Mock mode (default for local dev): all routes pass through.
// Production:
//   - Must have a `session` cookie (Firebase ID token)
//   - We do *shallow* validation here in the Edge runtime (cookie present + non-empty)
//   - Deep verification (signature + role check) happens in Node-runtime API routes
//     and server components via verifyIdToken() in lib/firebase/admin.ts.
//   - Edge can't run firebase-admin (Node-only), so we proxy through.

const PARENT_ROUTES = [
  "/dashboard",
  "/course",
  "/lesson",
  "/activity",
  "/achievements",
  "/leaderboard",
  "/games",
  "/sessions",
  "/live",
  "/profile",
];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth gating is independent from other mock flags. It activates ONLY when the
  // Firebase client SDK has been configured (NEXT_PUBLIC_FIREBASE_API_KEY present).
  // This lets the rest of the app run with real Firestore / Vertex AI / Storage
  // even before someone sets up the Firebase web app config.
  const authActive = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  if (!authActive) return NextResponse.next();

  const isParentPath = PARENT_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isAdminPath = ADMIN_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!isParentPath && !isAdminPath) return NextResponse.next();

  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie || sessionCookie.length < 50) {
    // No session — redirect to login.
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie is present; deeper signature + role check happens server-side
  // (route handlers / server components via lib/firebase/admin.ts).
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
