import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated scanning catches contrast, naming and landmark faults; it cannot
 * tell you whether a focus trap releases. Both halves are here.
 *
 * Only critical and serious violations fail the run. Moderate findings are
 * printed so they are visible without blocking, and nothing is excluded by a
 * blanket rule.
 */
const SURFACES: Array<[string, string]> = [
  ["homepage", "/"],
  ["catalogue", "/catalogue"],
  ["calculator", "/calculator"],
  ["contact", "/contact"],
  ["enquiry", "/enquiry"],
  ["legal", "/terms"],
];

/**
 * One exclusion, and only one.
 *
 * The footer carries an oversized wordmark as a watermark rule at 8% opacity.
 * It is `aria-hidden`, conveys nothing a reader could miss, and exists to be
 * barely visible — raising it to a 3:1 ratio would defeat its only purpose.
 * Scoped to that single element by attribute, never by rule or by page, so
 * every other contrast failure on every surface still fails the run.
 */
const DECORATIVE_ONLY = "[data-decorative-watermark]";

async function scan(page: import("@playwright/test").Page) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude(DECORATIVE_ONLY)
    .analyze();
}

for (const [name, path] of SURFACES) {
  test(`${name} has no critical or serious violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(700);
    const results = await scan(page);

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    const moderate = results.violations.filter((v) => v.impact === "moderate");
    if (moderate.length) {
      console.log(
        `[a11y] ${name} moderate: ${moderate.map((v) => v.id).join(", ")}`,
      );
    }

    expect(
      blocking,
      blocking
        .map((v) => `${v.impact} ${v.id}: ${v.nodes.length} node(s) — ${v.help}`)
        .join("\n"),
    ).toEqual([]);
  });
}

test("open desktop navigation is clean", async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1024, "desktop bar only");
  await page.goto("/");
  const science = page.locator("header").getByText("Science", { exact: true }).first();
  await science.hover();
  await science.click().catch(() => {});
  await page.waitForTimeout(400);

  const results = await scan(page);
  const blocking = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join("\n")).toEqual([]);
});

test("skip link is the first stop and it targets real content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  const href = await focused.getAttribute("href");
  expect(href, "first tab stop is not a skip link").toBeTruthy();
  expect(href!).toContain("#");

  const target = page.locator(href!.slice(href!.indexOf("#")));
  await expect(target).toHaveCount(1);
});

test("focus stays visible while tabbing the header", async ({ page }) => {
  await page.goto("/");
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return "none";
      const s = getComputedStyle(el);
      return `${s.outlineStyle}|${s.outlineWidth}|${s.boxShadow}`;
    });
    expect(outline, `no visible focus at tab stop ${i + 1}`).not.toBe("none|0px|none");
  }
});

test("the pinned collection does not trap keyboard focus", async ({ page }) => {
  await page.goto("/");
  const rail = page.locator("[data-collection-rail]");
  await rail.scrollIntoViewIfNeeded();
  await rail.focus();

  // Tabbing forward from the rail must eventually leave it.
  let escaped = false;
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const rail = document.querySelector("[data-collection-rail]");
      return !!(rail && document.activeElement && rail.contains(document.activeElement));
    });
    if (!inside) {
      escaped = true;
      break;
    }
  }
  expect(escaped, "focus never left the collection").toBe(true);
});
