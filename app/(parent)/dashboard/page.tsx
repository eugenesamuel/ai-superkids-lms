"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroPromoCard } from "@/components/lms/HeroPromoCard";
import { RankingCard } from "@/components/lms/RankingCard";
import { ProgressChart } from "@/components/lms/ProgressChart";
import { MissionGridCard } from "@/components/lms/MissionGridCard";
import {
  mockUser,
  mockPlanets,
  mockMissions,
  mockLeaderboard,
  mockTrainerNote,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const currentPlanet = mockPlanets.find((p) => p.status === "current");
  const continueTarget = currentPlanet
    ? mockMissions.find((m) => m.planetId === currentPlanet.id && m.status === "available")
    : null;
  const courseHref = `/course/${currentPlanet?.id ?? mockPlanets[0]?.id ?? "planet-1"}`;

  // Pick the most relevant 6 missions to show in the "Continue learning" grid
  const grid = mockMissions
    .slice()
    .sort((a, b) => {
      const order = { available: 0, completed: 1, locked: 2 } as const;
      return order[a.status] - order[b.status];
    })
    .slice(0, 6);

  return (
    <div className="px-6 py-6 grid lg:grid-cols-[1fr_300px] gap-6">
      {/* MAIN COLUMN */}
      <div className="space-y-6 min-w-0">
        {/* Hero promo */}
        <HeroPromoCard
          eyebrow={continueTarget ? "Continue where you left off" : "AI SuperKids"}
          title={
            continueTarget
              ? continueTarget.title
              : "Open your course"
          }
          body={
            continueTarget
              ? `${continueTarget.description} Pick up Mission ${continueTarget.orderIndex} and earn +${continueTarget.xpReward} Power Points.`
              : "Watch recordings, complete assignments, and climb the leaderboard."
          }
          ctaLabel={continueTarget ? "Continue mission" : "Open course"}
          ctaHref={continueTarget ? `/lesson/${continueTarget.id}` : courseHref}
        />

        {/* Pagination dots — purely decorative to mirror the reference */}
        <div className="flex justify-center gap-1.5 -mt-2">
          <span className="w-6 h-1.5 rounded-full bg-ds-orange" />
          <span className="w-1.5 h-1.5 rounded-full bg-space-navy/15" />
          <span className="w-1.5 h-1.5 rounded-full bg-space-navy/15" />
        </div>

        {/* Continue learning grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-base text-space-navy">
              Continue learning
            </h3>
            <Link
              href={courseHref}
              className="text-xs font-display text-ds-orange inline-flex items-center"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {grid.map((m) => {
              const planet = mockPlanets.find((p) => p.id === m.planetId)!;
              return (
                <MissionGridCard
                  key={m.id}
                  mission={m}
                  planetColor={planet.color}
                  topicCount={4}
                  trainer={mockTrainerNote.author}
                />
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT RAIL */}
      <aside className="space-y-4">
        <RankingCard entries={mockLeaderboard} currentUid={mockUser.uid} />
        <ProgressChart />
      </aside>
    </div>
  );
}
