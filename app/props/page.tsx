import { getPlayerProps } from "@/lib/data/accessors";
import { Card, PageHeader } from "@/components/design/PageHeader";

export default async function PropsPage() {
  const props = await getPlayerProps("m-nba-2");
  return (
    <section>
      <PageHeader title="Player Props" subtitle="Player prop lines by match." />
      <div className="grid gap-3">
        {props.map((p) => (
          <Card key={`${p.playerId}-${p.type}`}>
            <div className="flex justify-between text-sm">
              <span>{p.playerName}</span>
              <span className="font-mono text-accent">
                {p.type} {p.line} o{p.overPrice}/u{p.underPrice}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
