"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { VideoPlayer } from "@/components/games/VideoPlayer";
import { ActivityCard } from "@/components/games/ActivityCard";
import { AIBuddy } from "@/components/AIBuddy";
import { ConfettiBlast } from "@/components/games/ConfettiBlast";
import { getRecordingFor, getBatchById } from "@/lib/mock-data";
import { useAppData } from "@/lib/use-app-data";
import { copy } from "@/lib/copy";
import { PP_ACTIONS } from "@/lib/xp";

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const { user, missions, activities: allActivities } = useAppData();
  const mission = missions.find((m) => m.id === params.lessonId);

  if (!mission) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="font-display font-bold text-2xl text-space-navy">Mission not found</h2>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-ds-orange text-white font-display font-semibold text-sm tap-scale shadow-sm hover:brightness-110"
        >
          <ChevronLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  // Look up the recording for the parent's batch — different batches see different recordings.
  const recording = getRecordingFor(mission.id, user.batchId);
  const batch = getBatchById(user.batchId);
  const recordingReadyMock = recording?.status === "ready" && recording.recordingPath;

  // Fetch a real signed playback URL from the API. Falls back to mock path if API returns null.
  const [signedSrc, setSignedSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/video/playback-url?lessonId=${encodeURIComponent(params.lessonId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.url) setSignedSrc(data.url);
      })
      .catch((err) => {
        // Server-side issues are logged on Cloud Run; kids see only a friendly message.
        console.error("[lesson] signed URL fetch failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [params.lessonId]);

  const videoSrc = signedSrc ?? (recordingReadyMock ? recording!.recordingPath : null);

  const activities = allActivities.filter((a) => a.missionId === mission.id);
  const allMissions = missions.filter((m) => m.planetId === mission.planetId).sort((a, b) => a.orderIndex - b.orderIndex);
  const idx = allMissions.findIndex((m) => m.id === mission.id);
  const prev = allMissions[idx - 1];
  const next = allMissions[idx + 1];

  const [confettiTick, setConfettiTick] = useState(0);
  const [completed, setCompleted] = useState(mission.status === "completed");
  const [activitiesDone, setActivitiesDone] = useState<Set<string>>(new Set());
  const [pointsToast, setPointsToast] = useState<number | null>(null);

  function fireToast(amount: number) {
    setPointsToast(amount);
    setConfettiTick((t) => t + 1);
    setTimeout(() => setPointsToast(null), 2200);
  }

  function handleVideoComplete() {
    if (completed) return;
    setCompleted(true);
    fireToast(PP_ACTIONS.WATCH_MISSION);
  }

  function handleActivitySubmit(activityId: string) {
    if (activitiesDone.has(activityId)) return;
    setActivitiesDone((s) => new Set([...s, activityId]));
    fireToast(PP_ACTIONS.COMPLETE_ACTIVITY);
  }

  return (
    <div className="px-6 py-6">
      <ConfettiBlast trigger={confettiTick} />

      {/* PP toast */}
      {pointsToast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ds-orange text-white font-display font-semibold text-base py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />+{pointsToast} Power Points
        </motion.div>
      )}

      <div>
        {/* Breadcrumb */}
        <Link
          href={`/course/${mission.planetId}`}
          className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display"
        >
          <ChevronLeft className="w-4 h-4" /> {copy.backToMap}
        </Link>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* LEFT: video */}
          <div className="lg:col-span-3 space-y-3">
            <h1 className="font-display text-2xl sm:text-3xl text-space-navy leading-tight">
              {mission.title}
            </h1>
            <p className="text-space-navy/70 font-body">{mission.description}</p>
            <VideoPlayer
              src={videoSrc}
              watermark={`${user.childName} · AI SuperKids`}
              onComplete={handleVideoComplete}
            />
            {recording?.status === "processing" && (
              <p className="text-sm text-electric-cyan font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Recording is being processed — usually ready within 10 minutes.
              </p>
            )}
            {!recording && batch && (
              <p className="text-sm text-space-navy/60 font-body">
                The recording for {batch.name} hasn't been uploaded yet. Eugene usually posts it within a day of the live session.
              </p>
            )}
            {completed && (
              <p className="flex items-center gap-2 text-neon-green font-display">
                <CheckCircle2 className="w-5 h-5" /> {copy.completed}
              </p>
            )}
          </div>

          {/* RIGHT: mission checklist + activity + buddy slot */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-light-orange rounded-3xl p-5 border border-ds-orange/20">
              <h3 className="font-display text-base text-space-navy mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ds-orange" />
                Your Mission Today
              </h3>
              <ul className="space-y-2 text-sm font-body text-space-navy">
                <Check checked={completed} label={`Watch the recording (${mission.durationMins} min)`} />
                {activities.map((a) => (
                  <Check key={a.id} checked={activitiesDone.has(a.id)} label={a.title} />
                ))}
              </ul>
            </div>

            {activities.length > 0 ? (
              activities.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  onSubmit={() => handleActivitySubmit(a.id)}
                />
              ))
            ) : (
              <div className="bg-white rounded-3xl p-5 border border-space-navy/5 text-center">
                <p className="font-display text-space-navy">
                  No challenge today — just enjoy the mission! 🚀
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
          <div>
            {prev && (
              <Link
                href={`/lesson/${prev.id}`}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white border border-space-navy/10 text-space-navy font-display tap-scale"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Link>
            )}
          </div>
          <button
            onClick={handleVideoComplete}
            disabled={completed}
            className="px-6 py-3 rounded-2xl bg-neon-green/15 text-neon-green border-2 border-neon-green/40 font-display tap-scale disabled:opacity-50"
          >
            {completed ? "Done!" : "Mark as Complete"}
          </button>
          <div>
            {next && (
              <Link
                href={`/lesson/${next.id}`}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-ds-orange text-white font-display tap-scale"
              >
                Next Mission <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <AIBuddy />
    </div>
  );
}

function Check({ checked, label }: { checked: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`grid place-items-center w-5 h-5 rounded-full border-2 ${
          checked ? "bg-neon-green border-neon-green" : "border-space-navy/30"
        }`}
      >
        {checked && <CheckCircle2 className="w-4 h-4 text-white" />}
      </span>
      <span className={checked ? "line-through text-space-navy/50" : ""}>{label}</span>
    </li>
  );
}
