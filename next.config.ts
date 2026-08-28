import type { NextConfig } from "next";

/**
 * Project Colony — Next.js config.
 *
 * Cache Components (PPR) are enabled so the data layer can be cached per
 * data type. Each profile maps to a freshness requirement documented in
 * docs/ARCHITECTURE.md. Components opt into a profile via `cacheLife(name)`.
 */
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    // Live scores / in-game events. Too fresh to prerender; streams behind
    // <Suspense> at request time. Revalidated aggressively in the background.
    live: { stale: 20, revalidate: 10, expire: 600 },
    // Fixtures + odds. Change between sessions, stable within a short window.
    prematch: { stale: 300, revalidate: 300, expire: 3600 },
    // Player form / season stats. Slow-moving, recomputed hourly.
    form: { stale: 3600, revalidate: 3600, expire: 86400 },
    // Injuries + standings intel. Updated a few times per day.
    intel: { stale: 300, revalidate: 900, expire: 21600 },
  },
};

export default nextConfig;
