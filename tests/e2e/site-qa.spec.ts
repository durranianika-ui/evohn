import { test, expect } from "./fixtures";
import { overflowX } from "./_helpers";
import { staticRoutePaths } from "../../data/routes";
import { products } from "../../data/products";
import { articles } from "../../data/journal";
import { stacks } from "../../data/stacks";
import { labBatches } from "../../data/lab-results";

/**
 * Site-wide QA.
 *
 * The existing responsive spec covers the homepage in depth. This one trades
 * depth for breadth: every route the site serves, at every viewport project,
 * checked for the three failures that a content and data revision actually
 * produces — a page that overflows sideways, an image that 404s, and a runtime
 * error in the console.
 *
 * It also walks every internal link once, at one viewport, so a removed page
 * cannot leave a link pointing at it.
 */

/**
 * Every address the site answers on — the full set, used to judge whether a
 * link is dangling.
 */
const KNOWN = new Set([
  ...staticRoutePaths,
  ...products.map((p) => `/products/${p.slug}`),
  ...articles.map((a) => `/journal/${a.slug}`),
  ...stacks.map((s) => `/stacks/${s.slug}`),
  // One certificate page per product that has a released batch.
  ...labBatches.map((b) => `/lab-results/${b.product}`),
]);

/**
 * The routes actually loaded and measured. Every static page, every product,
 * and a sample of the generated editorial routes — loading all thirteen
 * articles at eight viewports buys no coverage the first three do not.
 */
const ROUTES = [
  ...staticRoutePaths,
  ...products.map((p) => `/products/${p.slug}`),
  ...articles.slice(0, 3).map((a) => `/journal/${a.slug}`),
  ...stacks.slice(0, 2).map((s) => `/stacks/${s.slug}`),
  `/lab-results/${labBatches[0].product}`,
  "/catalogue?as=pen",
  "/search?q=pen",
];

/** HMR chatter and the dev overlay are not the site's errors. */
const IGNORED = ["_next/hmr", "Download the React DevTools"];

test.describe("every route", () => {
  for (const route of ROUTES) {
    test(`${route} is clean`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        const text = m.text();
        if (m.type() === "error" && !IGNORED.some((i) => text.includes(i))) {
          errors.push(text);
        }
      });

      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBeLessThan(400);
      await page.waitForLoadState("networkidle");

      // Sideways overflow, sampled down the page — a long page can be clean at
      // the top and burst at a wide table or a rail further down.
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        await page.evaluate((f) => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, max * f);
        }, i / steps);
        await page.waitForTimeout(150);
        expect(
          await overflowX(page),
          `${route} overflows at ${Math.round((i / steps) * 100)}% scroll`,
        ).toBeLessThanOrEqual(1);
      }

      // An <img> that resolved to nothing. `complete && naturalWidth === 0` is
      // the only reliable read for a failed decode.
      const broken = await page.evaluate(() =>
        [...document.querySelectorAll("img")]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
      );
      expect(broken, `${route} broken images`).toEqual([]);

      expect(errors, `${route} console errors`).toEqual([]);
    });
  }
});

test.describe("links", () => {
  test("no internal link points at a removed page", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "one viewport is enough for a link graph",
    );
    const seen = new Map<string, string[]>();

    for (const route of ROUTES.map((r) => r.split("?")[0])) {
      await page.goto(route);
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href") ?? "")
          .filter((h) => h.startsWith("/")),
      );
      for (const href of hrefs) {
        const path = href.split("?")[0].split("#")[0] || "/";
        if (KNOWN.has(path)) continue;
        seen.set(path, [...(seen.get(path) ?? []), route]);
      }
    }

    // Anything left is a link to an address `data/routes` does not declare and
    // no data collection generates.
    const dangling = [...seen.entries()].map(
      ([href, from]) => `${href} (linked from ${from.join(", ")})`,
    );
    expect(dangling, "dangling internal links").toEqual([]);
  });

  test("nothing links to Reviews or Pocket Strips", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "one viewport is enough for a link graph",
    );
    const hits: string[] = [];
    for (const route of ["/", "/catalogue", "/science", "/about", "/journal"]) {
      await page.goto(route);
      const dead = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href") ?? "")
          .filter((h) => h.startsWith("/reviews") || h.startsWith("/strips")),
      );
      hits.push(...dead.map((d) => `${route} -> ${d}`));
    }
    expect(hits).toEqual([]);
  });
});

test.describe("content guarantees", () => {
  test("no page mentions Dubai, the UAE, or a second mailbox", async (
    { page },
    testInfo,
  ) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "copy does not change with viewport",
    );
    const banned = [
      /\bdubai\b/i,
      /dubai science park/i,
      /al barsha/i,
      /united arab emirates/i,
      /\bU\.?A\.?E\.?\b/,
      /laboratory@evohn\.com/i,
      /partners@evohn\.com/i,
    ];

    const offences: string[] = [];
    for (const route of ROUTES.map((r) => r.split("?")[0])) {
      await page.goto(route);
      const text = await page.evaluate(() => document.body.innerText);
      // Structured data is not in innerText and is exactly where a stale
      // address survives a visible-copy sweep.
      const ld = await page.evaluate(() =>
        [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((s) => s.textContent ?? "")
          .join(" "),
      );
      for (const pattern of banned) {
        if (pattern.test(text)) offences.push(`${route}: ${pattern} (copy)`);
        if (pattern.test(ld)) offences.push(`${route}: ${pattern} (json-ld)`);
      }
    }
    expect(offences).toEqual([]);
  });
});
