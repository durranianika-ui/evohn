"use client";

import { useEffect, useId, useState } from "react";
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
 * The query lives in the URL, so a search is shareable and the back button
 * walks through previous ones. The field is the source of truth while typing;
 * the URL is updated on a short idle so the address bar does not thrash on
 * every keystroke.
 */
export function SearchPage() {
  const { params, setQuery } = useQueryParams();
  const [value, setValue] = useState("");
  const [kind, setKind] = useState<SearchKind | null>(null);
  const uid = useId();

  // Adopt the URL on mount and on back/forward.
  useEffect(() => {
    setValue(params.get("q") ?? "");
    const k = params.get("kind");
    setKind(isKind(k) ? k : null);
  }, [params]);

  // Push the field back into the URL once typing settles.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if ((params.get("q") ?? "") !== value) {
        setQuery({ q: value || null });
      }
    }, 320);
    return () => window.clearTimeout(id);
  }, [value, params, setQuery]);

  const changeKind = (next: SearchKind | null) => {
    setKind(next);
    setQuery({ kind: next });
  };

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
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="Compound, batch number, article…"
            className="type-display-s w-full bg-transparent text-carbon placeholder:text-carbon/25 focus:outline-none"
          />
          {value ? (
            <button
              type="button"
              onClick={() => setValue("")}
              className="type-label min-h-11 shrink-0 px-3 text-carbon/50 transition-colors duration-400 ease-brand hover:text-carbon"
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-12">
        <SearchResults query={value} kind={kind} onKindChange={changeKind} />
      </div>
    </div>
  );
}
