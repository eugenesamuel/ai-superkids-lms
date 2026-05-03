"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, User as UserIcon, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPlanets } from "@/lib/mock-data";

const currentPlanetId =
  mockPlanets.find((p) => p.status === "current")?.id ?? mockPlanets[0]?.id ?? "planet-1";

const items = [
  { href: "/dashboard", label: "Home", icon: Home, matchExact: true },
  { href: `/course/${currentPlanetId}`, label: "Course", icon: BookOpen, matchPrefix: "/course" },
  { href: "/games", label: "Games", icon: Gamepad2, matchPrefix: "/games" },
  { href: "/achievements", label: "Badges", icon: Trophy },
  { href: "/profile", label: "Me", icon: UserIcon },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-space-navy/10 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] lg:hidden">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {items.map((item) => {
          const active = item.matchExact
            ? pathname === item.href
            : item.matchPrefix
              ? pathname.startsWith(item.matchPrefix)
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 tap-scale",
                active ? "text-ds-orange" : "text-space-navy/55",
              )}
            >
              <span
                className={cn(
                  "grid place-items-center w-10 h-10 rounded-2xl transition-all",
                  active && "bg-light-orange",
                )}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-display uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
