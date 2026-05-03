// Firebase Admin SDK wrapper. Used in API routes and server actions.
// Install: `npm install firebase-admin` to enable.
// On Cloud Run: relies on Application Default Credentials via the runtime service account.

let cached: unknown = null;

export async function getAdmin() {
  if (cached) return cached;
  const mod = await import(
    /* webpackIgnore: true */ "firebase-admin" as string
  ).catch(() => {
    throw new Error(
      "`firebase-admin` not installed yet. Run: npm install firebase-admin",
    );
  });
  const admin = ((mod as { default: unknown }).default ?? mod) as {
    apps?: unknown[];
    initializeApp: (config: unknown) => unknown;
    credential: { applicationDefault: () => unknown };
  };
  if (!admin.apps?.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.GCP_PROJECT_ID,
    });
  }
  cached = admin;
  return admin;
}
