"use client";

import { useDeferredValue, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CardGridSkeleton } from "@/components/common/Skeleton";
import { EASE_BRAND } from "@/constants/motion";
import { useQueryParams } from "@/lib/query";
import {
  DEFAULT_SORT,
  SORT_OPTIONS,
  applyCatalogue,
  countByDomain,
  isDefaultFilters,
  isSortKey,
  type CatalogueRecord,
  type SortKey,
} from "@/lib/catalogue";
import type { Category, CategorySlug } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export interface CatalogueEntry extends CatalogueRecord {
  /**
   * The card, rendered on the server.
   * Cards read the filesystem to decide between photography and the vector
   * plate, so they cannot be constructed inside this client component —
   * they are passed in already rendered.
   */
  card: ReactNode;
}

/**
 * Catalogue browser.
 *
 * Filtering, sorting and search are instant and do not navigate, so the grid
 * re-flows rather than reloading — but every one of them is mirrored into the
 * query string, so a filtered view can be linked, bookmarked and reached with
 * the back button.
 *
 * The URL is read through `useQueryParams` rather than `useSearchParams`: the
 * latter forces a Suspense bailout, and under `output: "export"` there is no
 * server to resume a postponed boundary, so the fallback is what ships.
 *
 * The filter rail scrolls horizontally on narrow screens rather than wrapping
 * into a tall block that would push the grid off-screen.
 */
export function CatalogueBrowser({
  entries,
  categories,
}: {
  entries: CatalogueEntry[];
  categories: Category[];
}) {
  const { params, setQuery: setUrl } = useQueryParams();
  const reduced = useReducedMotionSafe();

  // The URL is the only state. An unknown domain or sort — a hand-edited
  // address, or a stale link from before a domain was renamed — falls back to
  // the default rather than silently emptying the grid.
  const urlDomain = params.get("domain");
  const domain: CategorySlug | "all" =
    urlDomain && categories.some((c) => c.slug === urlDomain)
      ? (urlDomain as CategorySlug)
      : "all";

  const urlSort = params.get("sort");
  const sort: SortKey = isSortKey(urlSort) ? urlSort : DEFAULT_SORT;

  const query = params.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);

  const commit = (next: {
    domain?: CategorySlug | "all";
    sort?: SortKey;
    q?: string;
  }) => {
    setUrl({
      domain: (next.domain ?? domain) === "all" ? null : (next.domain ?? domain),
      sort: (next.sort ?? sort) === DEFAULT_SORT ? null : (next.sort ?? sort),
      q: (next.q ?? query).trim() || null,
    });
  };

  // Counts are computed against the full set, so a chip always shows how many
  // compounds it holds rather than how many survive the current search.
  //
  // Neither of these is hand-memoised: the React compiler does it, and a
  // manual useMemo over values derived from the query string defeats it.
  const counts = countByDomain(entries);
  const visible = applyCatalogue(entries, {
    domain,
    query: deferredQuery,
    sort,
  });

  const filters = [
    { slug: "all" as const, name: "All", token: null, count: entries.length },
    ...categories
      .filter((c) => counts.has(c.slug))
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        token: c.token,
        count: counts.get(c.slug) ?? 0,
      })),
  ];

  const stale = query !== deferredQuery;
  const narrowed = !isDefaultFilters({ domain, query, sort });

  const reset = () => setUrl({ domain: null, sort: null, q: null });

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Domain rail */}
        <div
          role="group"
          aria-label="Filter catalogue by research domain"
          className={cn(
            "-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10",
            "lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {filters.map((filter) => {
            const selected = domain === filter.slug;
            return (
              <button
                key={filter.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => commit({ domain: filter.slug })}
                className={cn(
                  "type-label inline-flex shrink-0 items-center gap-2.5 border px-5 py-3.5",
                  "transition-colors duration-400 ease-brand",
                  selected
                    ? "border-carbon bg-carbon text-soft"
                    : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
                )}
              >
                {filter.token ? (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-dot ring-1 ring-current/25"
                    style={{ backgroundColor: filter.token }}
                  />
                ) : null}
                {filter.name}
                <span
                  className={cn(
                    "tabular-nums",
                    selected ? "text-soft/55" : "text-carbon/35",
                  )}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 sm:flex-row sm:items-end lg:w-auto">
          {/* Sort */}
          <div className="shrink-0">
            <label
              htmlFor="catalogue-sort"
              className="type-label block text-carbon/45"
            >
              Order
            </label>
            <select
              id="catalogue-sort"
              value={sort}
              onChange={(e) => commit({ sort: e.target.value as SortKey })}
              className={cn(
                "type-body-s mt-1.5 min-h-11 w-full border-b border-carbon/20 bg-transparent py-2.5 pr-6",
                "text-carbon transition-colors duration-400 ease-brand",
                "focus:border-carbon focus:outline-none sm:w-40",
              )}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <label
              htmlFor="catalogue-search"
              className="type-label block text-carbon/45"
            >
              Search
            </label>
            <input
              id="catalogue-search"
              type="search"
              value={query}
              onChange={(e) => commit({ q: e.target.value })}
              placeholder="Name, designation or CAS"
              autoComplete="off"
              className={cn(
                "type-body-s mt-1.5 min-h-11 w-full border-b border-carbon/20 bg-transparent py-2.5 pr-9",
                "text-carbon placeholder:text-carbon/40",
                "transition-colors duration-400 ease-brand",
                "focus:border-carbon focus:outline-none",
              )}
            />
            {query ? (
              <button
                type="button"
                onClick={() => commit({ q: "" })}
                className="absolute right-0 bottom-0 flex size-11 items-center justify-center text-carbon/45 transition-colors hover:text-carbon"
              >
                <span className="sr-only">Clear search</span>
                <span aria-hidden>&times;</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-carbon/10 pt-8">
        <p aria-live="polite" className="type-label text-carbon/62">
          {visible.length === entries.length
            ? `${String(entries.length).padStart(2, "0")} compounds`
            : `${String(visible.length).padStart(2, "0")} of ${String(entries.length).padStart(2, "0")} compounds`}
        </p>

        {narrowed ? (
          <button
            type="button"
            onClick={reset}
            className="type-label min-h-11 text-carbon/50 transition-colors duration-400 ease-brand hover:text-carbon"
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      {/*
        On a device slow enough for the deferred search to lag a frame, the
        skeleton stands in rather than showing a stale result set. On a fast
        one it never appears — which is the correct behaviour for a grid whose
        data is already in memory.
      */}
      {stale ? (
        <div className="mt-12">
          <span className="sr-only" role="status">
            Filtering compounds
          </span>
          <CardGridSkeleton count={Math.min(visible.length || 3, 6)} />
        </div>
      ) : (
        <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((entry) => (
              <motion.div
                key={entry.slug}
                layout={!reduced}
                initial={{ opacity: 0, y: reduced ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -12 }}
                transition={{ duration: reduced ? 0.12 : 0.5, ease: EASE_BRAND }}
              >
                {entry.card}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="mt-16 border-t border-carbon/10 pt-16 text-center">
          <p className="type-title text-carbon">Nothing matches that</p>
          <p className="type-body mx-auto mt-5 max-w-[46ch] text-carbon/62">
            Try a different designation, or clear the filters to see the
            complete collection. If a compound is not listed, the desk can
            confirm whether it can be sourced.
          </p>
          <button
            type="button"
            onClick={reset}
            className="type-label mt-10 min-h-12 border border-carbon/25 px-8 py-4 transition-colors duration-400 ease-brand hover:border-carbon"
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </>
  );
}
