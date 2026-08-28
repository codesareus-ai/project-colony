/**
 * Data layer entry point.
 *
 * The ENTIRE UI imports `getDataProvider()` from here and nothing else. To swap
 * free sources for paid ones later, create lib/data/sources/<provider>/ and
 * return it from getDataProvider() — that is the only change required. No screen
 * imports a concrete provider.
 */
import type { DataProvider } from "./provider";
import { stubDataProvider } from "./sources/stub/StubDataProvider";

let activeProvider: DataProvider | null = null;

/**
 * Returns the active data provider. Cached for the lifetime of the server
 * process. Determined by COLONY_DATA_SOURCE (default 'stub').
 */
export function getDataProvider(): DataProvider {
  if (activeProvider) return activeProvider;
  const source = process.env.COLONY_DATA_SOURCE ?? "stub";
  switch (source) {
    case "stub":
      activeProvider = stubDataProvider;
      break;
    // case "espn": activeProvider = espnDataProvider; break;  // added later
    default:
      activeProvider = stubDataProvider;
  }
  return activeProvider;
}

export type { DataProvider } from "./provider";
export * from "./provider";
