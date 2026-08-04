import { test as base, expect } from "@playwright/test";

/**
 * The key and shape written by `components/common/AgeGate.tsx`. Duplicated
 * here as a literal rather than imported: that module is a client component
 * and pulling it into the runner would drag React in with it. The unit suite
 * covers the gate itself; these specs are about the site behind it.
 */
const AGE_GATE_KEY = "evohn.entry.v1";

/**
 * Every e2e test runs with the entrance notice already acknowledged.
 *
 * Each Playwright test gets a fresh browser context, so without this the gate
 * is up on every single page load — and it is a focus-trapping modal that
 * marks the rest of the document inert. That silently invalidated a good
 * portion of the suite: the navigation specs could not find controls that were
 * behind it, the skip-link test read the gate's own first stop, and the axe
 * scans were auditing the overlay rather than the page. The acknowledgement is
 * timestamped at run time because the stored record expires after thirty days.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript((key: string) => {
      try {
        window.localStorage.setItem(
          key,
          JSON.stringify({ accepted: true, at: Date.now() }),
        );
      } catch {
        /* Storage can be unavailable; the gate then simply shows. */
      }
    }, AGE_GATE_KEY);
    await use(page);
  },
});

export { expect };
