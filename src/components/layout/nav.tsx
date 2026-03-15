"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, Target, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/practice", label: "Practice", icon: Mic },
  { href: "/drills", label: "Drills", icon: Zap },
  { href: "/tracks", label: "Tracks", icon: Target },
  { href: "/journal", label: "Journal", icon: BookOpen },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-stage-text-muted)]/10 bg-white/80 backdrop-blur-xl md:static md:border-t-0 md:border-r md:bg-transparent md:backdrop-blur-none">
      <div className="flex items-center justify-around px-2 py-2 md:flex-col md:items-stretch md:justify-start md:gap-1 md:px-3 md:py-6">
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 px-3 py-3 mb-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-stage-primary)] text-white font-bold text-sm">
            S
          </div>
          <span
            className="text-lg tracking-tight text-[var(--color-stage-text)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Stage
          </span>
        </Link>

        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-colors md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm",
                isActive
                  ? "text-[var(--color-stage-primary)] bg-[var(--color-stage-soft)]"
                  : "text-[var(--color-stage-text-secondary)] hover:text-[var(--color-stage-text)] hover:bg-[var(--color-stage-soft)]/50"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(isActive && "font-medium")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
