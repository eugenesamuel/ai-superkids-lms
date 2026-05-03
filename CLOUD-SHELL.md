# Cloud Shell deploy walkthrough

The fastest way to get the AI SuperKids LMS live on a public URL — no installs on your laptop, ~20 minutes total.

> What you'll get: the app deployed to Cloud Run **in mock mode** at a `https://lms-xxxx-as.a.run.app` URL. No Firebase, Vertex, or video storage configured yet — just the UI working with mock data so you can see it live and share the link.

---

## 0 · Before we start

You need:

- [ ] A Google account
- [ ] A Google Cloud project with **billing enabled** (the $300 / 90-day trial counts as billing)
- [ ] A **project ID** picked out — example: `ai-superkids-prod`. Project IDs must be **globally unique**, lowercase, and 6–30 characters.

If you don't have a project yet:
1. Go to https://console.cloud.google.com
2. Project dropdown (top-left) → **New Project**
3. Pick a name and a unique project ID
4. **Activate billing** when prompted (free trial is fine)

---

## 1 · Get the code into Cloud Shell

You have two options:

### Option 1A — GitHub (recommended)

If you have a GitHub account:

```powershell
# In your local terminal (PowerShell, in this folder):
git init
git add .
git commit -m "Initial AI SuperKids LMS commit"
git branch -M main

# Create an empty repo at https://github.com/new (call it ai-superkids-lms)
git remote add origin https://github.com/YOUR_USERNAME/ai-superkids-lms.git
git push -u origin main
```

Then in Cloud Shell (https://shell.cloud.google.com):
```bash
git clone https://github.com/YOUR_USERNAME/ai-superkids-lms.git
cd ai-superkids-lms
```

### Option 1B — Upload zip

1. On your laptop: zip the project folder (`LMS - AI Super Kids` → right-click → "Send to → Compressed folder")
2. In Cloud Shell, click the **3-dot menu** (top-right) → **Upload** → pick the zip
3. Then in Cloud Shell:
   ```bash
   unzip "LMS - AI Super Kids.zip"
   cd "LMS - AI Super Kids"
   ```

---

## 2 · Run the deploy script

In Cloud Shell, in the project folder, run:

```bash
chmod +x scripts/deploy-cloud-shell.sh
PROJECT_ID=your-project-id REGION=asia-south1 bash scripts/deploy-cloud-shell.sh
```

Replace `your-project-id` with the GCP project ID you picked.

The script will:
1. Set your active project
2. Enable Cloud Run + Cloud Build + Artifact Registry APIs (~30 seconds)
3. Build the container image with Cloud Build (~3–6 minutes)
4. Deploy to Cloud Run (~1 minute)
5. Print the public URL

You'll see something like:
```
==========================================================================
  ✅ DONE
==========================================================================

  Your app is live at:
    https://lms-abc123-as.a.run.app

  Try these:
    https://lms-abc123-as.a.run.app/             ← Login
    https://lms-abc123-as.a.run.app/dashboard    ← Kid dashboard
    https://lms-abc123-as.a.run.app/admin        ← Admin console
```

---

## 3 · Verify

Open the printed URL. Any email/password works — it's mock mode.

Walk the demo:
- `/dashboard` — Kid dashboard with Planet Map
- `/games/quick-quiz` — playable trivia game
- `/admin` — full admin console with batch-based recording management
- `/admin/batches/batch-chennai-may-2026` → **Recordings** tab — chapter-style inline upload

---

## 4 · What this costs

For a fresh project on the free trial, this first deploy is **~$0**.

- **Cloud Build**: 120 free build-minutes per day; one build is ~5 min
- **Artifact Registry**: 0.5 GB free storage; the image is ~150 MB
- **Cloud Run**: 2M requests + 360K GB-sec / month always free; mock-mode app fits easily

If you blow past the free tier, expect under $5/month at this load.

---

## 5 · Updates after the first deploy

Any time you change code, redeploy by running the same script again:

```bash
PROJECT_ID=your-project-id bash scripts/deploy-cloud-shell.sh
```

It rebuilds + redeploys with a new image tag (timestamp-based). Old revisions stay around — you can roll back from the Cloud Run console if needed.

---

## 6 · When you're ready for real services

Mock mode is fine for demos and design reviews, but to onboard real kids you need real Firebase/Firestore/Vertex/Storage. That's the second pass — see [DEPLOY.md](DEPLOY.md) for the full production setup.

The transition is:
1. Provision Firebase + Firestore + buckets + Media CDN keyset + service account
2. `npm install firebase firebase-admin @google-cloud/storage @google-cloud/vertexai @sendgrid/mail`
3. Uncomment the marked blocks in 5 API routes
4. Re-deploy with `NEXT_PUBLIC_USE_MOCK_DATA=false` and the real env vars + secrets

---

## Troubleshooting

**`Build failed: TYPESCRIPT_COMPILATION` or similar**
- The mock build passed locally — if it fails in Cloud Build, paste the last 30 lines of Cloud Build output and I'll diagnose

**`Permission denied on iam.serviceAccounts.actAs`**
- The Cloud Build service account needs `roles/run.developer` and `roles/iam.serviceAccountUser`. The script doesn't grant them automatically since they often need manual approval. Run:
  ```bash
  PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format='value(projectNumber)')
  gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/run.developer"
  gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
  ```
  Then re-run the deploy script.

**`The user is forbidden from accessing the project`**
- You're not the project owner / don't have Editor role. Add yourself in the Cloud Console → IAM.
