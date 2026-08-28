# Colony

AFL + NBA sports data & betting intelligence web app. No bet placement. No guarantees.

> v1 scope: **AFL + NBA only**. Premium, fast, mobile-first, dark-mode-first, terminal aesthetic.

## Stack

- **Next.js 16** (App Router) + **TypeScript** (strict) + **Tailwind CSS v4**
- **Cache Components / PPR** for per-data-type caching (see `next.config.ts`)
- **Vitest** + Testing Library for unit tests
- **ESLint** (next config) + **Prettier**

## Getting started

```bash
nvm use                 # Node 24 (see .nvmrc)
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

## Scripts

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Start the dev server                  |
| `npm run build`  | Production build                      |
| `npm run start`  | Serve the production build            |
| `npm run lint`   | ESLint                                |
| `npm run typecheck` | `tsc --noEmit` (strict)            |
| `npm run test`   | Vitest (unit)                         |
| `npm run format` | Prettier write                        |

## How the data layer works

The UI never talks to a data source directly. It calls cached accessors in
`lib/data/accessors.ts`, which go through `getDataProvider()` in
`lib/data/index.ts`. Today that returns `StubDataProvider` (in-memory, no
external calls). When real sources are chosen, only `lib/data/index.ts` and a
new `lib/data/sources/<provider>/` module change — no screen is touched.

See **`docs/ARCHITECTURE.md`** for the full design, and
**`docs/DESIGN_HANDOFF.md`** for the design-system contract.

## Project structure

```
app/              Routes (6 product pillars) + layout + loading/error states
components/design Neutral shell primitives (Nav, Card, states) — re-skinned by designer
features/         Feature-scoped components (live-centre, etc.)
lib/
  config.ts       Product constants (sports, nav, cache profiles, perf budget)
  types/domain.ts Shared domain types (the shapes the UI renders against)
  data/
    provider.ts   DataProvider + sub-provider interfaces (the seam)
    index.ts      getDataProvider() — the single swap point
    accessors.ts  Cached server-side accessors (cacheLife profiles)
    sources/stub/ StubDataProvider — realistic in-memory data
docs/             Architecture + design handoff
```

## Compliance

- Server components first; client components only where live updates require it.
- No real secrets in the repo — `.env.local` is gitignored.
- No paid dependencies.

<!-- CI smoke: A-001 hello-world PR to prove pipeline + branch protection. -->
