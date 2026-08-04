"use client";

import { useDeferredValue, useId } from "react";
import { SearchResults } from "./SearchResults";
import { useQueryParams } from "@/lib/query";
import type { SearchKind } from "@/lib/search";

const KINDS: SearchKind[] = [
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

function isKind(value: string | null): value is SearchKind {
  return value !== null && (KINDS as string[]).includes(value);
}

/**
 * `/search`.
 *
 * The URL is the only state. The field renders from `?q=` and writes back to
 * it, so a search is shareable, bookmarkable and walkable with the back
 * button — and there is no second copy of the query to fall out of step with
 * the address bar.
 *
 * Writes use `replaceState`, so typing does not stack one history entry per
 * keystroke, and `useDeferredValue` keeps the field responsive while the
 * result list catches up.
 */
export function SearchPage() {
  const { params, setQuery } = useQueryParams();
  const uid = useId();

  const value = params.get("q") ?? "";
  const deferred = useDeferredValue(value);

  const kindParam = params.get("kind");
  const kind = isKind(kindParam) ? kindParam : null;

  return (
    <div className="container-content py-16 md:py-24">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={`${uid}-q`} className="type-label text-carbon/45">
          Search
        </label>
        <div className="mt-4 flex items-center gap-5 border-b border-carbon/25 pb-3 focus-within:border-carbon">
          <input
            id={`${uid}-q`}
            type="search"
            value={value}
            onChange={(e) => setQuery({ q: e.target.value })}
            autoComplete="off"
            spellCheck={false}
            placeholder="Compound, batch number, article…"
            className="type-display-s w-full bg-transparent text-carbon placeholder:text-carbon/25 focus:outline-none"
          />
          {value ? (
            <button
              type="button"
              onClick={() => setQuery({ q: null })}
              className="type-label min-h-11 shrink-0 px-3 text-carbon/50 transition-colors duration-400 ease-brand hover:text-carbon"
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-12">
        <SearchResults
          query={deferred}
          kind={kind}
          onKindChange={(next) => setQuery({ kind: next })}
        />
      </div>
    </div>
  );
}
