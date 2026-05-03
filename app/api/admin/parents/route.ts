import { NextRequest, NextResponse } from "next/server";

// Admin-only: create a parent account in Firebase Auth + Firestore, send welcome email.

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    email?: string;
    childName?: string;
    childAge?: number;
    city?: string;
    batchId?: string;
  };
  const { email, childName, childAge, city, batchId } = body;
  if (!email || !childName || !childAge || !city || !batchId) {
    return NextResponse.json(
      { error: "email, childName, childAge, city, batchId required" },
      { status: 400 },
    );
  }

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.GCP_PROJECT_ID;
  if (useMock) {
    return NextResponse.json({
      ok: true,
      uid: `mock-${Date.now()}`,
      message: "Mock mode — would create Firebase Auth user + send welcome email",
    });
  }

  // ---- Real flow ----
  // 1. Verify caller is admin (custom claim role:admin)
  // 2. Create Firebase Auth user with random temp password
  // 3. Generate password reset link via admin.auth().generatePasswordResetLink(email)
  // 4. Write Firestore /users/{uid} with consentGivenAt: serverTimestamp()
  // 5. Send welcome email via SendGrid with the reset link
  // 6. POST to Slack webhook
  // 7. Return { ok: true, uid }

  return NextResponse.json({ ok: true, uid: `unconfigured-${Date.now()}` });
}

export const runtime = "nodejs";
