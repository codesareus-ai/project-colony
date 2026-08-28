/**
 * Project Colony — shared domain types.
 *
 * These are the SHAPES THE UI RENDERS AGAINST. They are deliberately decoupled
 * from any data source: a StubDataProvider, a free ESPN scraper, or a paid
 * feed all map onto these types. No `any` here — the whole point is that the
 * UI and the data layer agree on a stable contract.
 *
 * v1 scope: AFL + NBA only. `Sport` is a closed union so the compiler forces
 * every switch to handle both leagues.
 */

export type Sport = "AFL" | "NBA";

export type TeamId = string;
export type MatchId = string;
export type PlayerId = string;

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed";

export type InjuryStatus = "out" | "doubtful" | "questionable" | "probable";

export type MarketKey = "moneyline" | "spread" | "total" | "h2h";

export type PropType =
  | "points"
  | "rebounds"
  | "assists"
  | "goals"
  | "disposals"
  | "goals_assists";

/** A team. `id` is a stable slug owned by Colony, not the source. */
export interface Team {
  id: TeamId;
  sport: Sport;
  name: string;
  shortName: string;
  abbr: string;
  logoUrl?: string;
  primaryColor?: string;
  record?: string;
}

/**
 * Per-period score breakdown. For AFL this is 4 quarters; for NBA 4 quarters.
 * `periods` is the ordered list; `total` is the computed/restated full score.
 */
export interface ScoreBreakdown {
  periods: number[];
  total: number;
}

export interface Match {
  id: MatchId;
  sport: Sport;
  league: string;
  status: MatchStatus;
  startTime: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: ScoreBreakdown;
  awayScore: ScoreBreakdown;
  venue?: string;
  round?: string;
  /** Human clock string for live matches, e.g. "Q3 12:04". */
  clock?: string;
  broadcast?: string;
}

export interface Player {
  id: PlayerId;
  name: string;
  teamId: TeamId;
  sport: Sport;
  position?: string;
  number?: number;
  headshotUrl?: string;
}

/**
 * Season-level stats. Core fields are typed; `metrics` is a typed bag for
 * sport-specific numeric stats (AFL: goals/disposals, NBA: points/rebounds).
 * Kept as Record<string, number> rather than a per-sport union so the UI can
 * render a generic stat table without knowing the league up front.
 */
export interface PlayerSeasonStats {
  playerId: PlayerId;
  season: string;
  teamId: TeamId;
  games: number;
  metrics: Record<string, number>;
}

/** Derived form: recent game log + rolling averages for a player. */
export interface PlayerForm {
  playerId: PlayerId;
  season: string;
  lastGames: GameLogEntry[];
  averages: Record<string, number>;
  trend: "up" | "down" | "flat";
}

export interface GameLogEntry {
  matchId: MatchId;
  date: string;
  opponent: string;
  statLine: Record<string, number>;
}

/** An odds line for one market on one match. */
export interface Odds {
  matchId: MatchId;
  market: MarketKey;
  bookmaker: string;
  updatedAt: string;
  home: OddsValue;
  away: OddsValue;
  lineMovement: LineMovement[];
}

export interface OddsValue {
  price: number;
  /** Spread point or total line, when applicable. */
  point?: number;
}

export interface LineMovement {
  timestamp: string;
  homePrice: number;
  awayPrice: number;
}

/** Compact odds summary the UI can render in a table cell. */
export interface OddsSummary {
  matchId: MatchId;
  moneyline?: { home: number; away: number };
  spread?: { home: number; homePoint: number; away: number; awayPoint: number };
  total?: { over: number; under: number; line: number };
  updatedAt: string;
}

export interface PlayerProp {
  playerId: PlayerId;
  playerName: string;
  matchId: MatchId;
  type: PropType;
  line: number;
  overPrice: number;
  underPrice: number;
  sportsbook: string;
  updatedAt: string;
}

export interface InjuryReport {
  playerId: PlayerId;
  playerName: string;
  teamId: TeamId;
  status: InjuryStatus;
  injury: string;
  note?: string;
  updatedAt: string;
}

export interface StandingsEntry {
  teamId: TeamId;
  rank: number;
  played: number;
  wins: number;
  losses: number;
  draws?: number;
  points?: number;
  pct?: number;
  winPct?: number;
  form?: string;
  streak?: string;
}

export interface Standings {
  sport: Sport;
  season: string;
  conference?: string;
  entries: StandingsEntry[];
}
