import Link from "next/link";
import { NAV_PILLARS } from "@/lib/config";

export default function Home() {
  return (
    <section>
      <div className="border-b border-border pb-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight">
          COLONY<span className="text-accent">_</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          AFL + NBA sports data &amp; betting intelligence. Premium, fast,
          mobile-first. No bet placement. No guarantees.
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_PILLARS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
          >
            <span className="font-mono text-sm">{p.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
