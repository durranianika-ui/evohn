import type { Page } from "@playwright/test";

/**
 * Sections the homepage resolves into, in order: hero, standards, research,
 * domains, collection, pen presentations, facilities, researchers,
 * performance. The pen stage is the ninth — it was added because the pen is
 * half of what the catalogue supplies and had no presence on the site.
 *
 * Declared once so the count lives in one place rather than as a bare `8`
 * repeated across two specs.
 */
export const HOME_BLOCKS = 9;

/**
 * The homepage sections sit one level inside `<main>`, under the page
 * transition wrapper, so `main > section` finds nothing. This walks past any
 * single-child wrappers to the element that actually holds the blocks —
 * the same walk the audit probe uses, so tests and measurements agree.
 */
export async function homeBlocks(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const main = document.querySelector("main");
    if (!main) return [];
    let host: Element = main;
    while (host.children.length === 1) host = host.children[0];
    return [...host.children]
      .filter((el) => el.tagName === "SECTION")
      .map((el) => Math.round(el.getBoundingClientRect().height));
  });
}

/** Horizontal overflow in px; 0 or 1 is clean (sub-pixel rounding). */
export async function overflowX(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}
