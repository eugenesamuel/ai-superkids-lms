# DEPLOY.md — AI SuperKids LMS

One-page guide for deploying to **Google Cloud Run** with Firebase Auth + Firestore + Cloud Storage + Media CDN + Vertex AI Claude. The README has the full reference; this is the quick path.

---

## 0. Prerequisites (one-time, ~30 minutes)

```bash
gcloud auth login
gcloud config set project ai-superkids-prod    # create the project first if needed
firebase login
```

Create the project + enable services:
```bash
gcloud projects create ai-superkids-prod
gcloud services enable \
  firebase.googleapis.com firestore.googleapis.com \
  run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  storage.googleapis.com networkservices.googleapis.com \
  aiplatform.googleapis.com secretmanager.googleapis.com \
  cloudscheduler.googleapis.com cloudfunctions.googleapis.com
```

Add Firebase + Firestore (Mumbai region):
```bash
firebase projects:addfirebase ai-superkids-prod
firebase firestore:databases:create "(default)" --location=asia-south1
firebase deploy --only firestore:rules,firestore:indexes
```

Buckets + service account:
```bash
gcloud storage buckets create gs://ai-superkids-recordings --location=asia-south1 --uniform-bucket-level-access
gcloud storage buckets create gs://ai-superkids-uploads --location=asia-south1 --uniform-bucket-level-access
gcloud storage buckets create gs://ai-superkids-public --location=asia-south1 --uniform-bucket-level-access

gcloud iam service-accounts create cloud-run-runtime
SA="cloud-run-runtime@ai-superkids-prod.iam.gserviceaccount.com"
for ROLE in datastore.user storage.objectAdmin aiplatform.user secretmanager.secretAccessor firebase.sdkAdminServiceAgent; do
  gcloud projects add-iam-policy-binding ai-superkids-prod --member="serviceAccount:$SA" --role="roles/$ROLE"
done
```

Secrets:
```bash
echo -n "$SENDGRID_KEY" | gcloud secrets create sendgrid-api-key --data-file=-
echo -n "$SLACK_HOOK"   | gcloud secrets create slack-webhook --data-file=-
echo -n "$MEDIA_CDN_KEY_BASE64" | gcloud secrets create media-cdn-key --data-file=-
```

Enable Anthropic Claude on Vertex AI Marketplace (one-click in console: *Vertex AI → Model Garden → Claude → Subscribe*).

---

## 1. Wire up real services in code

When you're ready to turn off mock mode:

```bash
npm install firebase firebase-admin @google-cloud/storage @google-cloud/vertexai @sendgrid/mail
```

Then in:
- [`app/api/zara/route.ts`](app/api/zara/route.ts) — uncomment the Vertex AI block
- [`app/api/video/playback-url/route.ts`](app/api/video/playback-url/route.ts) — uncomment the Media CDN signer call
- [`app/api/video/upload-url/route.ts`](app/api/video/upload-url/route.ts) — uncomment the Cloud Storage V4 signed PUT
- [`app/api/progress/complete/route.ts`](app/api/progress/complete/route.ts) — uncomment the Firestore write + badge eval
- [`app/api/admin/parents/route.ts`](app/api/admin/parents/route.ts) — uncomment the Firebase Auth user create + welcome email
- Switch the Sidebar mock user / batch lookups to read from Firestore + the verified ID-token cookie

---

## 2. Deploy to Cloud Run

```bash
# Build the image
gcloud builds submit --tag gcr.io/ai-superkids-prod/lms

# Deploy
gcloud run deploy lms \
  --image gcr.io/ai-superkids-prod/lms \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account "$SA" \
  --memory 1Gi --cpu 1 --min-instances 0 --max-instances 10 \
  --set-env-vars "NEXT_PUBLIC_USE_MOCK_DATA=false,GCP_PROJECT_ID=ai-superkids-prod,GCP_REGION=asia-south1,VERTEX_AI_LOCATION=us-east5,VERTEX_AI_MODEL=claude-haiku-4-5@anthropic,VIDEO_BUCKET=ai-superkids-recordings,UPLOADS_BUCKET=ai-superkids-uploads,PUBLIC_BUCKET=ai-superkids-public,MEDIA_CDN_HOST=cdn.digitalscholar.in" \
  --set-secrets "SENDGRID_API_KEY=sendgrid-api-key:latest,SLACK_ADMIN_WEBHOOK=slack-webhook:latest,MEDIA_CDN_KEY_VALUE_BASE64=media-cdn-key:latest"
```

Cloud Run prints a URL like `https://lms-xxxx-as.a.run.app`. Visit it to verify.

Map a custom domain (`app.digitalscholar.in`):
```bash
gcloud run domain-mappings create --service lms --domain app.digitalscholar.in --region asia-south1
```

---

## 3. Set up Firebase Auth providers

In the Firebase console:
1. Auth → Sign-in method → Enable **Email/Password** + **Google**
2. Auth → Settings → Authorized domains → add `app.digitalscholar.in`
3. Auth → Templates → Customize the password-reset email (used when admin creates a new parent)

---

## 4. Make yourself an admin

```bash
# In a Cloud Shell or via Admin SDK script:
firebase auth:set-claims YOUR_UID --claims '{"role":"admin"}'
```

Sign out and back in for the claim to take effect.

---

## 5. Cost expectations

Realistic 90-day pilot for ~50 kids × 1 weekly live class (recording rewatched a few times each):
- **~$15–40 of your $300 trial credit** during the first 90 days
- **~$2–10/month** post-trial run rate

The biggest cost driver is video egress through Media CDN — if a recording goes viral within the cohort it scales linearly with watch hours.

---

## 6. Day-2 operations

| What | Where |
|---|---|
| New batch | `/admin/batches` → New batch |
| New parent (single) | `/admin/students` → Add Parent (sends welcome email) |
| New parents (bulk) | `/admin/students` → Bulk CSV → drop file |
| Upload a recording | `/admin/batches/[id]` → Recordings tab → click mission → upload |
| Add trivia question | `/admin/games` → Add question |
| Send announcement | `/admin/announcements` |
| Review submissions | `/admin/submissions` |
| Pause / remove a parent | `/admin/students/[uid]` → action buttons |
| Archive a batch | `/admin/batches/[id]` → Settings tab → Danger zone |

---

## Compliance reminders (spec §16)

- Every video URL is V4-signed with max 4-hour TTL — never expose raw bucket paths
- `consentGivenAt` is required; auth blocks login if null
- Leaderboard only ever exposes first name + city + power points
- All Zara replies pass through `lib/vertex/zara.ts` filter
- 12 robot avatars — no real photos
- Lighthouse mobile target ≥ 90

---

*AI SuperKids LMS · Digital Scholar · Rishi Jain · digitalscholar.in*
