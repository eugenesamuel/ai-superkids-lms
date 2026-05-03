// Firebase client SDK wrapper.
// Activates when NEXT_PUBLIC_FIREBASE_API_KEY is present at build time.

import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
}

export async function getFirebaseAuth(): Promise<Auth | null> {
  if (cachedAuth) return cachedAuth;
  if (!isFirebaseConfigured()) return null;
  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    cachedApp =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          });
    cachedAuth = getAuth(cachedApp);
    return cachedAuth;
  } catch (err) {
    console.error("[firebase-client] init failed:", err);
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured");
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured");
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function signOut() {
  const auth = await getFirebaseAuth();
  if (!auth) return;
  const { signOut: fbSignOut } = await import("firebase/auth");
  await fbSignOut(auth);
}

export async function getIdToken(): Promise<string | null> {
  const auth = await getFirebaseAuth();
  if (!auth?.currentUser) return null;
  return auth.currentUser.getIdToken();
}
