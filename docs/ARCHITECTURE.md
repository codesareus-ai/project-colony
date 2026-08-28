# Colony — Architecture

> Owner: @architect · Audience: all engineering + design · Status: v1 scaffold (AFL + NBA)
> This document is the source of truth for system design. It will change as
> @strategist finalizes data sources — but the **seam** defined here will not.

---

## 1. Goals & constraints

- **Product**: AFL + NBA sports data & betting intelligence. Premium, fast,
  mobile-first, dark-mode-first, terminal aesthetic.
- **Non-goals**: No bet placement. No tips/guarantees. v1 = AFL + NBA only.
- **Architecture mandate (this ticket)**: the data layer is **swappable**. The
  day we swap free sources for paid ones, **only one module changes**
  (`lib/data/index.ts` + one `sources/<provider>` module). No screen changes.
- **No paid dependencies** unless signed off by @chief.
- **TypeScript strict everywhere. No `any` in shared code.**

---

## 2. System diagram

```
                         ┌─────────────────────────────────────────────┐
                         │                  UI (app/)                   │
                         │  Server Components (default) + minimal CC    │
                         │  Live Centre · Upcoming+Odds · Props ·       │
                         │  Player Form · Intel · Filters               │
                         └───────────────┬─────────────────────────────┘
                                         │ reads via cached accessors
                         ┌───────────────▼─────────────────────────────┐
                         │        lib/data/accessors.ts                 │
                         │  getLiveMatches() · getUpcoming() · ...      │
                         │  each: 'use cache' + cacheLife(profile)      │
                         │  + cacheTag(...) for targeted revalidation   │
                         └───────────────┬─────────────────────────────┘
                                         │ getDataProvider()
                         ┌───────────────▼─────────────────────────────┐
                         │        lib/data/index.ts  ◄── SWAP POINT      │
                         │  switch(COLONY_DATA_SOURCE)                  │
                         │   'stub'  → StubDataProvider (today)         │
                         │   'espn'  → EspnDataProvider (later)         │
                         │   'paid'  → PaidDataProvider (later)         │
                         └───────────────┬─────────────────────────────┘
                                         │ implements
                         ┌───────────────▼─────────────────────────────┐
                         │            DataProvider (lib/data/provider)  │
                         │  liveScores · fixtures · odds · playerStats  │
                         │  playerProps · injuries · standings          │
                         └───────────────┬─────────────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
      sources/stub (in-mem)     sources/espn (free)        sources/paid (TBD)
      realistic shapes, 0 calls  scraper/REST client       REST client + keys
```

**Flow**: UI → cached accessor (`use cache` + profile) → `getDataProvider()` →
concrete `DataProvider` → source module. The only external dependency lives in
`sources/*`; everything else is source-agnostic.

---

## 3. Data layer abstraction (the seam)

`DataProvider` is the single contract the UI depends on. It is composed of
narrow sub-provider interfaces that expose **only the methods the UI needs**,
not every field a source returns. Full definitions: `lib/data/provider.ts`.

```ts
export interface DataProvider {
  readonly name: string;
  readonly liveScores: LiveScoreProvider;
  readonly fixtures: FixturesProvider;
  readonly odds: OddsProvider;
  readonly playerStats: PlayerStatsProvider;
  readonly playerProps: PlayerPropsProvider;
  readonly injuries: InjuriesProvider;
  readonly standings: StandingsProvider;
}
```

### 3.1 `LiveScoreProvider`
UI needs:
- `getLiveMatches(filter?: { sport?: Sport }): Promise<Match[]>`
- `getMatch(matchId): Promise<Match | null>`

### 3.2 `FixturesProvider`
UI needs:
- `getFixtures({ sport?, from, to, league? }): Promise<Match[]>`
- `getUpcoming({ sport?, limit? }): Promise<Match[]>`

### 3.3 `OddsProvider`
UI needs:
- `getOdds({ matchId, market? }): Promise<Odds[]>`
- `getMatchOddsSummary(matchId): Promise<OddsSummary>`

### 3.4 `PlayerStatsProvider`
UI needs:
- `getPlayer(playerId): Promise<Player | null>`
- `getSeasonStats(playerId, season): Promise<PlayerSeasonStats | null>`
- `getPlayerForm(playerId, season): Promise<PlayerForm | null>`
- `getTeamRoster(teamId): Promise<Player[]>`

### 3.5 `PlayerPropsProvider`
UI needs:
- `getPlayerProps({ matchId, playerId?, type? }): Promise<PlayerProp[]>`

### 3.6 `InjuriesProvider`
UI needs:
- `getInjuries({ sport?, teamId? }): Promise<InjuryReport[]>`

### 3.7 `StandingsProvider`
UI needs:
- `getStandings({ sport, season, conference? }): Promise<Standings>`

> **Why narrow?** A new source (paid feed) only has to implement what the product
> actually renders. Extra source fields are mapped down inside `sources/*` and
> never leak into the UI or shared types.

---

## 4. Routing map (six pillars)

| Pillar            | Route            | Reads from                              | Notes |
| ----------------- | ---------------- | --------------------------------------- | ----- |
| Live Centre       | `/live`          | `getLiveMatches`                        | Streams live; `loading.tsx` + `error.tsx` |
| Upcoming + Odds   | `/upcoming`      | `getUpcoming`, `getMatchOddsSummary`    | Fixtures + market lines |
| Player Props      | `/props`         | `getPlayerProps`                        | Prop lines by match |
| Player Form       | `/players`       | `getPlayerForm`, `getPlayerSeasonStats` | Game log + rolling avgs |
| Intel             | `/intel`         | `getInjuries`, `getStandings`           | Injuries + standings |
| Filters           | `/filters`       | local state only (seats controls)       | Designer-owned controls |

All six are server components reading through cached accessors. The home `/`
links to each pillar.

---

## 5. State & data-fetching strategy

- **Server Components first.** Every pillar page is an async RSC that awaits
  cached accessors. No client-side data fetching for initial render.
- **Next 16 Cache Components (PPR) enabled** (`cacheComponents: true` in
  `next.config.ts`). Static shell ships instantly; dynamic data streams behind
  `<Suspense>`.
- **Client components only where required** for interactivity (filters, future
  live tickers). They receive data as props from the server; they do not call
  sources directly.
- **Streaming**: live reads wrap in `<Suspense>` (`app/live/loading.tsx`) so the
  shell paints immediately and scores stream in.
- **Error boundaries**: `app/live/error.tsx` (and per-route as needed) catch
  provider failures with a retry affordance.

---

## 6. Caching strategy (per data type)

Profiles are defined in `next.config.ts` under `cacheLife`. Each accessor sets
its profile via `cacheLife(name)` and a `cacheTag` for targeted invalidation
(`revalidateTag`).

| Data type        | Profile    | stale | revalidate | expire | Rationale |
| ---------------- | ---------- | ----- | ---------- | ------ | --------- |
| Live scores      | `live`     | 20s   | 10s        | 600s   | Real-time; streamed, not prerendered |
| Fixtures + odds  | `prematch` | 300s  | 300s       | 3600s  | Stable within a session |
| Player form/stats| `form`     | 3600s | 3600s      | 86400s | Slow-moving, hourly recompute |
| Injuries + stand | `intel`    | 300s  | 900s       | 21600s| Updated a few times/day |

- `live` is excluded from prerender (too fresh) and streams at request time.
- Use `revalidateTag("live-matches")` etc. from a route handler / action when a
  source pushes an update.

---

## 7. Error / loading / empty-state policy

- **Loading**: route-level `loading.tsx` + shared `LoadingState` (skeleton +
  pulse). Meaningful: shows the pillar label, not a spinner alone.
- **Empty**: `EmptyState` — explicit "No data available" for no live matches,
  no fixtures, etc. Never a blank screen.
- **Error**: `error.tsx` per route, `role="alert"`, with a **Retry** button
  (`reset()`). Provider failures are contained; one broken domain doesn't take
  down the app.
- **Stale-while-revalidate**: users see cached content instantly; fresh data
  replaces it in the background.

---

## 8. Performance budget

| Metric | Target | Notes |
| ------ | ------ | ----- |
| LCP    | ≤ 2.5s  | Static shell + streamed live |
| CLS    | ≤ 0.1   | Reserve space for score rows / tables |
| INP    | ≤ 200ms | Minimal client JS; RSC-heavy |

- Mobile-first; terminal aesthetic implies dense, monospace tables.
- Keep client bundle small: no data-fetching libs on initial render.
- Images (logos/headshots) lazy-loaded with `next/image`.

---

## 9. Accessibility baseline (WCAG 2.1 AA)

- Semantic landmarks (`nav`, `main`, `header`, `footer`).
- All interactive elements keyboard-operable; visible focus rings.
- `aria-live` on loading/error regions; `role="alert"` on errors.
- Color contrast ≥ 4.5:1 on the dark base (designer tokens must comply).
- Tables for score/stat grids with proper `th`/`caption`.
- Respect `prefers-reduced-motion` (pulse animations gated).

---

## 10. Project structure

```
app/                     Routes (6 pillars) + layout.tsx + loading/error
  live/ upcoming/ props/ players/ intel/ filters/
  layout.tsx             Root layout (Nav + footer)
  page.tsx               Home (links to pillars)
components/design/       Neutral shell primitives (Nav, Card, PageHeader, States)
features/                Feature-scoped components (live-centre/MatchRow, ...)
lib/
  config.ts              Product constants (sports, nav, cache profiles, perf)
  types/domain.ts        Shared domain types (UI renders against these)
  data/
    provider.ts          DataProvider + sub-provider interfaces (the seam)
    index.ts             getDataProvider() — THE swap point
    accessors.ts         Cached server-side accessors (cacheLife profiles)
    sources/stub/        StubDataProvider + reference teams/players
docs/                    ARCHITECTURE.md · DESIGN_HANDOFF.md
```

---

## 11. Acceptance criteria (this ticket)

- [x] Repo scaffolded: Next 16 + TS strict + Tailwind v4, ESLint + Prettier.
- [x] `package.json` scripts: dev, build, start, lint, typecheck, test, format.
- [x] `DataProvider` seam defined; `StubDataProvider` implements every interface.
- [x] `/live` renders stubbed live scores (seam proven end-to-end).
- [x] `docs/ARCHITECTURE.md` + `docs/DESIGN_HANDOFF.md` written.
- [x] Vitest smoke test guards the seam contract.
- [ ] GitHub repo created, branch protection on `main`, CI green on hello-world PR.
- [ ] Vercel preview deploy per PR (coordinated with @devops).
- [ ] `.env.example` present; no real secrets committed.
