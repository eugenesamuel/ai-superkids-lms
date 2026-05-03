"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Layers,
  Boxes,
  Gamepad2,
  CheckSquare,
  Megaphone,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/batches", label: "Batches", icon: Layers },
  { href: "/admin/courses", label: "Course Content", icon: Boxes },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/submissions", label: "Submissions", icon: CheckSquare },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

const SECONDARY = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/", label: "Log out", icon: LogOut },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  return (
    <aside className="hidden lg:flex w-60 shrink-0 bg-space-navy text-white flex-col">
      {/* Logo */}
      <div className="h-[88px] px-5 flex items-center border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-ds-orange text-white font-display font-bold text-sm">
            DS
          </span>
          <div className="leading-tight">
            <p className="font-display font-bold text-white text-sm">SuperKids</p>
            <p className="text-[10px] uppercase tracking-wider text-white/50 font-display">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <Section title="Operations">
          {PRIMARY.map((item) => (
            <Item key={item.href} {...item} active={isActive(item)} />
          ))}
        </Section>
        <Section title="Account">
          {SECONDARY.map((item) => (
            <Item key={item.href} {...item} active={isActive(item)} />
          ))}
        </Section>
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-white/40 font-display font-semibold">
          Logged in as
        </p>
        <p className="font-display font-semibold text-sm text-white mt-0.5">
          Eugene Samuel
        </p>
        <p className="text-[10px] text-white/50">Lead Trainer</p>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.14em] text-white/35 font-display font-semibold">
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
  exact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition-colors tap-scale",
        active
          ? "bg-ds-orange/15 text-ds-orange"
          : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className={cn("w-4 h-4", active && "text-ds-orange")} />
      {label}
    </Link>
  );
}
