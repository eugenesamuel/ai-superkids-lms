// Firebase client SDK wrapper. Lazy-loads to avoid build-time errors when env vars aren't set yet.
// Install: `npm install firebase` to enable.

let cachedApp: unknown = null;

export async function getFirebaseApp() {
  if (cachedApp) return cachedApp;
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    throw new Error("Firebase env vars not set — see .env.example");
  }
  // Dynamic import so missing dep doesn't break the build in mock mode.
  const { initializeApp, getApps, getApp } = await import(
    /* webpackIgnore: true */ "firebase/app" as string
  ).catch(() => {
    throw new Error("`firebase` package not installed yet. Run: npm install firebase");
  });

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  cachedApp = (getApps as () => unknown[])().length
    ? (getApp as () => unknown)()
    : (initializeApp as (c: unknown) => unknown)(config);
  return cachedApp;
}
