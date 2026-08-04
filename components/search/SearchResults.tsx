"use client";

import Link from "next/link";
import { useMemo } from "react";
import { search, countByKind, type SearchKind } from "@/lib/search";
import { cn } from "@/lib/utils";

/**
 * The results list.
 *
 * Shared by the header overlay and by `/search`, so a query behaves the same
 * whichever surface it was typed into. Purely presentational — the query and
 * the kind filter are owned by whichever surface mounted it.
 */

const KIND_ORDER: SearchKind[] = [
  "Compound",
  "Stack",
  "Strip",
  "Domain",
  "Article",
  "Batch",
  "Page",
  "Question",
  "Legal",
];

export function SearchResults({
  query,
  kind,
  onKindChange,
  onNavigate,
  limit = 40,
  compact = false,
}: {
  query: string;
  kind: SearchKind | null;
  onKindChange?: (kind: SearchKind | null) => void;
  onNavigate?: () => void;
  limit?: number;
  /** Overlay mode: tighter rows, no filter chips. */
  compact?: boolean;
}) {
  const all = useMemo(() => search(query, 200), [query]);
  const counts = useMemo(() => countByKind(all), [all]);
  const shown = useMemo(
    () => (kind ? all.filter((r) => r.kind === kind) : all).slice(0, limit),
    [all, kind, limit],
  );

  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return (
      <p className="type-body-s py-10 text-carbon/50">
        Type at least two characters. Compound names, batch numbers, article
        titles and reference terms are all indexed.
      </p>
    );
  }

  if (!all.length) {
    return (
      <div className="py-10">
        <p className="type-title-s text-carbon">
          Nothing matches &ldquo;{trimmed}&rdquo;.
        </p>
        <p className="type-body-s mt-4 max-w-[56ch] text-carbon/55">
          Try a shorter term, a compound&rsquo;s alternative designation, or
          browse the{" "}
          <Link
            href="/catalogue"
            onClick={onNavigate}
            className="underline underline-offset-4 hover:text-carbon"
          >
            full catalogue
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      {!compact && onKindChange ? (
        <div
          role="group"
          aria-label="Filter results by type"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={kind === null}
            onClick={() => onKindChange(null)}
            className={cn(
              "type-label min-h-11 border px-5 py-2.5 transition-colors duration-400 ease-brand",
              kind === null
                ? "border-carbon bg-carbon text-soft"
                : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
            )}
          >
            All {all.length}
          </button>

          {KIND_ORDER.filter((k) => counts.has(k)).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => onKindChange(kind === k ? null : k)}
              className={cn(
                "type-label min-h-11 border px-5 py-2.5 transition-colors duration-400 ease-brand",
                kind === k
                  ? "border-carbon bg-carbon text-soft"
                  : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
              )}
            >
              {k} {counts.get(k)}
            </button>
          ))}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {shown.length} of {all.length} results for {trimmed}
      </p>

      <ol className={cn("border-t border-carbon/12", compact ? "mt-4" : "mt-10")}>
        {shown.map((result) => (
          <li key={result.id}>
            <Link
              href={result.href}
              onClick={onNavigate}
              className={cn(
                "group/result grid gap-x-6 gap-y-1 border-b border-carbon/12 transition-colors duration-400 ease-brand hover:bg-mist/60",
                compact ? "px-3 py-4" : "px-3 py-6 md:grid-cols-12 md:items-baseline",
              )}
            >
              <span
                className={cn(
                  "type-label text-carbon/40",
                  !compact && "md:col-span-2",
                )}
              >
                {result.kind}
              </span>

              <span
                className={cn(
                  "type-title-s text-carbon",
                  !compact && "md:col-span-4",
                )}
              >
                {result.title}
              </span>

              <span
                className={cn(
                  "type-body-s text-carbon/55",
                  compact
                    ? "line-clamp-1"
                    : "max-w-[64ch] md:col-span-5 md:line-clamp-2",
                )}
              >
                {result.description}
              </span>

              <span
                aria-hidden
                className={cn(
                  "type-label hidden text-carbon/30 transition-transform duration-500 ease-brand group-hover/result:translate-x-1.5",
                  !compact && "md:col-span-1 md:block md:justify-self-end",
                )}
              >
                &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {all.length > shown.length ? (
        <p className="type-body-s mt-8 text-carbon/50">
          Showing {shown.length} of {all.length}. Narrow the query to see the
          rest.
        </p>
      ) : null}
    </div>
  );
}
