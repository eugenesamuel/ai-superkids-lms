"use client";

import { Bell, Search } from "lucide-react";

export function AdminWelcomeBar() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 h-[88px] border-b border-neutral-100 bg-white">
      <div>
        <p className="text-xs uppercase tracking-wider text-space-navy/45 font-display font-semibold">
          Admin Console
        </p>
        <h1 className="font-display font-bold text-2xl text-space-navy leading-tight">
          AI SuperKids Operations
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-ds-orange transition-all">
          <Search className="w-4 h-4 text-space-navy/40" />
          <input
            placeholder="Search students, sessions..."
            className="py-2 outline-none font-body text-sm w-56 bg-transparent"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative grid place-items-center w-10 h-10 rounded-full border border-neutral-200 hover:bg-neutral-100 tap-scale"
        >
          <Bell className="w-4 h-4 text-space-navy/70" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ds-orange" />
        </button>
        <div className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-neutral-200">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-ds-orange text-white font-display font-bold text-xs">
            ES
          </span>
          <div className="leading-tight hidden sm:block">
            <p className="font-display text-sm font-semibold text-space-navy">
              Eugene Samuel
            </p>
            <p className="text-[10px] text-space-navy/50">Lead Trainer · Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
