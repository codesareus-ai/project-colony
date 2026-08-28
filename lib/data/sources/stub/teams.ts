/**
 * Stub reference data: teams + players for AFL and NBA v1 scope.
 * Pure constants — used by StubDataProvider. No logic here.
 */
import type { Player, Team } from "@/lib/types/domain";

export const STUB_TEAMS: Team[] = [
  // AFL
  { id: "afl-carlton", sport: "AFL", name: "Carlton", shortName: "Blues", abbr: "CAR", primaryColor: "#0b3d91", record: "12-6" },
  { id: "afl-collingwood", sport: "AFL", name: "Collingwood", shortName: "Magpies", abbr: "COL", primaryColor: "#1d4e9c", record: "13-5" },
  { id: "afl-geelong", sport: "AFL", name: "Geelong", shortName: "Cats", abbr: "GEE", primaryColor: "#1c4c9c", record: "11-7" },
  { id: "afl-brisbane", sport: "AFL", name: "Brisbane Lions", shortName: "Lions", abbr: "BRI", primaryColor: "#a5002f", record: "14-4" },
  // NBA
  { id: "nba-lakers", sport: "NBA", name: "Los Angeles Lakers", shortName: "Lakers", abbr: "LAL", primaryColor: "#552583", record: "38-22" },
  { id: "nba-celtics", sport: "NBA", name: "Boston Celtics", shortName: "Celtics", abbr: "BOS", primaryColor: "#007a33", record: "44-16" },
  { id: "nba-nuggets", sport: "NBA", name: "Denver Nuggets", shortName: "Nuggets", abbr: "DEN", primaryColor: "#0e2240", record: "41-19" },
  { id: "nba-thunder", sport: "NBA", name: "Oklahoma City Thunder", shortName: "Thunder", abbr: "OKC", primaryColor: "#007ac1", record: "47-12" },
];

export const STUB_PLAYERS: Player[] = [
  { id: "p-dac", name: "Daicos", teamId: "afl-collingwood", sport: "AFL", position: "MID", number: 35 },
  { id: "p-neale", name: "Neale", teamId: "afl-brisbane", sport: "AFL", position: "MID", number: 9 },
  { id: "p-cripps", name: "Cripps", teamId: "afl-carlton", sport: "AFL", position: "MID", number: 9 },
  { id: "p-jokic", name: "Nikola Jokić", teamId: "nba-nuggets", sport: "NBA", position: "C", number: 15 },
  { id: "p-tatum", name: "Jayson Tatum", teamId: "nba-celtics", sport: "NBA", position: "SF", number: 0 },
  { id: "p-lebron", name: "LeBron James", teamId: "nba-lakers", sport: "NBA", position: "PF", number: 23 },
];

export function teamById(id: string): Team | undefined {
  return STUB_TEAMS.find((t) => t.id === id);
}
