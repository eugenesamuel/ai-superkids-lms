import { NextRequest, NextResponse } from "next/server";

// Spec §16 — protect /(parent)/* with parent role; /(admin)/* with admin role.
// In mock mode (default for local dev), all routes pass through.
// In production, verify Firebase ID token cookie and check role custom claim.

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

  // Mock mode: skip auth entirely. Defaults to mock when no GCP project is configured,
  // or can be explicitly forced via NEXT_PUBLIC_USE_MOCK_DATA=true.
  const isMock =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.GCP_PROJECT_ID;
  if (isMock) {
    return NextResponse.next();
  }

  const isParentPath = PARENT_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isAdminPath = ADMIN_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (!isParentPath && !isAdminPath) return NextResponse.next();

  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Verify cookie + role with the Admin SDK in a real implementation.
  // const admin = await getAdmin();
  // const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
  // const role = decoded.role; // custom claim
  // if (isAdminPath && role !== "admin") return NextResponse.rewrite(new URL("/404", req.url));
  // if (isParentPath && role !== "parent") return NextResponse.redirect(new URL("/admin", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
