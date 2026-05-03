"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function HeroPromoCard({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero-promo rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
    >
      <div className="relative z-10 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="max-w-md">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-wider font-display font-semibold text-white/60 mb-2">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed">{body}</p>
          <Link
            href={ctaHref}
            className="mt-5 inline-flex items-center gap-2 bg-white text-space-navy font-display font-semibold text-sm px-5 py-2.5 rounded-full tap-scale hover:bg-white/90 transition"
          >
            {ctaLabel}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Robot mascot illustration */}
        <div className="hidden sm:block">
          <svg width="170" height="190" viewBox="0 0 160 180" className="robot-float">
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF8B5C" />
                <stop offset="100%" stopColor="#FF6B35" />
              </linearGradient>
            </defs>
            <line x1="80" y1="14" x2="80" y2="32" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="12" r="5" fill="#FFD700" />
            <rect x="30" y="32" width="100" height="80" rx="20" fill="url(#bodyGrad)" />
            <rect x="42" y="46" width="76" height="56" rx="14" fill="#FFE6D8" />
            <circle cx="62" cy="74" r="9" fill="#1A1A2E" />
            <circle cx="98" cy="74" r="9" fill="#1A1A2E" />
            <circle cx="64" cy="71" r="3" fill="#00D4FF" />
            <circle cx="100" cy="71" r="3" fill="#00D4FF" />
            <rect x="68" y="92" width="24" height="6" rx="3" fill="#1A1A2E" />
            <rect x="20" y="56" width="10" height="32" rx="5" fill="#FF6B35" />
            <rect x="130" y="56" width="10" height="32" rx="5" fill="#FF6B35" />
            <rect x="50" y="112" width="60" height="40" rx="12" fill="#FF6B35" />
            <circle cx="80" cy="132" r="6" fill="#00E676" />
          </svg>
        </div>
      </div>

      {/* Decorative dots */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        <span className="w-6 h-1.5 rounded-full bg-white/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </span>
    </motion.section>
  );
}
