import Link from "next/link";
import { NAV_PILLARS } from "@/lib/config";

/**
 * Primary navigation for the six product pillars. Neutral styling placeholder —
 * @designer will re-skin. Server component (no interactivity needed yet).
 */
export function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight">
          COLONY<span className="text-accent">_</span>
        </Link>
        <ul className="flex flex-wrap gap-1 text-xs sm:gap-3 sm:text-sm">
          {NAV_PILLARS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="rounded px-2 py-1 text-muted transition-colors hover:bg-card hover:text-foreground"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
