"use client";

import { useDeferredValue, type ReactNode } from "react";
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

export interface PediaEntry extends CatalogueRecord {
  /** The row, rendered on the server. */
  row: ReactNode;
}

/**
 * Peptide Pedia browser.
 *
 * The reference library is something people look a compound up in, not
 * something they scroll — so it takes the same search, domain filter and sort
 * as the catalogue, over the same pure rules in `lib/catalogue.ts`.
 *
 * It renders a flat list rather than the catalogue's grid: at reference
 * density a row carrying name, designations, evidence level, mechanism and
 * identifiers is easier to scan than a card.
 *
 * State lives in the URL, so a filtered view of the library can be cited.
 */
export function PediaBrowser({
  entries,
  categories,
}: {
  entries: PediaEntry[];
  categories: Category[];
}) {
  const { params, setQuery } = useQueryParams();

  const urlDomain = params.get("domain");
  const domain: CategorySlug | "all" =
    urlDomain && categories.some((c) => c.slug === urlDomain)
      ? (urlDomain as CategorySlug)
      : "all";

  const urlSort = params.get("sort");
  const sort: SortKey = isSortKey(urlSort) ? urlSort : DEFAULT_SORT;

  const query = params.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);

  const counts = countByDomain(entries);
  const visible = applyCatalogue(entries, {
    domain,
    query: deferredQuery,
    sort,
  });

  const narrowed = !isDefaultFilters({ domain, query, sort });

  const commit = (next: {
    domain?: CategorySlug | "all";
    sort?: SortKey;
    q?: string;
  }) =>
    setQuery({
      domain: (next.domain ?? domain) === "all" ? null : (next.domain ?? domain),
      sort: (next.sort ?? sort) === DEFAULT_SORT ? null : (next.sort ?? sort),
      q: (next.q ?? query).trim() || null,
    });

  const reset = () => setQuery({ domain: null, sort: null, q: null });

  const chips = [
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

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div
          role="group"
          aria-label="Filter the library by research domain"
          className={cn(
            "-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10",
            "lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {chips.map((chip) => {
            const selected = domain === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => commit({ domain: chip.slug })}
                className={cn(
                  "type-label inline-flex shrink-0 items-center gap-2.5 border px-5 py-3.5",
                  "transition-colors duration-400 ease-brand",
                  selected
                    ? "border-carbon bg-carbon text-soft"
                    : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
                )}
              >
                {chip.token ? (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-dot ring-1 ring-current/25"
                    style={{ backgroundColor: chip.token }}
                  />
                ) : null}
                {chip.name}
                <span
                  className={cn(
                    "tabular-nums",
                    selected ? "text-soft/55" : "text-carbon/35",
                  )}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 sm:flex-row sm:items-end lg:w-auto">
          <div className="shrink-0">
            <label htmlFor="pedia-sort" className="type-label block text-carbon/45">
              Order
            </label>
            <select
              id="pedia-sort"
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

          <div className="relative w-full lg:w-72">
            <label
              htmlFor="pedia-search"
              className="type-label block text-carbon/45"
            >
              Look up a compound
            </label>
            <input
              id="pedia-search"
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
                <span className="sr-only">Clear the lookup</span>
                <span aria-hidden>&times;</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-carbon/10 pt-8">
        <p aria-live="polite" className="type-label text-carbon/62">
          {visible.length === entries.length
            ? `${String(entries.length).padStart(2, "0")} entries`
            : `${String(visible.length).padStart(2, "0")} of ${String(entries.length).padStart(2, "0")} entries`}
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

      {visible.length ? (
        <ul className="mt-4">
          {visible.map((entry) => (
            <li key={entry.slug}>{entry.row}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-16 border-t border-carbon/10 pt-16 text-center">
          <p className="type-title text-carbon">No entry matches that</p>
          <p className="type-body mx-auto mt-5 max-w-[46ch] text-carbon/62">
            Try an alternative designation or a CAS number. If a compound is
            absent from the library, it is absent from the catalogue too.
          </p>
          <button
            type="button"
            onClick={reset}
            className="type-label mt-10 min-h-12 border border-carbon/25 px-8 py-4 transition-colors duration-400 ease-brand hover:border-carbon"
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
