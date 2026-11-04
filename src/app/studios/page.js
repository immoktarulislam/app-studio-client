"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/ui/EmptyState";
import PageSkeleton, { StudiosGridSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { studiosApi, wishlistApi } from "@/lib/api";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function ExploreContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [maxRate, setMaxRate] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ studios: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  // Keep in sync when the category changes via URL (footer / category cards).
  // Adjusting state during render avoids a cascading effect.
  const urlCategory = searchParams.get("category") || "";
  const [lastUrlCategory, setLastUrlCategory] = useState(urlCategory);
  if (urlCategory !== lastUrlCategory) {
    setLastUrlCategory(urlCategory);
    setCategory(urlCategory);
    setPage(1);
  }

  useEffect(() => {
    if (!user) return;
    wishlistApi
      .ids()
      .then((response) => setSavedIds(response.wishlist || []))
      .catch(() => {});
  }, [user]);

  const load = useCallback(async () => {
    try {
      const response = await studiosApi.list({
        search,
        category,
        maxRate,
        sort,
        page,
        limit: 9,
      });
      setData(response);
      setLoadError(null);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, maxRate, sort, page]);

  // Debounced loading while typing / changing filters
  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [load]);

  const retry = () => {
    setLoading(true);
    load();
  };

  const hasFilters = Boolean(search || category || maxRate);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMaxRate("");
    setSort("newest");
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const total = data.pages || 1;
    const from = Math.max(1, page - 2);
    const to = Math.min(total, page + 2);
    const numbers = [];
    for (let i = from; i <= to; i += 1) numbers.push(i);
    return numbers;
  }, [data.pages, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">Explore studios</span>
      <h1 className="section-title mt-2">
        {category ? `${category} spaces` : "Every creative space, one grid"}
      </h1>
      <p className="section-sub">
        {loading
          ? "Checking live availability across the marketplace…"
          : `${data.total} ${data.total === 1 ? "studio" : "studios"} available`}
      </p>

      {/* Filter bar */}
      <div className="card mt-8 flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title or location…"
            aria-label="Search studios"
            className="input pl-10"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="input lg:w-48"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by maximum hourly rate"
            value={maxRate}
            onChange={(event) => {
              setMaxRate(event.target.value);
              setPage(1);
            }}
            className="input lg:w-44"
          >
            <option value="">Any price</option>
            <option value="50">Up to $50/hr</option>
            <option value="100">Up to $100/hr</option>
            <option value="150">Up to $150/hr</option>
            <option value="250">Up to $250/hr</option>
          </select>

          <select
            aria-label="Sort studios"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="input lg:w-48"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="btn btn-ghost btn-sm shrink-0"
          >
            <SlidersHorizontal size={14} /> Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-8">
        {loading ? (
          <StudiosGridSkeleton count={9} />
        ) : loadError ? (
          <EmptyState
            icon={SearchX}
            title="We could not load the studios"
            text={loadError}
            actionLabel="Try again"
            onAction={retry}
          />
        ) : data.studios.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No studios match your search"
            text="Try a different category, raise your price range, or clear the filters to see everything on the marketplace."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.studios.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                  saved={savedIds.includes(studio._id)}
                  onToggleSaved={(response) => setSavedIds(response.wishlist)}
                />
              ))}
            </div>

            {/* Pagination */}
            {(data.pages || 1) > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-2"
                aria-label="Studios pagination"
              >
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="btn btn-ghost btn-sm"
                >
                  Previous
                </button>
                {pageNumbers.map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setPage(number)}
                    aria-current={page === number ? "page" : undefined}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
                      page === number
                        ? "bg-brand text-on-brand"
                        : "border border-line text-muted hover:border-brand hover:text-brand"
                    )}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === data.pages}
                  onClick={() =>
                    setPage((value) => Math.min(data.pages, value + 1))
                  }
                  className="btn btn-ghost btn-sm"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExploreStudiosPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ExploreContent />
    </Suspense>
  );
}
