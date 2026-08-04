import { test, expect } from "@playwright/test";
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
    const clipped = await page.locator("main h1, main h2").evaluateAll((els) =>
      els
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && e.scrollWidth > Math.ceil(r.width) + 2;
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
