import { test, expect } from "@playwright/test";
import { homeBlocks, overflowX } from "./_helpers";

/**
 * The homepage must resolve into the eight reference-equivalent blocks and
 * carry no runtime damage. Asserting a 200 would prove nothing here — these
 * check rendered identity.
 */
test.describe("homepage", () => {
  test("renders the eight-block sequence", async ({ page }) => {
    await page.goto("/");
    expect(await homeBlocks(page)).toHaveLength(8);
  });

  test("hero occupies the opening viewport", async ({ page }, testInfo) => {
    await page.goto("/");
    const [heroHeight] = await homeBlocks(page);
    const vh = testInfo.project.use.viewport?.height ?? 900;
    // The reference hero is exactly one viewport; allow a little for the
    // dynamic-viewport unit resolving differently under automation.
    expect(heroHeight).toBeGreaterThan(vh * 0.9);
    expect(heroHeight).toBeLessThan(vh * 1.15);
  });

  test("carries the EVOHN headline, not the reference's", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/Scientific/i);
    await expect(page.locator("h1")).toContainText(/Precision/i);
  });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    expect(await overflowX(page)).toBeLessThanOrEqual(1);
  });

  test("footer is reachable at the foot of the page", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(page.locator("footer")).toBeVisible();
  });

  test("raises no uncaught page errors and no failed requests", async ({ page }) => {
    const errors: string[] = [];
    const failed: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().includes("_next/hmr")) {
        errors.push(m.text());
      }
    });
    page.on("requestfailed", (r) => {
      const url = r.url();
      // The dev-server HMR socket is not a page asset.
      if (!url.includes("_next/hmr")) failed.push(url);
    });

    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(1200);

    expect(errors, `page errors:\n${errors.join("\n")}`).toEqual([]);
    expect(failed, `failed requests:\n${failed.join("\n")}`).toEqual([]);
  });
});
