"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { RobotAvatar } from "./AvatarPicker";
import type { User } from "@/lib/types";

export function WelcomeBar({
  user,
  greeting,
}: {
  user: User;
  greeting?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 h-[88px] border-b border-neutral-100">
      <div>
        <p className="text-xs uppercase tracking-wider text-space-navy/45 font-display font-semibold">
          Welcome back
        </p>
        <h1 className="font-display font-bold text-2xl text-space-navy leading-tight">
          {greeting ?? user.childName}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative grid place-items-center w-10 h-10 rounded-full border border-neutral-200 hover:bg-neutral-100 tap-scale"
        >
          <Bell className="w-4 h-4 text-space-navy/70" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ds-orange" />
        </button>
        <Link
          href="/profile"
          className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-neutral-200 hover:bg-neutral-100 tap-scale"
        >
          <RobotAvatar id={user.childAvatarId} size={32} />
          <div className="leading-tight hidden sm:block">
            <p className="font-display text-sm font-semibold text-space-navy">
              {user.childName}
            </p>
            <p className="text-[10px] text-space-navy/50">Explorer · {user.city}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
