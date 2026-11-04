import PageSkeleton from "@/components/ui/Skeleton";

/** Skeleton while a studio details page loads. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="skeleton h-5 w-40" />
      <div className="skeleton mt-6 h-96 w-full rounded-3xl" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="skeleton h-9 w-2/3" />
          <div className="skeleton h-28 w-full" />
          <div className="skeleton h-44 w-full" />
        </div>
        <div className="skeleton h-72 w-full" />
      </div>
      <span className="sr-only">Loading studio details…</span>
    </div>
  );
}
