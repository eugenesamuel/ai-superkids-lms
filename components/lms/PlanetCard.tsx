"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Planet } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PlanetCard({ planet, index }: { planet: Planet; index: number }) {
  const isLocked = planet.status === "locked";
  const isCurrent = planet.status === "current";
  const isCompleted = planet.status === "completed";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={!isLocked ? { scale: 1.06 } : undefined}
      whileTap={!isLocked ? { scale: 0.97 } : undefined}
      className={cn(
        "relative flex flex-col items-center text-center group",
        isLocked && "cursor-not-allowed",
      )}
    >
      {/* The planet itself */}
      <div
        className={cn(
          "relative w-32 h-32 sm:w-36 sm:h-36 rounded-full grid place-items-center transition-all",
          isCurrent && "animate-pulse-ring",
          isLocked && "grayscale opacity-50",
        )}
        style={{
          background: isLocked
            ? "radial-gradient(circle at 30% 30%, #BBB, #888)"
            : `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}cc, ${planet.color}88)`,
          boxShadow: isCompleted
            ? `0 8px 24px ${planet.color}55, 0 0 32px ${planet.color}55`
            : isCurrent
              ? `0 8px 24px ${planet.color}66, 0 0 32px ${planet.color}88`
              : "0 6px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Orbiting ring */}
        <span
          className="absolute inset-[-12px] rounded-full border border-dashed opacity-50"
          style={{ borderColor: planet.color }}
        />
        <span className="font-display text-4xl sm:text-5xl text-white drop-shadow-md">
          {planet.planetNumber}
        </span>
        {isLocked && (
          <span className="absolute inset-0 grid place-items-center bg-black/30 rounded-full">
            <Lock className="w-9 h-9 text-white" />
          </span>
        )}
        {isCompleted && (
          <span className="absolute -top-2 -right-2 grid place-items-center w-9 h-9 rounded-full bg-neon-green text-white font-display shadow-glow-green">
            ✓
          </span>
        )}
        {isCurrent && (
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ds-orange text-white text-[10px] font-display uppercase tracking-wider py-1 px-2.5 rounded-full shadow-glow">
            You're here!
          </span>
        )}
      </div>

      <div className="mt-5 max-w-[10rem]">
        <p className="font-display text-xs uppercase tracking-wide" style={{ color: planet.color }}>
          {planet.weekRange}
        </p>
        <p className="font-display text-base sm:text-lg text-space-navy leading-tight mt-0.5">
          {planet.title}
        </p>
        <p className="text-xs text-space-navy/60 mt-0.5 leading-snug">{planet.topic}</p>
      </div>

      {isLocked && (
        <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-space-navy/90 text-white text-[10px] font-body py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Finish the last mission to unlock!
        </span>
      )}
    </motion.div>
  );

  if (isLocked) return inner;
  return (
    <Link href={`/course/${planet.id}`} className="tap-scale">
      {inner}
    </Link>
  );
}
