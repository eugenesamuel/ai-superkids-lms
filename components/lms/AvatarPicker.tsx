"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// 12 robot avatars rendered as inline SVG (no real photos, no external assets needed for MVP).
// Each is a unique color combo on the same friendly robot silhouette.

const PALETTES: { body: string; accent: string; eyes: string; antenna: string }[] = [
  { body: "#FF6B35", accent: "#FFB89A", eyes: "#1A1A2E", antenna: "#FFD700" },
  { body: "#00D4FF", accent: "#A0E9FF", eyes: "#1A1A2E", antenna: "#FF6B35" },
  { body: "#00E676", accent: "#A0F4C2", eyes: "#1A1A2E", antenna: "#A855F7" },
  { body: "#A855F7", accent: "#D5B4F8", eyes: "#FFFFFF", antenna: "#00E676" },
  { body: "#FFD700", accent: "#FFEB99", eyes: "#1A1A2E", antenna: "#FF4D4D" },
  { body: "#FF4D4D", accent: "#FFB3B3", eyes: "#FFFFFF", antenna: "#00D4FF" },
  { body: "#1A1A2E", accent: "#3D3D5C", eyes: "#00D4FF", antenna: "#FF6B35" },
  { body: "#26C6DA", accent: "#A6EAF1", eyes: "#1A1A2E", antenna: "#FFD700" },
  { body: "#EC407A", accent: "#F5A0BD", eyes: "#FFFFFF", antenna: "#00E676" },
  { body: "#5C6BC0", accent: "#A4ADDB", eyes: "#FFFFFF", antenna: "#FFD700" },
  { body: "#66BB6A", accent: "#B6DCB8", eyes: "#1A1A2E", antenna: "#FF6B35" },
  { body: "#FFA726", accent: "#FFD195", eyes: "#1A1A2E", antenna: "#A855F7" },
];

export function RobotAvatar({
  id,
  size = 64,
  className,
}: {
  id: number;
  size?: number;
  className?: string;
}) {
  const p = PALETTES[(id - 1) % PALETTES.length] ?? PALETTES[0];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* antenna */}
      <line x1="32" y1="6" x2="32" y2="14" stroke={p.antenna} strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="5" r="3" fill={p.antenna} />
      {/* head */}
      <rect x="12" y="14" width="40" height="34" rx="10" fill={p.body} />
      <rect x="16" y="20" width="32" height="22" rx="6" fill={p.accent} />
      {/* eyes */}
      <circle cx="24" cy="30" r="3.5" fill={p.eyes} />
      <circle cx="40" cy="30" r="3.5" fill={p.eyes} />
      <circle cx="25" cy="29" r="1" fill="white" />
      <circle cx="41" cy="29" r="1" fill="white" />
      {/* mouth */}
      <rect x="27" y="36" width="10" height="3" rx="1.5" fill={p.eyes} />
      {/* ears */}
      <rect x="8" y="24" width="4" height="14" rx="2" fill={p.body} />
      <rect x="52" y="24" width="4" height="14" rx="2" fill={p.body} />
      {/* body */}
      <rect x="20" y="48" width="24" height="12" rx="4" fill={p.body} />
    </svg>
  );
}

export function AvatarPicker({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
      {PALETTES.map((_, i) => {
        const id = i + 1;
        const isSel = selected === id;
        return (
          <motion.button
            key={id}
            type="button"
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(id)}
            className={cn(
              "rounded-2xl p-2 border-2 transition-colors bg-white",
              isSel ? "border-ds-orange shadow-glow" : "border-space-navy/10",
            )}
          >
            <RobotAvatar id={id} size={56} />
          </motion.button>
        );
      })}
    </div>
  );
}
