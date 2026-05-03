# ACTIVATION.md — Final 5 minutes to fully real

The app is **live with real AI responses (Gemini) and real Cloud Storage signed URLs**:
👉 https://lms-bix7ivirya-el.a.run.app

This doc covers the last 3 things that need your click to switch from "mostly real" to "fully real".

---

## ✅ Already working (no action needed)

| System | Status |
|---|---|
| Cloud Run hosting (asia-south1) | Live, scale-to-zero |
| Runtime service account with 6 roles | Live |
| Vertex AI Gemini for Zara chat | **Real AI replies right now** |
| Cloud Storage buckets (3 in asia-south1) | Live, signed URLs working |
| V4 signed playback + upload URLs | **Real, time-limited URLs** |
| Firestore Native DB (asia-south1) | Provisioned, empty |
| Firebase Admin SDK | Wired, uses runtime SA |
| Firebase client SDK + login form | Wired, graceful fallback |
| Session cookie endpoint | Wired |
| Middleware auth gating | Wired (activates with Firebase config) |
| Firestore security rules | Drafted in `firestore.rules` |
| Mock fallback for everything | Still works |

You can demo the app today and Zara will respond with real Gemini AI. Eugene can upload a video in `/admin/batches/[id]` and it will go to a real signed Cloud Storage URL (and play back via real signed URL).

---

## 🟡 Step 1 — (Optional) Subscribe to Claude on Vertex AI Marketplace

**Why:** Spec §8 calls for Claude. Right now Zara uses Gemini as a fallback. Subscribing to Claude means it's preferred (response shows `via: "claude"` instead of `via: "gemini"`).

**How:** ~30 seconds of clicking
1. Open https://console.cloud.google.com/vertex-ai/model-garden?project=gen-lang-client-0242584615
2. Search "Claude"
3. Click any Claude model → **Enable** / **Subscribe**
4. No code changes needed — the route automatically prefers Claude on the next request

**Cost:** pay-per-token, ~$0.0002 per Zara reply. Negligible.

---

## 🟡 Step 2 — Firebase Auth web app config (to activate real login)

**Why:** Right now the login page accepts any credentials (because no Firebase Web App config is set). Configuring it switches to real Firebase Auth — emails verified, sessions enforced, middleware protects routes.

**How:** ~2 minutes
1. Open https://console.firebase.google.com — should automatically include `gen-lang-client-0242584615`. (If not: click "Add project" → import the existing GCP project.)
2. **Project settings (gear icon) → Your apps → Add app → Web** (`</>` icon)
3. Nickname: `AI SuperKids LMS` → Register app
4. Copy the 6 config values from the snippet shown
5. **Authentication tab → Sign-in method → Enable Email/Password and Google**
6. Update Cloud Run env vars from your local PowerShell:

```powershell
$env:CLOUDSDK_PYTHON = "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\platform\bundledpython\python.exe"
$gcloud = 'C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd'

& $gcloud run services update lms --region asia-south1 --project gen-lang-client-0242584615 --update-env-vars `
  "NEXT_PUBLIC_FIREBASE_API_KEY=PASTE_HERE,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=PASTE_HERE,NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-lang-client-0242584615,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=PASTE_HERE,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=PASTE_HERE,NEXT_PUBLIC_FIREBASE_APP_ID=PASTE_HERE"
```

7. **Make yourself an admin** (one-time):
```bash
# In Cloud Shell or with firebase CLI logged in:
node -e "const a=require('firebase-admin');a.initializeApp({projectId:'gen-lang-client-0242584615'});a.auth().getUserByEmail('YOUR@email').then(u=>a.auth().setCustomUserClaims(u.uid,{role:'admin'})).then(()=>console.log('done'))"
```

After update, the login page enforces real auth. The first time you sign in via Google, Firebase auto-creates the user — your custom-claim run above flags you as admin.

---

## 🟡 Step 3 — Firestore seed + rules deploy (so pages show real data)

**Why:** Right now pages import directly from `lib/mock-data.ts`. The Firestore-backed data layer (`lib/data.ts`) is built and used by API routes, but pages haven't been migrated yet (separate refactor). Seeding Firestore + deploying rules prepares the path so when pages get migrated, they show real data immediately.

**How:** ~3 minutes in Cloud Shell

```bash
# Open https://shell.cloud.google.com
cd ~/ai-superkids-lms
git pull
npm install

# One-time Firebase CLI login (browser opens)
firebase login

# Deploy security rules + indexes
firebase deploy --only firestore --project gen-lang-client-0242584615

# Seed all collections from mock-data
GCP_PROJECT_ID=gen-lang-client-0242584615 npx tsx scripts/seed-firestore.ts
```

Expected output:
```
✓ planets: 5
✓ missions: 5
✓ activities: 4
✓ documents: 7
✓ batches: 3
✓ recordings: 8
✓ badges: 7
✓ leaderboard: 11
✓ users/demo-parent-1 (with 3 badges)
✅ Seed complete.
```

Verify in the Firebase Console → Firestore → Data tab.

---

## 🟢 What's still to do (next session)

These are bigger refactors deferred to keep this session shippable:

1. **Migrate every page from `mock-data` imports → `lib/data.ts` async helpers** — turns the 30+ pages into Firestore consumers. Each page becomes either a server component (cleaner) or fetches via an internal API route.

2. **Wire `getCurrentUser()` to read the verified ID-token cookie + Firestore user doc** — currently returns the mock demo user even with auth enabled.

3. **Cloud Function for leaderboard denormalization** — when a user's PP changes, sync the privacy-safe projection to `/leaderboard/{uid}`. Currently the leaderboard collection is seeded but not auto-updated.

4. **Cloud Scheduler + Cloud Function for weekly progress emails** — needs SendGrid signup + a cron-triggered function.

5. **Real Razorpay-replacement signup flow if you ever change your mind** — kept out of scope per your "no payments" decision.

6. **PDF certificate generator + Storage upload** — for graduation. `@react-pdf/renderer` is the path.

Ping me when you're ready to do any of these.

---

## 🌐 Live URLs

- **App:** https://lms-bix7ivirya-el.a.run.app
- **Project:** https://console.cloud.google.com/home/dashboard?project=gen-lang-client-0242584615
- **Cloud Run:** https://console.cloud.google.com/run/detail/asia-south1/lms?project=gen-lang-client-0242584615
- **Firestore:** https://console.cloud.google.com/firestore?project=gen-lang-client-0242584615
- **Buckets:** https://console.cloud.google.com/storage/browser?project=gen-lang-client-0242584615
- **Vertex AI Model Garden:** https://console.cloud.google.com/vertex-ai/model-garden?project=gen-lang-client-0242584615
- **GitHub repo:** https://github.com/eugenesamuel/ai-superkids-lms
