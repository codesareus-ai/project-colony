import { describe, expect, it } from "vitest";
import { stubDataProvider } from "@/lib/data/sources/stub/StubDataProvider";
import type { DataProvider } from "@/lib/data/provider";

/**
 * Smoketest that the stub provider satisfies the DataProvider contract and
 * returns documented shapes. This is the regression guard for the seam: if a
 * real provider ever breaks these promises, CI fails before the UI does.
 */
describe("StubDataProvider", () => {
  it("implements the DataProvider interface", () => {
    expect(stubDataProvider.name).toBe("stub");
    const required = [
      "liveScores",
      "fixtures",
      "odds",
      "playerStats",
      "playerProps",
      "injuries",
      "standings",
    ] as const;
    for (const key of required) {
      expect((stubDataProvider as DataProvider)[key]).toBeDefined();
    }
  });

  it("returns live matches with the documented shape", async () => {
    const matches = await stubDataProvider.liveScores.getLiveMatches();
    expect(matches.length).toBeGreaterThan(0);
    const m = matches[0]!;
    expect(m).toHaveProperty("homeTeam");
    expect(m).toHaveProperty("awayTeam");
    expect(typeof m.homeScore.total).toBe("number");
    expect(Array.isArray(m.homeScore.periods)).toBe(true);
  });

  it("returns odds summary, injuries, and standings", async () => {
    const odds = await stubDataProvider.odds.getMatchOddsSummary("m-nba-2");
    expect(odds).toHaveProperty("moneyline");
    const injuries = await stubDataProvider.injuries.getInjuries();
    expect(injuries.length).toBeGreaterThan(0);
    const standings = await stubDataProvider.standings.getStandings({
      sport: "NBA",
      season: "2025",
    });
    expect(standings.entries.length).toBeGreaterThan(0);
  });
});
