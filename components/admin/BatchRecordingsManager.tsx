"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Upload,
  Loader2,
  Eye,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Clock,
  GripVertical,
  Plus,
} from "lucide-react";
import type { Batch, BatchRecording, Mission } from "@/lib/types";
import { cn } from "@/lib/utils";

type Row = {
  mission: Mission;
  recording?: BatchRecording;
};

export function BatchRecordingsManager({
  batch,
  missions,
  initialRecordings,
}: {
  batch: Batch;
  missions: Mission[];
  initialRecordings: BatchRecording[];
}) {
  const [recordings, setRecordings] = useState<BatchRecording[]>(initialRecordings);

  // Reload from API on mount + after upload so persisted state shows up.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/recordings?batchId=${encodeURIComponent(batch.id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.recordings) setRecordings(data.recordings);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [batch.id]);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BatchRecording | null>(null);
  const [previewing, setPreviewing] = useState<BatchRecording | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const rows: Row[] = missions.map((m) => ({
    mission: m,
    recording: recordings.find((r) => r.missionId === m.id),
  }));

  const ready = rows.filter((r) => r.recording?.status === "ready").length;

  async function handleSaveUpload(missionId: string, file: File | null, freePreview: boolean) {
    const m = missions.find((mm) => mm.id === missionId);
    if (!m) return;
    void freePreview; // not in BatchRecording type yet
    const existing = recordings.find((r) => r.missionId === missionId);

    // Create or update recording row in `processing` state immediately for UI feedback.
    const newRec: BatchRecording = existing
      ? { ...existing, status: "processing", uploadedAt: new Date().toISOString(), recordingPath: `/mock/uploaded-${Date.now()}.mp4`, sizeMB: file ? Math.round(file.size / (1024 * 1024)) : 380 }
      : {
          id: `r-${Date.now()}`,
          batchId: batch.id,
          missionId: m.id,
          title: m.title,
          recordingPath: `/mock/uploaded-${Date.now()}.mp4`,
          uploadedAt: new Date().toISOString(),
          durationMins: m.durationMins,
          views: 0,
          status: "processing",
          sizeMB: file ? Math.round(file.size / (1024 * 1024)) : 380,
        };
    setRecordings((prev) =>
      existing ? prev.map((r) => (r.id === existing.id ? newRec : r)) : [...prev, newRec],
    );
    setOpenRow(null);

    // Try real upload via signed URL from /api/video/upload-url
    let uploadOk = false;
    if (file) {
      try {
        const res = await fetch("/api/video/upload-url", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            batchId: batch.id,
            missionId: m.id,
            contentType: file.type || "video/mp4",
          }),
        });
        if (res.ok) {
          const { url } = (await res.json()) as { url: string | null };
          if (url) {
            const putRes = await fetch(url, {
              method: "PUT",
              headers: { "content-type": file.type || "video/mp4" },
              body: file,
            });
            uploadOk = putRes.ok;
            if (!uploadOk) console.error("[upload] PUT failed:", putRes.status);
          }
        }
      } catch (err) {
        console.error("[upload] failed:", err);
      }
    }

    // Persist recording metadata to Firestore so it survives reloads
    if (uploadOk) {
      try {
        await fetch("/api/admin/recordings", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            batchId: batch.id,
            missionId: m.id,
            sizeMB: file ? Math.round(file.size / (1024 * 1024)) : 380,
            durationMins: m.durationMins,
          }),
        });
      } catch (err) {
        console.error("[upload] persist metadata failed:", err);
      }
    }

    // Flip to ready
    window.setTimeout(() => {
      setRecordings((prev) =>
        prev.map((r) => (r.id === newRec.id ? { ...r, status: "ready" } : r)),
      );
    }, 2500);
  }

  function handleDelete(rec: BatchRecording) {
    setRecordings((prev) => prev.filter((r) => r.id !== rec.id));
    setConfirmDelete(null);
  }

  function handleCopyLink(rec: BatchRecording) {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/lesson/${rec.missionId}`;
    navigator.clipboard?.writeText(url);
    setCopied(rec.id);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="p-5 sm:p-6">
      {/* TagMango-style header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h3 className="font-display font-bold text-lg text-space-navy">
            Class recordings
          </h3>
          <p className="text-sm text-space-navy/60 mt-0.5">
            One video per mission for <strong className="text-space-navy">{batch.name}</strong>. Click a row to upload or replace its recording.
          </p>
        </div>
        <p className="text-xs font-display font-semibold text-space-navy/55 tabular-nums">
          {ready} of {missions.length} published
        </p>
      </div>

      {/* Mission/chapter rows */}
      <div className="space-y-2.5">
        {rows.map(({ mission: m, recording: rec }) => {
          const isOpen = openRow === m.id;
          const isReady = rec?.status === "ready";
          const isProcessing = rec?.status === "processing";

          return (
            <div
              key={m.id}
              className={cn(
                "rounded-xl border transition-colors",
                isOpen ? "border-ds-orange bg-white shadow-sm" : "border-neutral-200 bg-neutral-50",
              )}
            >
              {/* Row header */}
              <button
                type="button"
                onClick={() => setOpenRow(isOpen ? null : m.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left tap-scale"
              >
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-space-navy/40 shrink-0 transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
                <span
                  className={cn(
                    "grid place-items-center w-9 h-9 rounded-lg shrink-0",
                    isReady
                      ? "bg-neon-green/15 text-neon-green"
                      : isProcessing
                        ? "bg-electric-cyan/15 text-electric-cyan"
                        : "bg-ds-orange/15 text-ds-orange",
                  )}
                >
                  {isReady ? (
                    <Play className="w-4 h-4 fill-current" />
                  ) : isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm text-space-navy">
                    <span className="text-space-navy/40 mr-1.5">Mission {m.orderIndex}:</span>
                    {m.title}
                  </p>
                  <p className="text-xs text-space-navy/55 mt-0.5">
                    {isReady && rec
                      ? `Uploaded ${new Date(rec.uploadedAt!).toLocaleDateString()} · ${rec.durationMins} min · ${rec.sizeMB} MB · ${rec.views} views`
                      : isProcessing
                        ? `Processing — usually ready in 2-10 min`
                        : `No recording yet · ${m.durationMins} min target length`}
                  </p>
                </div>
                {/* Status pill */}
                <StatusPill recording={rec} />
                <GripVertical className="w-4 h-4 text-space-navy/25 hidden sm:inline-block" />
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div className="px-4 pb-4 -mt-1 border-t border-neutral-100 pt-4 space-y-3">
                  {isReady && rec ? (
                    <ReadyRowActions
                      rec={rec}
                      onPreview={() => setPreviewing(rec)}
                      onReplace={() => {
                        // Stay open, just reset to upload mode by removing the recording temporarily.
                        // Simpler: keep the row open, show the uploader below the actions.
                        setOpenRow(m.id);
                      }}
                      onCopy={() => handleCopyLink(rec)}
                      onDelete={() => setConfirmDelete(rec)}
                      copied={copied === rec.id}
                    />
                  ) : null}

                  {/* Upload zone — always shown when row is open and not processing */}
                  {!isProcessing && (
                    <UploadZone
                      missionTitle={m.title}
                      isReplacement={isReady}
                      onCancel={() => setOpenRow(null)}
                      onSave={(file, freePreview) => handleSaveUpload(m.id, file, freePreview)}
                    />
                  )}

                  {isProcessing && (
                    <div className="text-sm text-electric-cyan font-display font-semibold flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing — kids will see the recording the moment it's ready.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add a future-mission stub */}
      <button
        type="button"
        disabled
        title="Missions are defined in Course Content — go there to add new ones."
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-display font-semibold text-space-navy/40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        Add more missions in Course Content
      </button>

      {/* Preview modal — real video player via signed URL */}
      {previewing && (
        <PreviewModal
          recording={previewing}
          batchName={batch.name}
          onClose={() => setPreviewing(null)}
        />
      )}
      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-space-navy">
              Delete this recording?
            </h2>
            <p className="text-sm text-space-navy/60">
              <strong className="text-space-navy">{confirmDelete.title}</strong> for{" "}
              <strong className="text-space-navy">{batch.name}</strong> will be removed. Kids in this batch will lose access. This can't be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 font-display font-semibold text-sm hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-display font-semibold text-sm hover:brightness-110"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function PreviewModal({
  recording,
  batchName,
  onClose,
}: {
  recording: BatchRecording;
  batchName: string;
  onClose: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the signed URL on mount. Falls back to recording.recordingPath when not a /mock/ path.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/video/playback-url?lessonId=${encodeURIComponent(recording.missionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.url) {
          setSrc(data.url);
        } else if (
          recording.recordingPath &&
          !recording.recordingPath.startsWith("/mock/")
        ) {
          setSrc(recording.recordingPath);
        } else {
          setErr(
            "This recording is seeded mock data — no real file in Cloud Storage yet. Upload a real video using the row above and the preview will play it.",
          );
        }
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("[preview] signed URL fetch failed:", e);
        setErr("Couldn't load the signed URL.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [recording.missionId, recording.recordingPath]);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-base text-space-navy">
              {recording.title}
            </p>
            <p className="text-xs text-space-navy/55 mt-0.5">
              {batchName} · {recording.durationMins} min · {recording.sizeMB} MB
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-display font-semibold text-xs"
          >
            Close
          </button>
        </div>
        <div className="aspect-video bg-space-deep grid place-items-center text-white/70 relative">
          {loading && (
            <p className="text-xs text-white/55 font-display">Loading signed URL...</p>
          )}
          {!loading && src && (
            <video
              src={src}
              controls
              autoPlay
              controlsList="nodownload noremoteplayback"
              className="absolute inset-0 w-full h-full"
              onContextMenu={(e) => e.preventDefault()}
            />
          )}
          {!loading && !src && err && (
            <div className="text-center px-6">
              <Play className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm mt-2 font-display">Can't preview this one</p>
              <p className="text-xs text-white/55 mt-1.5 max-w-md">{err}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ recording }: { recording?: BatchRecording }) {
  if (!recording) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ds-orange/10 text-ds-orange text-[10px] font-display font-semibold uppercase tracking-wider shrink-0">
        Pending
      </span>
    );
  }
  if (recording.status === "ready") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-green/15 text-neon-green text-[10px] font-display font-semibold uppercase tracking-wider shrink-0">
        Published
      </span>
    );
  }
  if (recording.status === "processing") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-electric-cyan/15 text-electric-cyan text-[10px] font-display font-semibold uppercase tracking-wider shrink-0">
        <Loader2 className="w-3 h-3 animate-spin" />
        Processing
      </span>
    );
  }
  return (
    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ds-orange/10 text-ds-orange text-[10px] font-display font-semibold uppercase tracking-wider shrink-0">
      Pending
    </span>
  );
}

function ReadyRowActions({
  rec,
  onPreview,
  onCopy,
  onDelete,
  copied,
}: {
  rec: BatchRecording;
  onPreview: () => void;
  onReplace: () => void;
  onCopy: () => void;
  onDelete: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={onPreview}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 font-display font-semibold text-xs text-space-navy tap-scale"
      >
        <Eye className="w-3.5 h-3.5" /> Preview
      </button>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 font-display font-semibold text-xs text-space-navy tap-scale"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-display font-semibold text-xs tap-scale"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
      <span className="ml-auto inline-flex items-center gap-1 text-xs text-space-navy/55 font-body">
        <Clock className="w-3 h-3" />
        {rec.durationMins} min
      </span>
    </div>
  );
}

function UploadZone({
  isReplacement,
  onCancel,
  onSave,
}: {
  missionTitle: string;
  isReplacement?: boolean;
  onCancel: () => void;
  onSave: (file: File | null, freePreview: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [freePreview, setFreePreview] = useState(false);

  return (
    <div className="space-y-3">
      {/* Input is INSIDE the label so clicking the zone opens the picker
          without needing matching for/id (the previous Math.random ids didn't match) */}
      <label
        className={cn(
          "border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer block",
          file
            ? "border-neon-green bg-neon-green/5"
            : "border-neutral-200 hover:border-ds-orange",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) setFile(dropped);
        }}
      >
        <Upload className="w-5 h-5 mx-auto text-space-navy/40" />
        <p className="text-sm text-space-navy/65 mt-1 font-display font-semibold">
          {file
            ? `Picked: ${file.name} (${Math.round(file.size / (1024 * 1024))} MB)`
            : isReplacement
              ? "Drop a new MP4 to replace, or click to browse"
              : "Drop MP4 or click to browse"}
        </p>
        <p className="text-[10px] text-space-navy/45 mt-0.5">
          Up to 4 GB · auto-transcoded for streaming
        </p>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {/* Free preview toggle (mirrors TagMango) */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <button
          type="button"
          onClick={() => setFreePreview((v) => !v)}
          className={cn(
            "relative w-9 h-5 rounded-full transition-colors",
            freePreview ? "bg-ds-orange" : "bg-neutral-300",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
              freePreview ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
        <span className="text-xs text-space-navy/65 font-body">
          Make this recording free-preview for non-batch viewers
        </span>
      </label>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 font-display font-semibold text-xs text-space-navy"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!file}
          onClick={() => onSave(file, freePreview)}
          className="px-5 py-2 rounded-lg bg-ds-orange text-white font-display font-semibold text-xs hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
