"use client";

import { useEffect, useState } from "react";
import {
  mockPlanets,
  mockMissions,
  mockActivities,
  mockDocuments,
  mockLeaderboard,
  mockUser,
} from "./mock-data";
import type {
  Activity,
  Document,
  LeaderboardEntry,
  Mission,
  Planet,
  User,
} from "./types";

export type AppData = {
  planets: Planet[];
  missions: Mission[];
  activities: Activity[];
  documents: Document[];
  leaderboard: LeaderboardEntry[];
  user: User;
};

const FALLBACK: AppData = {
  planets: mockPlanets,
  missions: mockMissions,
  activities: mockActivities,
  documents: mockDocuments,
  leaderboard: mockLeaderboard,
  user: mockUser,
};

// Module-level cache + in-flight promise so all pages share one fetch.
let cache: AppData | null = null;
let inFlight: Promise<AppData> | null = null;

async function fetchAll(): Promise<AppData> {
  if (cache) return cache;
  if (inFlight) return inFlight;
  inFlight = fetch("/api/public")
    .then(async (r) => (r.ok ? ((await r.json()) as AppData) : FALLBACK))
    .then((d) => {
      cache = { ...FALLBACK, ...d };
      return cache;
    })
    .catch(() => FALLBACK);
  return inFlight;
}

export function useAppData(): AppData {
  const [data, setData] = useState<AppData>(cache ?? FALLBACK);
  useEffect(() => {
    if (cache) {
      setData(cache);
      return;
    }
    let cancelled = false;
    fetchAll().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return data;
}

// Helper for pages that pull a single mission/planet by id.
export function useMission(id: string): Mission | undefined {
  return useAppData().missions.find((m) => m.id === id);
}
export function usePlanet(id: string): Planet | undefined {
  return useAppData().planets.find((p) => p.id === id);
}
