import { SPORTS } from "@/lib/config";
import { PageHeader } from "@/components/design/PageHeader";

/**
 * Filters — neutral placeholder. The filtering UI (league, team, market,
 * date range) is specified by the design system; this page seats the controls.
 */
export default function FiltersPage() {
  return (
    <section>
      <PageHeader title="Filters" subtitle="Slice the data by league, team, market." />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted">
          League
          <ul className="mt-2 flex gap-2">
            {SPORTS.map((s) => (
              <li key={s} className="rounded bg-background px-2 py-1">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted">
          Controls seat here (designer-owned).
        </div>
      </div>
    </section>
  );
}
