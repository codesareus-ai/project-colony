/**
 * App-wide constants: sport scope, seasons, navigation, cache profile names.
 * Single source of truth for the product surface so screens don't hardcode.
 */
export const SPORTS = ["AFL", "NBA"] as const;

export const SEASON_2025 = "2025";

export const NAV_PILLARS = [
  { href: "/live", label: "Live Centre" },
  { href: "/upcoming", label: "Upcoming + Odds" },
  { href: "/props", label: "Player Props" },
  { href: "/players", label: "Player Form" },
  { href: "/intel", label: "Intel" },
  { href: "/filters", label: "Filters" },
] as const;

/** Cache profile keys (mirror next.config.ts). */
export const CACHE_PROFILES = {
  live: "live",
  prematch: "prematch",
  form: "form",
  intel: "intel",
} as const;

/** Perf budgets (Core Web Vitals targets, see docs/ARCHITECTURE.md). */
export const PERF_BUDGET = {
  LCP: 2500,
  CLS: 0.1,
  INP: 200,
} as const;
