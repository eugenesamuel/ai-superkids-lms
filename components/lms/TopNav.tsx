"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  BarChart3,
  Home,
  Radio,
  Trophy,
  Map,
  User as UserIcon,
} from "lucide-react";
import { PowerPointsBar } from "./PowerPointsBar";
import { RobotAvatar } from "./AvatarPicker";
import { copy } from "@/lib/copy";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/live", label: "Live Class", icon: Radio },
  { href: "/achievements", label: "Badges", icon: Trophy },
  { href: "/leaderboard", label: "Top 10", icon: Map },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export function TopNav({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-space-navy/5 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-ds-orange text-white font-display shadow-glow">
            DS
          </span>
          <span className="hidden sm:inline font-display text-base text-space-navy">
            SuperKids
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-display text-sm tap-scale transition-colors",
                  active
                    ? "bg-light-orange text-ds-orange"
                    : "text-space-navy/70 hover:bg-light-orange/60 hover:text-ds-orange",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 max-w-xs ml-auto hidden md:block">
          <PowerPointsBar pp={user.powerPoints} variant="light" />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 tap-scale rounded-full pl-1 pr-2 py-1 hover:bg-light-orange transition-colors"
          >
            <RobotAvatar id={user.childAvatarId} size={36} />
            <span className="hidden sm:inline font-display text-space-navy text-sm">
              {user.childName}
            </span>
            <ChevronDown className="w-4 h-4 text-space-navy/40" />
          </button>
          {open && (
            <>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-30"
              />
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-space-navy/5 overflow-hidden z-40">
                <Link
                  href="/dashboard/parent"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-light-orange transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-ds-orange" />
                  <span className="font-display text-sm text-space-navy">
                    {copy.switchToParent}
                  </span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-light-orange transition-colors"
                >
                  <RobotAvatar id={user.childAvatarId} size={20} />
                  <span className="font-display text-sm text-space-navy">My Profile</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-light-orange transition-colors text-space-navy/70 border-t border-space-navy/5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-display text-sm">Log out</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PowerPointsBar — shown below nav on tablets/phones for clarity */}
      <div className="md:hidden px-4 pb-3 pt-1">
        <PowerPointsBar pp={user.powerPoints} variant="light" />
      </div>
    </header>
  );
}
