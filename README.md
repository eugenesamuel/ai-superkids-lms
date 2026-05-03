# AI SuperKids LMS

Tag-Mango-style learning platform for **Digital Scholar's AI SuperKids** program.
Live cohort, kids age 8–17, accessed via parent login. 100% Google Cloud–hostable, free-tier optimized.

Built per [`ai-superkids-lms-v2 (1).md`](./ai-superkids-lms-v2%20%281%29.md).

---

## Quick start (local dev, no GCP credentials needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the app runs in **mock mode** (`NEXT_PUBLIC_USE_MOCK_DATA=true` by default).
Mock mode bypasses Firebase Auth, uses canned in-memory data, and falls back to scripted Zara replies. Perfect for design reviews and demos.

### Demo flow

1. `/` — landing page (any email + password works in mock mode)
2. Click **Login to Start** → redirects to `/dashboard`
3. **Planet Map** — 5 planets, planet 2 is current, click it
4. Pick a mission → video player loads (recordings missing show a friendly placeholder)
5. Submit a quiz → confetti + "+50 Power Points" toast
6. Open AI Buddy (orange robot bottom-right) → ask "what is AI?" → Zara replies
7. Profile dropdown → **Switch to Parent View** → progress ring + trainer note
8. `/admin` — full admin shell with KPIs, students table, live class scheduler, submissions queue

---

## Production setup (Google Cloud)

### 1. Provision GCP services

```bash
gcloud projects create ai-superkids-prod
gcloud services enable \
  firebase.googleapis.com firestore.googleapis.com \
  run.googleapis.com cloudbuild.googleapis.com \
  storage.googleapis.com networkservices.googleapis.com \
  aiplatform.googleapis.com secretmanager.googleapis.com \
  cloudscheduler.googleapis.com cloudfunctions.googleapis.com
```

### 2. Firebase + Firestore

```bash
firebase login
firebase projects:addfirebase ai-superkids-prod
firebase firestore:databases:create "(default)" --location=asia-south1
firebase deploy --only firestore:rules,firestore:indexes
```

Enable **Email/Password** + **Google** sign-in providers in the Firebase console (Auth → Sign-in method).

### 3. Cloud Storage buckets

```bash
gcloud storage buckets create gs://ai-superkids-recordings --location=asia-south1 --uniform-bucket-level-access
gcloud storage buckets create gs://ai-superkids-uploads --location=asia-south1 --uniform-bucket-level-access
gcloud storage buckets create gs://ai-superkids-public --location=asia-south1 --uniform-bucket-level-access
```

### 4. Media CDN signing keyset

Follow https://cloud.google.com/media-cdn/docs/sign-requests — create a keyset, add it to a Media CDN edge-cache config that has the `ai-superkids-recordings` bucket as its origin. Save the key name and base64 value into Secret Manager.

### 5. Vertex AI for Zara

```bash
gcloud ai-platform models list --region=us-east5
```

Subscribe to Anthropic's Claude on Vertex AI Marketplace. Then install:

```bash
npm install @google-cloud/vertexai
```

Uncomment the real Vertex call in [`app/api/zara/route.ts`](./app/api/zara/route.ts) and [`lib/vertex/zara.ts`](./lib/vertex/zara.ts).

### 6. Service accounts

```bash
gcloud iam service-accounts create cloud-run-runtime
gcloud projects add-iam-policy-binding ai-superkids-prod \
  --member="serviceAccount:cloud-run-runtime@ai-superkids-prod.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
# repeat for: storage.objectAdmin, aiplatform.user, secretmanager.secretAccessor
```

### 7. Secrets

```bash
echo -n "YOUR_KEY" | gcloud secrets create sendgrid-api-key --data-file=-
echo -n "YOUR_HOOK" | gcloud secrets create slack-webhook --data-file=-
# repeat for: media-cdn-key, firebase-admin-private-key
```

### 8. Deploy to Cloud Run

```bash
gcloud builds submit --tag gcr.io/ai-superkids-prod/lms
gcloud run deploy lms \
  --image gcr.io/ai-superkids-prod/lms \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account cloud-run-runtime@ai-superkids-prod.iam.gserviceaccount.com \
  --set-env-vars NEXT_PUBLIC_USE_MOCK_DATA=false,GCP_PROJECT_ID=ai-superkids-prod,VERTEX_AI_LOCATION=us-east5,VIDEO_BUCKET=ai-superkids-recordings \
  --set-secrets SENDGRID_API_KEY=sendgrid-api-key:latest,SLACK_ADMIN_WEBHOOK=slack-webhook:latest
```

### 9. Install Firebase + Vertex SDKs (once configured)

```bash
npm install firebase firebase-admin @google-cloud/storage @google-cloud/vertexai @sendgrid/mail
```

Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in your Cloud Run config and the app will hit real services.

---

## Architecture (100% GCP, free-tier optimized)

| Layer | Service | Free tier note |
|---|---|---|
| Hosting | Cloud Run (`asia-south1`) | 2M req + 360K GB-sec/mo always free |
| Auth | Firebase Auth (email + Google) | 50K MAU always free |
| Database | Firestore (Native, asia-south1) | 1 GiB + 50K reads/20K writes/day always free |
| Files | Cloud Storage (3 buckets) | 5 GB always free |
| Video DRM | Media CDN + V4 signed URLs | Egress only paid layer |
| AI Buddy | Vertex AI Claude `claude-haiku-4-5` | Pay-per-token, trivial cost |
| Email | SendGrid (free tier 100/day) | 100/day free |
| Cron jobs | Cloud Scheduler + Functions | 2M invocations/mo always free |
| Secrets | Secret Manager | 6 active secrets free |

**Realistic 90-day pilot cost:** ~$15–40 of the $300 trial credit.

---

## Project structure

```
app/
  page.tsx                     ← landing/login (no public enrollment)
  layout.tsx                   ← Fredoka One + Nunito + DS color tokens
  globals.css                  ← keyframes (star drift, robot float, glow pulse)
  (parent)/
    layout.tsx                 ← top nav + mobile bottom tabs
    dashboard/page.tsx         ← Planet Map hero + Live Class countdown
    dashboard/parent/page.tsx  ← progress ring + trainer note
    course/[weekId]/page.tsx   ← mission timeline
    lesson/[lessonId]/page.tsx ← video + activity + Zara
    activity/[activityId]/...
    live/page.tsx              ← primary delivery surface
    achievements/page.tsx      ← badge grid
    leaderboard/page.tsx       ← podium + ranked list
    profile/page.tsx           ← avatar + streak + projects
  (admin)/
    admin/page.tsx             ← KPI dashboard
    admin/students/page.tsx    ← create parent accounts (no public signup)
    admin/batches/page.tsx
    admin/live/page.tsx        ← schedule sessions + upload recordings
    admin/courses/page.tsx
    admin/submissions/page.tsx ← review queue
    admin/announcements/page.tsx
  api/
    zara/route.ts              ← Vertex AI + content filter + rate limit
    video/playback-url/route.ts
    video/upload-url/route.ts
    progress/complete/route.ts
    admin/parents/route.ts
components/
  lms/  PlanetCard, MissionCard, BadgeCard, PowerPointsBar,
        AvatarPicker, StreakCalendar, LeaderboardRow, LiveClassCountdown,
        ParentStatsCard, TopNav, MobileNav
  games/ ActivityCard, QuizOption, ConfettiBlast, VideoPlayer
  AIBuddy.tsx                  ← Zara floating chat
lib/
  firebase/{client,admin}.ts
  storage/signer.ts            ← V4 signed URL helper
  vertex/zara.ts               ← system prompt + content filter
  xp.ts                        ← Power Points + Levels (spec §7)
  badges.ts                    ← 7 badges (spec §4 page 7)
  copy.ts                      ← kid-friendly copy map (spec §15)
  mock-data.ts                 ← runs the demo without GCP creds
  types.ts utils.ts
firestore.rules                ← role-based security (spec §16)
firestore.indexes.json
middleware.ts                  ← role-based routing
Dockerfile                     ← Cloud Run standalone build
```

---

## Branding

- DS Orange `#FF6B35` · Deep Space Navy `#1A1A2E` · Electric Cyan `#00D4FF` · Neon Green `#00E676`
- Headings: **Fredoka One** · Body: **Nunito** (loaded via `next/font/google`)
- Spec §15 copy enforced: "Mission" not Lesson, "Planet" not Module, "Power Points" not XP, "Send My Work" not Submit, "Explorer" not Student.

---

## Compliance

- COPPA + India DPDP Act — see spec §16
- Parent-managed login (no kid accounts)
- 12 robot avatars only (no real photos) — `components/lms/AvatarPicker.tsx` renders inline SVG
- Leaderboard query exposes only first name + city + power points
- Every Zara reply runs through `filterReply()` in `lib/vertex/zara.ts`
- Video URLs are V4-signed Media CDN URLs with 4-hour TTL — never raw bucket paths

---

## Open items

- [ ] DS logo SVG (white + color) — currently a text placeholder
- [ ] Eugene's actual trainer note copy
- [ ] First batch enrollment CSV → admin bulk-create
- [ ] Confirm Zoom or Google Meet preference (paste-the-URL only, no SDK work)

---

*AI SuperKids LMS · Digital Scholar · Rishi Jain · digitalscholar.in*
