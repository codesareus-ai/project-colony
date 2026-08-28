import { getPlayerForm, getPlayerSeasonStats } from "@/lib/data/accessors";
import { Card, PageHeader } from "@/components/design/PageHeader";

export default async function PlayersPage() {
  const form = await getPlayerForm("p-jokic", "2025");
  const season = await getPlayerSeasonStats("p-jokic", "2025");
  return (
    <section>
      <PageHeader title="Player Form" subtitle="Recent game logs and rolling averages." />
      <Card>
        <div className="text-sm">
          {form?.playerId ?? "—"} · trend {form?.trend ?? "—"}
        </div>
        {season ? (
          <ul className="mt-3 text-xs text-muted">
            {Object.entries(season.metrics).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
    </section>
  );
}
