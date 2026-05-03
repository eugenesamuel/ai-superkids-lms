"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Trophy,
  Users,
  User as UserIcon,
  LogOut,
  BarChart3,
  BookOpen,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPlanets } from "@/lib/mock-data";

const currentPlanetId =
  mockPlanets.find((p) => p.status === "current")?.id ?? mockPlanets[0]?.id ?? "planet-1";

const PRIMARY = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: `/course/${currentPlanetId}`, label: "Course", icon: BookOpen, matchPrefix: "/course" },
  { href: "/games", label: "Games", icon: Gamepad2, matchPrefix: "/games" },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/leaderboard", label: "Leaderboard", icon: Users },
];

const SECONDARY = [
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/dashboard/parent", label: "Parent View", icon: BarChart3 },
  { href: "/", label: "Log out", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(item: { href: string; matchPrefix?: string }) {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    if (item.href === "/dashboard/parent") return pathname === "/dashboard/parent";
    if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  return (
    <aside className="hidden lg:flex w-60 shrink-0 border-r border-neutral-200 bg-white flex-col">
      {/* Logo — height matched to WelcomeBar */}
      <div className="h-[88px] px-5 flex items-center border-b border-neutral-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-ds-orange text-white font-display font-bold text-sm">
            DS
          </span>
          <div className="leading-tight">
            <p className="font-display font-bold text-space-navy text-sm">SuperKids</p>
            <p className="text-[10px] uppercase tracking-wider text-space-navy/45 font-display">
              Digital Scholar
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <Section title="Home Page">
          {PRIMARY.map((item) => (
            <Item key={item.href} {...item} active={isActive(item)} />
          ))}
        </Section>
        <Section title="Settings">
          {SECONDARY.map((item) => (
            <Item key={item.href} {...item} active={isActive(item)} />
          ))}
        </Section>
      </nav>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.14em] text-space-navy/40 font-display font-semibold">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Item({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  matchPrefix?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition-colors tap-scale",
        active
          ? "bg-ds-orange/10 text-ds-orange"
          : "text-space-navy/65 hover:bg-neutral-100 hover:text-space-navy",
      )}
    >
      <Icon className={cn("w-4 h-4", active && "text-ds-orange")} />
      {label}
    </Link>
  );
}
