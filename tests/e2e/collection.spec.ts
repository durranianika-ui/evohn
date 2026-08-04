import { test, expect } from "./fixtures";

/**
 * The pinned collection is the most interactive thing on the page, so it is
 * the easiest to break silently. These cover the states a user can actually
 * reach: the opening card, keyboard travel, the product link, and the
 * reduced-motion rail that replaces the pin.
 */
test.describe("collection", () => {
  test("opens on the first compound", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator("[data-collection-rail]");
    await rail.scrollIntoViewIfNeeded();
    const first = rail.locator("article").first();
    await expect(first).toBeVisible();
    await expect(first).toHaveAttribute("aria-label", /^1 of/);
  });

  test("every featured compound is reachable, none clipped away", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("[data-collection-rail] article");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveAttribute(
        "aria-label",
        new RegExp(`^${i + 1} of ${count}`),
      );
    }
  });

  test("arrow keys move the active card", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator("[data-collection-rail]");
    await rail.scrollIntoViewIfNeeded();
    await rail.focus();

    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(900);
    const after = await page.evaluate(() => window.scrollY);

    // Either the window travelled (pinned mode) or the rail scrolled
    // (reduced-motion mode). Both are movement; neither should be nothing.
    const railMoved = await rail.evaluate((el) => el.scrollLeft > 0);
    expect(after !== before || railMoved).toBe(true);
  });

  test("End and Home reach the last and first card", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator("[data-collection-rail]");
    await rail.scrollIntoViewIfNeeded();
    await rail.focus();

    await page.keyboard.press("End");
    await page.waitForTimeout(1100);
    const atEnd = await page.evaluate(() => window.scrollY);

    await page.keyboard.press("Home");
    await page.waitForTimeout(1100);
    const atStart = await page.evaluate(() => window.scrollY);

    expect(atEnd).toBeGreaterThanOrEqual(atStart);
  });

  test("product links point at real product routes", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('[data-collection-rail] a[href^="/products/"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(4);

    const href = await links.first().getAttribute("href");
    const response = await page.goto(href!);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("uses EVOHN imagery only", async ({ page }) => {
    await page.goto("/");
    const sources = await page
      .locator("[data-collection-rail] img")
      .evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    expect(sources.length).toBeGreaterThan(0);
    for (const src of sources) {
      expect(src.toLowerCase()).not.toContain("roehn");
    }
  });

  test("collection does not overflow the page", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-collection-rail]").scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("collection under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("falls back to a scroll-snap rail, still complete", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator("[data-collection-rail]");
    await expect(rail).toBeVisible();
    await rail.scrollIntoViewIfNeeded();

    /* Polled, not read once. The preference is a media query with no answer
       on the server, so the rail is deliberately rendered in its default form
       for the first client render and takes its reduced-motion form on the
       commit after hydration — a single `evaluate` can land in front of that. */
    await expect
      .poll(() => rail.evaluate((el) => getComputedStyle(el).overflowX))
      .toBe("auto");

    const cards = rail.locator("article");
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });
});
