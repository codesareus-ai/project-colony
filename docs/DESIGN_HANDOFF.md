# Colony — Design Handoff (for @designer)

> Owner: @architect · Audience: @designer · This is the **structural** contract
> only. Build the visual system (tokens, components, spacing, motion) on top of
> it. The shell already renders with neutral dark/terminal defaults so the app
> is usable today; your job is to make it premium.

---

## 1. Product surface (six pillars)

| Route            | Name             | Primary view                                  |
| ---------------- | ---------------- | --------------------------------------------- |
| `/live`          | Live Centre      | Live score rows, auto-updating                |
| `/upcoming`      | Upcoming + Odds  | Fixture list + odds cells                     |
| `/props`         | Player Props     | Prop cards per player                         |
| `/players`       | Player Form      | Game log table + averages                     |
| `/intel`         | Intel            | Injuries list + standings table               |
| `/filters`       | Filters          | League/team/market controls                   |

Home `/` is a hub linking to the six pillars.

---

## 2. Screens & states the design system must support

For **every** pillar, provide:

- **Live state** — data present, possibly updating (pulse/refresh affordance).
- **Loading state** — skeleton matching the real layout (see `LoadingState`).
- **Error state** — `role="alert"` + Retry (see `app/live/error.tsx`).
- **Empty state** — explicit "No data" (see `EmptyState`), never blank.

Component-level primitives required:

- **Dense table** — score/stat grids (AFL 4-quarter, NBA 4-quarter, standings).
- **Prop card** — player name, line, over/under prices.
- **Odds cell** — moneyline / spread / total; compact, monospace numbers.
- **Line-movement arrow** — ▲ / ▼ indicating price movement over time.
- **Score row** — away @ home with live clock + status badge.
- **Status badge** — `LIVE` (accent), `scheduled`, `finished`, `postponed`.
- **Injury status chip** — `out` / `doubtful` / `questionable` / `probable`.
- **Nav** — sticky top, six pillars, mobile-first (already seated; re-skin).
- **Card** — neutral container `components/design/PageHeader.tsx#Card`.

---

## 3. Data shapes the UI renders against

These are the exact contracts (from `lib/types/domain.ts`). Design components to
these fields — do **not** invent fields.

```ts
// Match — used by Live Centre, Upcoming, Odds
interface Match {
  id: string; sport: "AFL" | "NBA"; league: string;
  status: "scheduled" | "live" | "halftime" | "finished" | "postponed";
  startTime: string;            // ISO
  homeTeam: Team; awayTeam: Team;
  homeScore: ScoreBreakdown; awayScore: ScoreBreakdown; // { periods:number[]; total:number }
  venue?: string; round?: string; clock?: string; broadcast?: string;
}

interface Team { id; sport; name; shortName; abbr; logoUrl?; primaryColor?; record? }

// Odds — compact summary cell
interface OddsSummary {
  matchId; moneyline?: { home; away };
  spread?: { home; homePoint; away; awayPoint };
  total?: { over; under; line }; updatedAt;
}

// Player props
interface PlayerProp {
  playerId; playerName; matchId; type; line; overPrice; underPrice; sportsbook; updatedAt;
}

// Player form
interface PlayerForm {
  playerId; season; lastGames: GameLogEntry[]; averages: Record<string,number>; trend: "up"|"down"|"flat";
}

// Injuries
interface InjuryReport {
  playerId; playerName; teamId; status: "out"|"doubtful"|"questionable"|"probable";
  injury; note?; updatedAt;
}

// Standings
interface Standings { sport; season; conference?; entries: StandingsEntry[] }
interface StandingsEntry {
  teamId; rank; played; wins; losses; draws?; points?; winPct?; streak?;
}
```

> `metrics` / `averages` / `statLine` are `Record<string, number>` — render
> generically (label + value), since the keys differ per sport (AFL: goals,
> disposals; NBA: points, rebounds). Don't hardcode labels.

---

## 4. Visual direction (from brief)

- **Dark-mode-first**, near-black background, high-contrast foreground.
- **Terminal aesthetic**: monospace for numbers/odds/tables, tight density.
- **Mobile-first**: dense tables must work at 360px (horizontal scroll or
  card reflow, your call — but never truncate data silently).
- **Premium**: restrained accent (current token `--accent: #36e27b`), generous
  spacing on desktop, no clutter.

---

## 5. Tokens the shell already defines (override freely)

Defined in `app/globals.css` as CSS vars; expose as Tailwind theme in
`next.config.ts`/CSS:

```
--background #0a0a0b   --foreground #e6e6e6   --muted #8a8a8a
--accent #36e27b       --border #1f1f22      --card #121214
```

Designer: replace these with the full token set (spacing scale, radii, type
scale, motion durations). The shell uses `border-border`, `bg-card`,
`text-muted`, `text-accent` — keep those class names so existing components keep
working after re-skin.

---

## 6. Accessibility the design must preserve

- Contrast ≥ 4.5:1 on the dark base (accent on near-black passes for large
  text; verify small text).
- Focus-visible rings on all interactive elements (nav, retry, filter controls).
- `prefers-reduced-motion`: disable pulse/arrows animations.
- Tables use real `<table>` semantics; odds/score numbers are not images.

---

## 7. Handoff checklist for @designer

- [ ] Token set (color, type, space, radius, motion) replacing shell defaults.
- [ ] Components: dense table, prop card, odds cell, line-movement arrow,
      score row, status badge, injury chip, nav, card, loading/empty/error.
- [ ] Mobile (360px) layouts for all six pillars.
- [ ] a11y pass (contrast, focus, reduced-motion).
- [ ] Re-skin without changing any `components/design` class names or the
      domain types in `lib/types/domain.ts`.
