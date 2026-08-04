"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Read and write the URL query string without `useSearchParams`.
 *
 * `useSearchParams` forces the calling subtree into a Suspense bailout. Under
 * `output: "export"` there is no server to resume a postponed boundary, so the
 * fallback is what ships — the page renders as a permanent skeleton. This hook
 * avoids that entirely: the static HTML renders the unfiltered state, and the
 * query is applied on mount.
 *
 * `popstate` is listened to so the back button restores a previous filter set,
 * and writes use `replaceState` so adjusting a filter does not stack a history
 * entry per keystroke.
 */
export function useQueryParams() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );

  useEffect(() => {
    const read = () => setParams(new URLSearchParams(window.location.search));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  /**
   * Merge values into the query string. A `null` value removes its key.
   * `push` stacks a history entry; the default replaces the current one.
   */
  const setQuery = useCallback(
    (next: Record<string, string | null>, { push = false } = {}) => {
      const merged = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") merged.delete(key);
        else merged.set(key, value);
      }

      const search = merged.toString();
      const url = `${window.location.pathname}${search ? `?${search}` : ""}`;

      if (push) window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);

      setParams(merged);
    },
    [],
  );

  return { params, setQuery };
}
