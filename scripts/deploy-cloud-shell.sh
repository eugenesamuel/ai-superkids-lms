#!/usr/bin/env bash
# AI SuperKids LMS — Cloud Shell deploy script (mock-mode first deploy)
#
# What this does:
#   1. Sets your active GCP project
#   2. Enables Cloud Run + Cloud Build + Artifact Registry APIs
#   3. Submits the source to Cloud Build (uses our Dockerfile)
#   4. Deploys to Cloud Run in mock mode (NEXT_PUBLIC_USE_MOCK_DATA=true)
#
# Result: a public URL like https://lms-xxxx-as.a.run.app showing the full app.
# Cost: ~$0 on a fresh trial — Cloud Build is free for the first build, Cloud Run
# scale-to-zero, no Firestore/Vertex/Storage usage in mock mode.
#
# Usage from Cloud Shell:
#   cd "LMS - AI Super Kids"
#   PROJECT_ID=your-project-id REGION=asia-south1 bash scripts/deploy-cloud-shell.sh

set -euo pipefail

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
PROJECT_ID="${PROJECT_ID:?PROJECT_ID is required. Run: PROJECT_ID=your-project-id bash scripts/deploy-cloud-shell.sh}"
REGION="${REGION:-asia-south1}"
SERVICE_NAME="${SERVICE_NAME:-lms}"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:$(date +%s)"

echo "==========================================================================="
echo "  AI SuperKids LMS deploy"
echo "==========================================================================="
echo "  Project:  ${PROJECT_ID}"
echo "  Region:   ${REGION}"
echo "  Service:  ${SERVICE_NAME}"
echo "  Image:    ${IMAGE}"
echo "  Mode:     mock (no Firebase, no Vertex, no real video storage)"
echo "==========================================================================="
echo ""

# -----------------------------------------------------------------------------
# 1. Set project
# -----------------------------------------------------------------------------
echo "→ Setting active project..."
gcloud config set project "${PROJECT_ID}"

# -----------------------------------------------------------------------------
# 2. Enable required APIs (idempotent)
# -----------------------------------------------------------------------------
echo "→ Enabling APIs (this can take 30-60 seconds the first time)..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project "${PROJECT_ID}"

# -----------------------------------------------------------------------------
# 3. Build container image with Cloud Build
# -----------------------------------------------------------------------------
echo "→ Submitting build to Cloud Build (uses our Dockerfile)..."
echo "  This typically takes 3-6 minutes."
gcloud builds submit \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}" \
  --timeout=20m

# -----------------------------------------------------------------------------
# 4. Deploy to Cloud Run
# -----------------------------------------------------------------------------
echo "→ Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi --cpu 1 \
  --min-instances 0 --max-instances 5 \
  --set-env-vars "NEXT_PUBLIC_USE_MOCK_DATA=true" \
  --project "${PROJECT_ID}"

# -----------------------------------------------------------------------------
# 5. Print the URL
# -----------------------------------------------------------------------------
URL="$(gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --format 'value(status.url)' \
  --project "${PROJECT_ID}")"

echo ""
echo "==========================================================================="
echo "  ✅ DONE"
echo "==========================================================================="
echo ""
echo "  Your app is live at:"
echo "    ${URL}"
echo ""
echo "  Try these:"
echo "    ${URL}/             ← Login (any credentials work in mock mode)"
echo "    ${URL}/dashboard    ← Kid dashboard"
echo "    ${URL}/admin        ← Admin console"
echo ""
echo "  When you're ready for real auth/storage, follow DEPLOY.md."
echo "==========================================================================="
