/**
 * Shared loading / empty / error states. Neutral placeholders so every pillar
 * renders the same skeleton language. Designer re-skins these.
 */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 border border-border bg-card p-4 text-sm text-muted"
    >
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent" />
      {label}
    </div>
  );
}

export function EmptyState({ label = "No data available." }: { label?: string }) {
  return (
    <div className="border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
      {label}
    </div>
  );
}
