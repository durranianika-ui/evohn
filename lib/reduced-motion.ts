"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `false` while the server renders and through hydration, `true` afterwards.
 * `useSyncExternalStore` is the sanctioned way to ask "am I past hydration"
 * without a state update inside an effect: the server snapshot and the client
 * snapshot are simply different constants, and there is nothing to subscribe
 * to, so the subscribe callback is a no-op.
 */
const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

/**
 * `prefers-reduced-motion`, read at a time when the answer is safe to act on.
 *
 * The preference is a media query, and a media query has no answer on the
 * server. Components that branched on it during their first client render —
 * `SplitText` returns an entirely different tree, `Reveal` starts from a
 * different transform — therefore rendered something other than the markup
 * they were hydrating. React reports that as a hydration failure and repairs
 * it by discarding and rebuilding the subtree, which on this page detached the
 * collection rail out from under anything holding a reference to it.
 *
 * Reporting `false` until the first effect runs makes the first client render
 * identical to the server's by construction. The cost is one frame of default
 * motion before the preference takes effect; the alternative is a page that
 * rebuilds itself on load for exactly the users who asked for less movement.
 */
export function useReducedMotionSafe(): boolean {
  const preference = useReducedMotion();
  return useHydrated() && !!preference;
}
