// Firebase Admin SDK wrapper.
// On Cloud Run: relies on Application Default Credentials via the runtime SA.
// Locally: set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path,
//          OR run `gcloud auth application-default login` first.

import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import type { Storage } from "firebase-admin/storage";

let cachedApp: App | null = null;

export function getAdminApp(): App | null {
  if (cachedApp) return cachedApp;
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") return null;
  if (!process.env.GCP_PROJECT_ID) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require("firebase-admin") as typeof import("firebase-admin");
    if (admin.apps.length > 0) {
      cachedApp = admin.apps[0] as App;
      return cachedApp;
    }
    cachedApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.GCP_PROJECT_ID,
      storageBucket: process.env.VIDEO_BUCKET ?? "ai-superkids-recordings",
    });
    return cachedApp;
  } catch (err) {
    console.error("[firebase-admin] init failed:", err);
    return null;
  }
}

export function getDb(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getFirestore } = require("firebase-admin/firestore") as typeof import("firebase-admin/firestore");
    return getFirestore(app);
  } catch (err) {
    console.error("[firebase-admin] getDb failed:", err);
    return null;
  }
}

export function getStorageAdmin(): Storage | null {
  const app = getAdminApp();
  if (!app) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getStorage } = require("firebase-admin/storage") as typeof import("firebase-admin/storage");
    return getStorage(app);
  } catch (err) {
    console.error("[firebase-admin] getStorage failed:", err);
    return null;
  }
}

export async function verifyIdToken(token: string) {
  const app = getAdminApp();
  if (!app) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAuth } = require("firebase-admin/auth") as typeof import("firebase-admin/auth");
    return await getAuth(app).verifyIdToken(token, true);
  } catch (err) {
    console.error("[firebase-admin] verifyIdToken failed:", err);
    return null;
  }
}
