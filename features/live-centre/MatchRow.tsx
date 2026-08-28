import type { Match } from "@/lib/types/domain";

/** Score row for a match. Renders either live or scheduled state. */
export function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === "live" || match.status === "halftime";
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium">
          {match.awayTeam.abbr}{" "}
          <span className="text-muted">{match.awayScore.total}</span>
        </div>
        <div className="text-sm font-medium">
          {match.homeTeam.abbr}{" "}
          <span className="text-muted">{match.homeScore.total}</span>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`font-mono text-xs uppercase ${
            isLive ? "text-accent" : "text-muted"
          }`}
        >
          {isLive ? `LIVE · ${match.clock ?? ""}` : match.status}
        </span>
        {match.venue ? (
          <div className="text-xs text-muted">{match.venue}</div>
        ) : null}
      </div>
    </div>
  );
}
