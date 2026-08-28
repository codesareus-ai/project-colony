/**
 * StubDataProvider — in-memory implementation of every DataProvider interface.
 *
 * Returns realistic shapes so the UI can be built and demoed TODAY against the
 * real contract, with zero external dependencies. It is the ONLY file that
 * needs replacing when real sources come online (see lib/data/index.ts).
 *
 * Determinism note: values are static per build, so 'live' matches render the
 * same content on every request within a server instance. For a true live demo,
 * the live seams still stream behind <Suspense> — the stub just serves a
 * fixed snapshot.
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
import type {
  DataProvider,
  FixturesProvider,
  InjuriesProvider,
  LiveScoreProvider,
  OddsProvider,
  PlayerPropsProvider,
  PlayerStatsProvider,
  StandingsProvider,
} from "@/lib/data/provider";
import { STUB_PLAYERS, STUB_TEAMS, teamById } from "./teams";

function isoOffsetMinutes(min: number): string {
  return new Date(Date.now() + min * 60_000).toISOString();
}

// ---- Reference data ---------------------------------------------------------

const LIVE_MATCHES: Match[] = [
  {
    id: "m-afl-1",
    sport: "AFL",
    league: "AFL",
    status: "live",
    startTime: isoOffsetMinutes(-35),
    homeTeam: teamById("afl-collingwood")!,
    awayTeam: teamById("afl-brisbane")!,
    homeScore: { periods: [3, 2, 4, 0], total: 9 },
    awayScore: { periods: [2, 3, 3, 0], total: 8 },
    venue: "MCG",
    round: "Round 18",
    clock: "Q3 14:20",
    broadcast: "Fox Footy",
  },
  {
    id: "m-nba-1",
    sport: "NBA",
    league: "NBA",
    status: "live",
    startTime: isoOffsetMinutes(-50),
    homeTeam: teamById("nba-celtics")!,
    awayTeam: teamById("nba-lakers")!,
    homeScore: { periods: [28, 31, 26, 0], total: 85 },
    awayScore: { periods: [24, 30, 29, 0], total: 83 },
    venue: "TD Garden",
    clock: "Q3 6:11",
    broadcast: "ESPN",
  },
];

const UPCOMING_MATCHES: Match[] = [
  {
    id: "m-afl-2",
    sport: "AFL",
    league: "AFL",
    status: "scheduled",
    startTime: isoOffsetMinutes(180),
    homeTeam: teamById("afl-geelong")!,
    awayTeam: teamById("afl-carlton")!,
    homeScore: { periods: [0, 0, 0, 0], total: 0 },
    awayScore: { periods: [0, 0, 0, 0], total: 0 },
    venue: "GMHBA Stadium",
    round: "Round 18",
  },
  {
    id: "m-nba-2",
    sport: "NBA",
    league: "NBA",
    status: "scheduled",
    startTime: isoOffsetMinutes(600),
    homeTeam: teamById("nba-thunder")!,
    awayTeam: teamById("nba-nuggets")!,
    homeScore: { periods: [0, 0, 0, 0], total: 0 },
    awayScore: { periods: [0, 0, 0, 0], total: 0 },
    venue: "Paycom Center",
  },
];

// ---- Sub-providers ----------------------------------------------------------

class StubLiveScores implements LiveScoreProvider {
  async getLiveMatches(filter?: { sport?: Sport }): Promise<Match[]> {
    const live = LIVE_MATCHES;
    return filter?.sport ? live.filter((m) => m.sport === filter.sport) : live;
  }
  async getMatch(matchId: MatchId): Promise<Match | null> {
    return (
      [...LIVE_MATCHES, ...UPCOMING_MATCHES].find((m) => m.id === matchId) ??
      null
    );
  }
}

class StubFixtures implements FixturesProvider {
  async getFixtures(opts: {
    sport?: Sport;
    from: string;
    to: string;
    league?: string;
  }): Promise<Match[]> {
    const from = Date.parse(opts.from);
    const to = Date.parse(opts.to);
    return UPCOMING_MATCHES.filter((m) => {
      const t = Date.parse(m.startTime);
      if (t < from || t > to) return false;
      if (opts.sport && m.sport !== opts.sport) return false;
      if (opts.league && m.league !== opts.league) return false;
      return true;
    });
  }
  async getUpcoming(opts: { sport?: Sport; limit?: number }): Promise<Match[]> {
    const limit = opts.limit ?? 10;
    const list = opts.sport
      ? UPCOMING_MATCHES.filter((m) => m.sport === opts.sport)
      : UPCOMING_MATCHES;
    return list.slice(0, limit);
  }
}

class StubOdds implements OddsProvider {
  async getOdds(opts: {
    matchId: MatchId;
    market?: MarketKey;
  }): Promise<Odds[]> {
    return [
      {
        matchId: opts.matchId,
        market: opts.market ?? "moneyline",
        bookmaker: "ExampleBook",
        updatedAt: new Date().toISOString(),
        home: { price: 1.75 },
        away: { price: 2.1 },
        lineMovement: [
          { timestamp: isoOffsetMinutes(-120), homePrice: 1.8, awayPrice: 2.0 },
          { timestamp: isoOffsetMinutes(-30), homePrice: 1.75, awayPrice: 2.1 },
        ],
      },
    ];
  }
  async getMatchOddsSummary(matchId: MatchId): Promise<OddsSummary> {
    return {
      matchId,
      moneyline: { home: 1.75, away: 2.1 },
      spread: { home: 1.9, homePoint: -3.5, away: 1.9, awayPoint: 3.5 },
      total: { over: 1.85, under: 1.95, line: 184.5 },
      updatedAt: new Date().toISOString(),
    };
  }
}

class StubPlayerStats implements PlayerStatsProvider {
  async getPlayer(playerId: PlayerId): Promise<Player | null> {
    return STUB_PLAYERS.find((p) => p.id === playerId) ?? null;
  }
  async getSeasonStats(
    playerId: PlayerId,
    season: string,
  ): Promise<PlayerSeasonStats | null> {
    const player = STUB_PLAYERS.find((p) => p.id === playerId);
    if (!player) return null;
    const metrics: Record<string, number> =
      player.sport === "AFL"
        ? { goals: 18, disposals: 612, marks: 142, tackles: 88 }
        : { points: 26.4, rebounds: 11.2, assists: 8.1 };
    return { playerId, season, teamId: player.teamId, games: 22, metrics };
  }
  async getPlayerForm(
    playerId: PlayerId,
    season: string,
  ): Promise<PlayerForm | null> {
    const player = STUB_PLAYERS.find((p) => p.id === playerId);
    if (!player) return null;
    const lastGames =
      player.sport === "AFL"
        ? [
            { matchId: "m-afl-1", date: isoOffsetMinutes(-200), opponent: "BRI", statLine: { goals: 2, disposals: 31 } },
            { matchId: "m-afl-2", date: isoOffsetMinutes(-600), opponent: "GEE", statLine: { goals: 1, disposals: 28 } },
          ]
        : [
            { matchId: "m-nba-1", date: isoOffsetMinutes(-200), opponent: "LAL", statLine: { points: 31, rebounds: 12 } },
            { matchId: "m-nba-2", date: isoOffsetMinutes(-600), opponent: "DEN", statLine: { points: 25, rebounds: 9 } },
          ];
    const averages: Record<string, number> =
      player.sport === "AFL"
        ? { goals: 1.6, disposals: 29.5 }
        : { points: 28.0, rebounds: 10.5 };
    return { playerId, season, lastGames, averages, trend: "up" };
  }
  async getTeamRoster(teamId: TeamId): Promise<Player[]> {
    return STUB_PLAYERS.filter((p) => p.teamId === teamId);
  }
}

class StubPlayerProps implements PlayerPropsProvider {
  async getPlayerProps(opts: {
    matchId: MatchId;
    playerId?: PlayerId;
    type?: PropType;
  }): Promise<PlayerProp[]> {
    return STUB_PLAYERS.slice(0, 3).map((p) => ({
      playerId: p.id,
      playerName: p.name,
      matchId: opts.matchId,
      type: (opts.type ?? (p.sport === "AFL" ? "disposals" : "points")) as PropType,
      line: p.sport === "AFL" ? 28.5 : 26.5,
      overPrice: 1.9,
      underPrice: 1.9,
      sportsbook: "ExampleBook",
      updatedAt: new Date().toISOString(),
    }));
  }
}

class StubInjuries implements InjuriesProvider {
  async getInjuries(opts?: {
    sport?: Sport;
    teamId?: TeamId;
  }): Promise<InjuryReport[]> {
    const all: InjuryReport[] = [
      {
        playerId: "p-lebron",
        playerName: "LeBron James",
        teamId: "nba-lakers",
        status: "questionable",
        injury: "Left ankle soreness",
        note: "Gameday decision",
        updatedAt: isoOffsetMinutes(-90),
      },
      {
        playerId: "p-neale",
        playerName: "Neale",
        teamId: "afl-brisbane",
        status: "out",
        injury: "Hamstring",
        updatedAt: isoOffsetMinutes(-300),
      },
    ];
    return all.filter((r) => {
      const sport = opts?.sport;
      const teamId = opts?.teamId;
      if (sport) {
        const t = teamById(r.teamId);
        if (t?.sport !== sport) return false;
      }
      if (teamId && r.teamId !== teamId) return false;
      return true;
    });
  }
}

class StubStandings implements StandingsProvider {
  async getStandings(opts: {
    sport: Sport;
    season: string;
    conference?: string;
  }): Promise<Standings> {
    const teams = STUB_TEAMS.filter((t) => t.sport === opts.sport);
    const entries = teams.map((t, i) => ({
      teamId: t.id,
      rank: i + 1,
      played: 18,
      wins: 14 - i,
      losses: 4 + i,
      points: (14 - i) * 4,
      winPct: Number(((14 - i) / 18).toFixed(3)),
      streak: i % 2 === 0 ? "W3" : "L1",
    }));
    return {
      sport: opts.sport,
      season: opts.season,
      conference: opts.conference,
      entries,
    };
  }
}

/** The aggregate stub provider handed to the UI. */
export class StubDataProvider implements DataProvider {
  readonly name = "stub";
  readonly liveScores = new StubLiveScores();
  readonly fixtures = new StubFixtures();
  readonly odds = new StubOdds();
  readonly playerStats = new StubPlayerStats();
  readonly playerProps = new StubPlayerProps();
  readonly injuries = new StubInjuries();
  readonly standings = new StubStandings();
}

/** Singleton — swap this construction for a real provider later. */
export const stubDataProvider = new StubDataProvider();
