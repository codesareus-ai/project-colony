/**
 * The seam.
 *
 * `DataProvider` is the ONLY contract the UI depends on. Every screen reads
 * through `getDataProvider()` (see ./index.ts). Today that returns a
 * `StubDataProvider`. When strategist picks real sources, we add one more
 * module under lib/data/sources/* and flip a switch in ./index.ts — no UI
 * changes, no interface churn.
 *
 * The interfaces below list the METHODS THE UI NEEDS, not every field a source
 * exposes. Keep them narrow so a new source only has to satisfy what the
 * product actually renders.
 */

import type {
  Sport,
  Match,
  MatchId,
  TeamId,
  Player,
  PlayerId,
  PlayerSeasonStats,
  PlayerForm,
  PlayerProp,
  PropType,
  InjuryReport,
  Standings,
  Odds,
  OddsSummary,
  MarketKey,
} from "@/lib/types/domain";

export interface LiveScoreProvider {
  /** Matches currently in progress. Empty array when none are live. */
  getLiveMatches(filter?: { sport?: Sport }): Promise<Match[]>;
  /** Single match detail (live or otherwise); null if unknown. */
  getMatch(matchId: MatchId): Promise<Match | null>;
}

export interface FixturesProvider {
  /** Fixtures within an inclusive ISO date window. */
  getFixtures(opts: {
    sport?: Sport;
    from: string;
    to: string;
    league?: string;
  }): Promise<Match[]>;
  /** Next N scheduled matches (across leagues if sport omitted). */
  getUpcoming(opts: { sport?: Sport; limit?: number }): Promise<Match[]>;
}

export interface OddsProvider {
  getOdds(opts: { matchId: MatchId; market?: MarketKey }): Promise<Odds[]>;
  getMatchOddsSummary(matchId: MatchId): Promise<OddsSummary>;
}

export interface PlayerStatsProvider {
  getPlayer(playerId: PlayerId): Promise<Player | null>;
  getSeasonStats(
    playerId: PlayerId,
    season: string,
  ): Promise<PlayerSeasonStats | null>;
  getPlayerForm(
    playerId: PlayerId,
    season: string,
  ): Promise<PlayerForm | null>;
  getTeamRoster(teamId: TeamId): Promise<Player[]>;
}

export interface PlayerPropsProvider {
  getPlayerProps(opts: {
    matchId: MatchId;
    playerId?: PlayerId;
    type?: PropType;
  }): Promise<PlayerProp[]>;
}

export interface InjuriesProvider {
  getInjuries(opts?: {
    sport?: Sport;
    teamId?: TeamId;
  }): Promise<InjuryReport[]>;
}

export interface StandingsProvider {
  getStandings(opts: {
    sport: Sport;
    season: string;
    conference?: string;
  }): Promise<Standings>;
}

/**
 * The aggregate provider. The UI holds one of these and reaches into the
 * sub-providers it needs. A real implementation wires each sub-provider to its
 * own source if different feeds are used per domain.
 */
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
