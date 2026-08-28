import { getLiveMatches } from "@/lib/data/accessors";
import { Card } from "@/components/design/PageHeader";
import { MatchRow } from "@/features/live-centre/MatchRow";
import { PageHeader } from "@/components/design/PageHeader";

/**
 * Live Centre — DEMO route that proves the data seam end-to-end.
 * Reads live scores through the cached accessor -> StubDataProvider today,
 * a real source tomorrow, with no change here.
 */
export default async function LivePage() {
  const matches = await getLiveMatches();

  return (
    <section>
      <PageHeader
        title="Live Centre"
        subtitle="Real-time scores across AFL + NBA."
        meta={`${matches.length} live`}
      />
      {matches.length === 0 ? (
        <div className="border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
          No live matches right now.
        </div>
      ) : (
        <div className="grid gap-3">
          {matches.map((m) => (
            <Card key={m.id}>
              <MatchRow match={m} />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
