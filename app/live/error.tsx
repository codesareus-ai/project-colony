"use client";

/**
 * Route-level error boundary for the Live Centre. Catches provider/render
 * failures and shows a recoverable state. Next 16 `error.js` convention.
 */
export default function LiveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-border bg-card p-6 text-sm"
    >
      <p className="font-mono text-accent">Live feed unavailable</p>
      <p className="mt-2 text-muted">{error.message || "Unknown error"}</p>
      <button
        onClick={reset}
        className="mt-4 rounded border border-border px-3 py-1 text-xs hover:border-accent"
      >
        Retry
      </button>
    </div>
  );
}
