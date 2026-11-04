import Spinner from "./Spinner";

/** Shimmering card used while studio grids load. */
export function StudioCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
      </div>
    </div>
  );
}

export function StudiosGridSkeleton({ count = 6, className }) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className || ""}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Full-page skeleton used by loading.js route files. */
export default function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="skeleton h-10 w-64" />
      <div className="skeleton mt-4 h-5 w-96 max-w-full" />
      <StudiosGridSkeleton count={6} className="mt-10" />
      <div className="mt-10 flex items-center justify-center gap-3 text-muted">
        <Spinner size={22} />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  );
}
