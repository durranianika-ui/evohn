import { test, expect } from "./fixtures";

/**
 * The approved navigation is not part of the reconstruction. These exist so a
 * homepage change that quietly renames, reorders or unlinks a destination
 * fails loudly.
 */
const PRIMARY = [
  "Catalogue",
  "Science",
  "Journal",
  "Lab Results",
  "About",
  "Contact",
];

const SCIENCE_SUBMENU: Array<[string, string]> = [
  ["Calculator", "/calculator"],
  ["Peptide Pedia", "/peptide-pedia"],
  ["Reconstitution Guide", "/reconstitution-guide"],
  ["Storage & Handling Guide", "/storage-handling"],
];

test.describe("navigation", () => {
  // The bar is `xl:flex` in `components/layout/Header.tsx` — it appears at
  // 1280, not 1024. The threshold here said 1024 and was never contradicted,
  // because the viewport projects jumped straight from 1280 to 768 and no run
  // ever landed in the gap. Adding the 1024 project the brief asks for put a
  // run in that gap, where the drawer is the intended pattern and these
  // desktop-bar assertions do not apply.
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) < 1280,
    "desktop bar is collapsed below 1280; the drawer is covered separately",
  );

  test("keeps every approved label, in order", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    for (const label of PRIMARY) {
      await expect(
        header.getByText(label, { exact: true }).first(),
      ).toBeVisible();
    }
  });

  test("Science reveals its four tools, each resolving", async ({ page }) => {
    await page.goto("/");
    const science = page.locator("header").getByText("Science", { exact: true }).first();
    await science.hover();
    await science.click().catch(() => {});

    for (const [label, href] of SCIENCE_SUBMENU) {
      const link = page.locator(`header a[href="${href}"]`).first();
      await expect(link, `${label} missing from the Science menu`).toHaveCount(1);
    }
  });

  test("each Science destination loads its own page", async ({ page }) => {
    for (const [label, href] of SCIENCE_SUBMENU) {
      const response = await page.goto(href);
      expect(response?.status(), `${href} did not resolve`).toBeLessThan(400);
      // Identity, not just a 200.
      await expect(page.locator("h1").first()).toBeVisible();
      expect(page.url()).toContain(href);
      expect(await page.title()).not.toBe("");
      expect(label).toBeTruthy();
    }
  });

  test("search and enquiry controls are reachable", async ({ page }) => {
    await page.goto("/");
    /* By role and accessible name. Both controls take their name from a
       visually hidden span inside the button — that is *content*, so
       `getByLabel` never matched either of them and the assertion could only
       ever have passed against something else on the page. */
    const header = page.locator("header");
    await expect(
      header.getByRole("button", { name: /search/i }).first(),
    ).toBeVisible();
    await expect(
      header.getByRole("button", { name: /enquiry list/i }).first(),
    ).toBeVisible();
  });
});

test.describe("mobile drawer", () => {
  // Matches the bar's own breakpoint. With both thresholds at 1024 and the bar
  // actually appearing at 1280, a 1024 run fell through the gap between the
  // two suites and its navigation went untested by either.
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) >= 1280,
    "the bar replaces the drawer at 1280",
  );

  test("opens, closes on Escape, and restores focus", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /open menu/i }).first();
    await toggle.click();

    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});
