import type { Page } from "@playwright/test";

/**
 * Sections the homepage resolves into, counted off the rendered DOM: hero,
 * philosophy, research, domains, collection, the pen stage, the standard
 * band, and the four facilities/researchers/performance blocks.
 *
 * This was asserted as `8` and had been wrong since before the pen stage
 * existed — the page rendered ten, because Facilities contributes two
 * sections and the Transition band contributes one. The stale number was
 * failing on the branch point too, so it is corrected here rather than
 * carried forward.
 *
 * Declared once so the count lives in one place rather than as a bare
 * literal repeated across two specs.
 */
export const HOME_BLOCKS = 11;

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
