/**
 * Cached data accessors.
 *
 * Every accessor is a cached async function using the Next 16 `use cache`
 * directive + a `cacheLife` profile. This is where the per-data-type freshness
 * policy from docs/ARCHITECTURE.md is enforced. Swap the provider behind
 * getDataProvider() and these signatures stay identical.
 *
 * Profiles (defined in next.config.ts):
 *   live     -> live scores / in-game
 *   prematch -> fixtures + odds
 *   form     -> player form / season stats
 *   intel    -> injuries + standings
 */
import { cacheLife, cacheTag } from "next/cache";
import { getDataProvider } from "./index";
import type {
  InjuryReport,
  Match,
  MatchId,
  OddsSummary,
  Player,
  PlayerForm,
  PlayerId,
  PlayerProp,
  PlayerSeasonStats,
  PropType,
  Sport,
  Standings,
  TeamId,
} from "@/lib/types/domain";

export async function getLiveMatches(sport?: Sport): Promise<Match[]> {
  "use cache";
  cacheLife("live");
  cacheTag("live-matches");
  return getDataProvider().liveScores.getLiveMatches(
    sport ? { sport } : undefined,
  );
}

export async function getMatch(matchId: MatchId): Promise<Match | null> {
  "use cache";
  cacheLife("live");
  cacheTag(`match:${matchId}`);
  return getDataProvider().liveScores.getMatch(matchId);
}

export async function getUpcoming(
  sport?: Sport,
  limit = 10,
): Promise<Match[]> {
  "use cache";
  cacheLife("prematch");
  cacheTag("upcoming");
  return getDataProvider().fixtures.getUpcoming({ sport, limit });
}

export async function getMatchOdds(matchId: MatchId): Promise<OddsSummary> {
  "use cache";
  cacheLife("prematch");
  cacheTag(`odds:${matchId}`);
  return getDataProvider().odds.getMatchOddsSummary(matchId);
}

export async function getPlayer(
  playerId: PlayerId,
): Promise<Player | null> {
  "use cache";
  cacheLife("form");
  cacheTag(`player:${playerId}`);
  return getDataProvider().playerStats.getPlayer(playerId);
}

export async function getPlayerSeasonStats(
  playerId: PlayerId,
  season: string,
): Promise<PlayerSeasonStats | null> {
  "use cache";
  cacheLife("form");
  cacheTag(`stats:${playerId}`);
  return getDataProvider().playerStats.getSeasonStats(playerId, season);
}

export async function getPlayerForm(
  playerId: PlayerId,
  season: string,
): Promise<PlayerForm | null> {
  "use cache";
  cacheLife("form");
  cacheTag(`form:${playerId}`);
  return getDataProvider().playerStats.getPlayerForm(playerId, season);
}

export async function getPlayerProps(
  matchId: MatchId,
  type?: PropType,
): Promise<PlayerProp[]> {
  "use cache";
  cacheLife("prematch");
  cacheTag(`props:${matchId}`);
  return getDataProvider().playerProps.getPlayerProps({ matchId, type });
}

export async function getInjuries(
  sport?: Sport,
  teamId?: TeamId,
): Promise<InjuryReport[]> {
  "use cache";
  cacheLife("intel");
  cacheTag("injuries");
  return getDataProvider().injuries.getInjuries({ sport, teamId });
}

export async function getStandings(
  sport: Sport,
  season: string,
): Promise<Standings> {
  "use cache";
  cacheLife("intel");
  cacheTag(`standings:${sport}`);
  return getDataProvider().standings.getStandings({ sport, season });
}
