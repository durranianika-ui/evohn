"use client";

/**
 * A `useSyncExternalStore`-shaped view over `localStorage`.
 *
 * Two pieces of state on this site live in the visitor's own browser — the
 * entrance acknowledgement and the enquiry list — and neither can be known at
 * export time. The obvious implementation is `useState` plus an effect that
 * reads storage on mount, but that is exactly the cascading-render pattern
 * React now warns about: it renders once with a guess, then again with the
 * truth.
 *
 * `localStorage` is an external store. Treating it as one means the value is
 * read during render on the client and never guessed, while the prerender
 * gets a stable server snapshot.
 *
 * ## Snapshot stability
 *
 * `getSnapshot` must return a referentially identical value when nothing has
 * changed, or React re-renders forever. The raw string is cached alongside
 * the parsed value and re-parsed only when the string itself differs.
 */

export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
  /** Current value without a subscription — for event handlers. */
  peek: () => T;
}

export function createLocalStore<T>({
  key,
  parse,
  serialise = JSON.stringify,
  fallback,
}: {
  key: string;
  /** Total: must handle null, malformed JSON and a hostile shape. */
  parse: (raw: string | null) => T;
  serialise?: (value: T) => string;
  /** Server snapshot, and the value when storage is unavailable. */
  fallback: T;
}): LocalStore<T> {
  const listeners = new Set<() => void>();

  // `undefined` means "not yet read", which is distinct from a stored null.
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;

  /**
   * Set once a write has failed — private browsing, or a full quota.
   *
   * From that point the cache *is* the store: re-reading would return the
   * stale string that is still on disk and silently revert whatever the
   * visitor just did. The session keeps working; it stops persisting.
   */
  let memoryOnly = false;

  function readRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Storage disabled entirely. Behave as if empty.
      return null;
    }
  }

  function getSnapshot(): T {
    if (memoryOnly) return cachedValue;
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    // A `storage` event fires only in *other* tabs, which is exactly what it
    // is wanted for: the same visitor, a second window, one honest count.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;
      cachedRaw = undefined; // force a re-parse on the next snapshot
      listener();
    };

    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function set(value: T) {
    try {
      const written = serialise(value);
      window.localStorage.setItem(key, written);
      // Seed the cache with the value we were handed rather than re-parsing
      // what we just wrote, so the reference stays stable across the notify.
      cachedRaw = written;
    } catch {
      memoryOnly = true;
    }

    cachedValue = value;
    emit();
  }

  return {
    subscribe,
    getSnapshot,
    getServerSnapshot: () => fallback,
    set,
    peek: () => (typeof window === "undefined" ? fallback : getSnapshot()),
  };
}

/**
 * Whether the client has taken over from the prerendered HTML.
 *
 * A `useSyncExternalStore` with a server snapshot of `false` and a client
 * snapshot of `true` — which is the sanctioned way to ask "am I hydrated?"
 * without an effect and without a hydration mismatch.
 */
export const hydratedStore = {
  subscribe: () => () => {},
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};
