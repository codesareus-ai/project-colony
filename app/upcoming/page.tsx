import { getUpcoming } from "@/lib/data/accessors";
import { Card, PageHeader } from "@/components/design/PageHeader";

export default async function UpcomingPage() {
  const matches = await getUpcoming();
  return (
    <section>
      <PageHeader title="Upcoming + Odds" subtitle="Fixtures and market lines." />
      <div className="grid gap-3">
        {matches.map((m) => (
          <Card key={m.id}>
            <div className="flex justify-between text-sm">
              <span>
                {m.awayTeam.abbr} @ {m.homeTeam.abbr}
              </span>
              <span className="text-muted">{m.sport}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
