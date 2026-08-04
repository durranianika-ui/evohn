import { test, expect } from "./fixtures";
import { homeBlocks } from "./_helpers";

/**
 * Runs at every viewport project. Tablet is not a narrow desktop and mobile is
 * not a stacked desktop, so these check the things that actually break when a
 * composition is carried across a breakpoint rather than rebuilt for it.
 */
test.describe("responsive", () => {
  test("no horizontal overflow anywhere down the page", async ({ page }) => {
    await page.goto("/");
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      await page.evaluate((f) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, max * f);
      }, i / steps);
      await page.waitForTimeout(220);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `overflow at ${Math.round((i / steps) * 100)}% scroll`).toBeLessThanOrEqual(1);
    }
  });

  test("the eight blocks all render with real height", async ({ page }) => {
    await page.goto("/");
    const heights = await homeBlocks(page);
    expect(heights).toHaveLength(8);
    for (const [i, h] of heights.entries()) {
      expect(h, `block ${i + 1} collapsed`).toBeGreaterThan(120);
    }
  });

  test("headings are not clipped by their containers", async ({ page }) => {
    await page.goto("/");
    /* Measured against the children's own boxes rather than `scrollWidth`.
       A heading whose words are individual inline-blocks keeps the space
       between two of them at the end of a line, and that hanging space counts
       towards scrollWidth without a glyph ever leaving the box — which read
       as a clipped heading at 390px when nothing was clipped at all. What
       actually matters is whether something drawn extends past the heading. */
    const clipped = await page.locator("main h1, main h2").evaluateAll((els) =>
      els
        .filter((e) => {
          const r = e.getBoundingClientRect();
          if (r.width <= 0) return false;
          return [...e.querySelectorAll("*")].some(
            (child) => child.getBoundingClientRect().right > r.right + 2,
          );
        })
        .map((e) => (e.textContent || "").trim().slice(0, 40)),
    );
    expect(clipped, `clipped headings: ${clipped.join(" | ")}`).toEqual([]);
  });

  test("sticky stages release rather than trapping the page", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(700);
    const footerVisible = await page.locator("body > footer").last().isVisible();
    expect(footerVisible).toBe(true);
  });

  test("footer is not clipped", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(500);
    const box = await page.locator("body > footer").last().boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(80);
  });
});
