export function BookingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-28 rounded-card bg-lp-surface" />
      <div className="space-y-3">
        <div className="h-10 rounded-card bg-lp-surface" />
        <div className="h-10 rounded-card bg-lp-surface" />
        <div className="h-10 rounded-card bg-lp-surface" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-1/3 rounded bg-lp-surface" />
        <div className="flex gap-2">
          <div className="h-10 w-28 rounded-card bg-lp-surface" />
          <div className="h-10 w-28 rounded-card bg-lp-surface" />
          <div className="h-10 w-28 rounded-card bg-lp-surface" />
        </div>
      </div>
    </div>
  );
}
