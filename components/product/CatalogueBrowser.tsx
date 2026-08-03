"use client";

import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CardGridSkeleton } from "@/components/common/Skeleton";
import { EASE_BRAND } from "@/constants/motion";
import type { Category, CategorySlug } from "@/data/categories";
import { cn } from "@/lib/utils";

export interface CatalogueEntry {
  slug: string;
  category: CategorySlug;
  /** Lower-cased haystack: name, subtitle, summary, aliases, CAS. */
  search: string;
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
 * Filtering and search are instant and do not navigate, so the grid re-flows
 * rather than reloading. Result counts are announced politely. The filter rail
 * is sticky on desktop and scrolls horizontally on narrow screens rather than
 * wrapping into a tall block that pushes the grid off-screen.
 */
export function CatalogueBrowser({
  entries,
  categories,
}: {
  entries: CatalogueEntry[];
  categories: Category[];
}) {
  const [active, setActive] = useState<CategorySlug | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const reduced = useReducedMotion();

  // Counts are computed once against the full set, so a chip always shows how
  // many compounds it holds rather than how many survive the current search.
  const counts = useMemo(() => {
    const map = new Map<CategorySlug, number>();
    for (const entry of entries) {
      map.set(entry.category, (map.get(entry.category) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  const visible = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      if (active !== "all" && entry.category !== active) return false;
      if (needle && !entry.search.includes(needle)) return false;
      return true;
    });
  }, [active, deferredQuery, entries]);

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

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Category rail */}
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
            const selected = active === filter.slug;
            return (
              <button
                key={filter.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(filter.slug)}
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
                    className="size-1.5 rounded-full ring-1 ring-current/25"
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

        {/* Search */}
        <div className="relative w-full shrink-0 lg:w-72">
          <label htmlFor="catalogue-search" className="sr-only">
            Search compounds by name, designation or CAS number
          </label>
          <input
            id="catalogue-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search compounds"
            autoComplete="off"
            className={cn(
              "type-body-s w-full border-b border-carbon/20 bg-transparent py-3.5 pr-9",
              "text-carbon placeholder:text-carbon/40",
              "transition-colors duration-400 ease-brand",
              "focus:border-carbon focus:outline-none",
            )}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-carbon/35"
          >
            {query ? null : "⌕"}
          </span>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-0 flex size-9 -translate-y-1/2 items-center justify-center text-carbon/45 transition-colors hover:text-carbon"
            >
              <span className="sr-only">Clear search</span>
              <span aria-hidden>&times;</span>
            </button>
          ) : null}
        </div>
      </div>

      <p
        aria-live="polite"
        className="type-label mt-8 border-t border-carbon/10 pt-8 text-carbon/62"
      >
        {visible.length === entries.length
          ? `${String(entries.length).padStart(2, "0")} compounds`
          : `${String(visible.length).padStart(2, "0")} of ${String(entries.length).padStart(2, "0")} compounds`}
      </p>

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
            onClick={() => {
              setActive("all");
              setQuery("");
            }}
            className="type-label mt-10 border border-carbon/25 px-8 py-4 transition-colors duration-400 ease-brand hover:border-carbon"
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </>
  );
}
