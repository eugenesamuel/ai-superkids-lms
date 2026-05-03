"use client";

import { useEffect, useState } from "react";

const COLORS = ["#FF6B35", "#00D4FF", "#00E676", "#FFD700", "#A855F7"];

type Piece = { id: number; left: number; bg: string; delay: number; rotate: number };

export function ConfettiBlast({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const next: Piece[] = Array.from({ length: 50 }, (_, i) => ({
      id: trigger * 1000 + i,
      left: Math.random() * 100,
      bg: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.4,
      rotate: Math.random() * 360,
    }));
    setPieces(next);
    const timer = setTimeout(() => setPieces([]), 2000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            background: p.bg,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
