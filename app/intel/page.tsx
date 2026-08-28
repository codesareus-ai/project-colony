import { getInjuries, getStandings } from "@/lib/data/accessors";
import { Card, PageHeader } from "@/components/design/PageHeader";

export default async function IntelPage() {
  const injuries = await getInjuries();
  const standings = await getStandings("NBA", "2025");
  return (
    <section>
      <PageHeader title="Intel" subtitle="Injuries and standings across leagues." />
      <h2 className="mb-2 font-mono text-sm text-muted">Injuries</h2>
      <div className="grid gap-2">
        {injuries.map((r) => (
          <Card key={r.playerId}>
            <div className="flex justify-between text-sm">
              <span>{r.playerName}</span>
              <span className="uppercase text-accent">{r.status}</span>
            </div>
          </Card>
        ))}
      </div>
      <h2 className="mb-2 mt-6 font-mono text-sm text-muted">Standings · NBA</h2>
      <div className="grid gap-2">
        {standings.entries.map((e) => (
          <Card key={e.teamId}>
            <div className="flex justify-between text-sm">
              <span>
                #{e.rank} {e.teamId}
              </span>
              <span className="text-muted">
                {e.wins}-{e.losses}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
