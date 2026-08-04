"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Read and write the URL query string without `useSearchParams`.
 *
 * Two reasons this is hand-rolled:
 *
 * 1. `useSearchParams` forces the calling subtree into a Suspense bailout.
 *    Under `output: "export"` there is no server to resume a postponed
 *    boundary, so the fallback is what ships and the page renders as a
 *    permanent skeleton.
 *
 * 2. The query string is an external store. Subscribing to it means the
 *    current value is read during render rather than mirrored into component
 *    state by an effect — no cascading render, and no window where the
 *    component and the address bar disagree.
 *
 * `popstate` is subscribed to so the back button restores a previous filter
 * set. Writes use `replaceState` by default, so adjusting a filter does not
 * stack a history entry per keystroke; `replaceState` does not emit
 * `popstate`, so the store notifies its own listeners after a write.
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

/** A string, so the snapshot is referentially stable by construction. */
function getSnapshot() {
  return window.location.search;
}

/** The prerender has no query string, and must not guess one. */
function getServerSnapshot() {
  return "";
}

function notify() {
  for (const listener of listeners) listener();
}

export function useQueryParams() {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const params = useMemo(() => new URLSearchParams(search), [search]);

  /**
   * Merge values into the query string. A `null` or empty value removes its
   * key. `push` stacks a history entry; the default replaces the current one.
   */
  const setQuery = useCallback(
    (next: Record<string, string | null>, { push = false } = {}) => {
      const merged = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") merged.delete(key);
        else merged.set(key, value);
      }

      const query = merged.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ""}`;

      if (push) window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);

      notify();
    },
    [],
  );

  return { params, setQuery };
}
