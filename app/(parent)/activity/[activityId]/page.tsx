"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ActivityCard } from "@/components/games/ActivityCard";
import { ConfettiBlast } from "@/components/games/ConfettiBlast";
import { mockActivities } from "@/lib/mock-data";
import { PP_ACTIONS } from "@/lib/xp";
import { notFound } from "next/navigation";

export default function ActivityPage({ params }: { params: { activityId: string } }) {
  const activity = mockActivities.find((a) => a.id === params.activityId);
  if (!activity) notFound();

  const [confettiTick, setConfettiTick] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="px-6 py-6">
      <ConfettiBlast trigger={confettiTick} />
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ds-orange text-white font-display font-semibold text-base py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          +{PP_ACTIONS.COMPLETE_ACTIVITY} Power Points
        </motion.div>
      )}
      <div className="max-w-2xl space-y-4">
        <Link
          href={`/lesson/${activity.missionId}`}
          className="inline-flex items-center gap-1 text-sm text-space-navy/60 hover:text-ds-orange font-display"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Mission
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl text-space-navy leading-tight">
          {activity.title}
        </h1>
        <ActivityCard
          activity={activity}
          onSubmit={() => {
            if (submitted) return;
            setSubmitted(true);
            setConfettiTick((t) => t + 1);
          }}
        />
      </div>
    </div>
  );
}
