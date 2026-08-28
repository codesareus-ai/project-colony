export function PageHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <header className="mb-6 border-b border-border pb-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
        {meta ? (
          <span className="font-mono text-xs text-muted">{meta}</span>
        ) : null}
      </div>
    </header>
  );
}

/** Neutral card primitive. Designer replaces the class set. */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
      {children}
    </div>
  );
}
