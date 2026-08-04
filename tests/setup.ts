import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

/**
 * DOM test environment.
 *
 * jsdom implements neither `matchMedia` nor `IntersectionObserver`, and this
 * codebase uses both — the cursor and the reduced-motion checks read the
 * first, the table of contents reads the second. Stubbing them here rather
 * than in each test keeps the individual files about behaviour.
 *
 * `matchMedia` defaults to *not matching*, which means: coarse pointer, no
 * reduced-motion preference. Tests that need a fine pointer or a calm
 * visitor say so explicitly via `setMediaQuery`.
 */

const mediaState = new Map<string, boolean>();

/** Force a media query to match (or not) for the current test. */
export function setMediaQuery(query: string, matches: boolean) {
  mediaState.set(query, matches);
}

beforeEach(() => {
  mediaState.clear();

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: mediaState.get(query) ?? false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "";
      thresholds = [];
    },
  );

  // Framer Motion measures elements on mount; jsdom reports zero for
  // everything, which is fine, but ResizeObserver must at least exist.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );

  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
