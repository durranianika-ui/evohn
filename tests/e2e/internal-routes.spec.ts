import { test, expect } from "./fixtures";

/**
 * Regression cover for the approved pages. The homepage work introduced a
 * homepage-scoped container and homepage-scoped motion; nothing here should
 * have moved. Each case asserts the route's own identity, not merely a 200.
 */
/* Headings are the pages' real ones, read off the running site rather than
   guessed from the route name — several differ from their slug ("/journal"
   heads "Notes from the research desk"). Matching the actual copy is the
   point: it proves the route rendered its own content, not a shell. */
const ROUTES: Array<{ path: string; heading: RegExp }> = [
  { path: "/catalogue", heading: /complete collection/i },
  { path: "/products/semaglutide", heading: /semaglutide/i },
  { path: "/calculator", heading: /peptide calculator/i },
  { path: "/peptide-pedia", heading: /reference library/i },
  { path: "/reconstitution-guide", heading: /reconstituted/i },
  { path: "/storage-handling", heading: /keeping compounds stable/i },
  { path: "/journal", heading: /research desk/i },
  { path: "/lab-results", heading: /certificates of analysis/i },
  { path: "/reviews", heading: /what the bench says/i },
  { path: "/about", heading: /documented at every step/i },
  { path: "/contact", heading: /talk to the research desk/i },
  { path: "/search", heading: /search/i },
  { path: "/enquiry", heading: /your list/i },
  { path: "/terms", heading: /terms of use/i },
];

for (const { path, heading } of ROUTES) {
  test(`${path} renders its own page`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      const t = m.text();
      if (m.type() === "error" && !t.includes("_next/hmr")) errors.push(t);
    });

    const response = await page.goto(path);
    expect(response?.status(), `${path} status`).toBeLessThan(400);

    // Identity: the right page, not a shell or a soft 404.
    // `toContainText`, not `toHaveText` — the latter demands the regex match
    // the entire heading, and several of these headings are full sentences.
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1").first()).toContainText(heading);

    // Shared chrome survived the homepage work. Scoped to the page footer:
    // article cards carry their own <footer>, so a bare locator matches many.
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("body > footer, #__next > footer").last()).toBeVisible();

    // Geometry the homepage container must not have disturbed.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(1);

    expect(errors, `${path} console:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("a journal article resolves from the index", async ({ page }) => {
  await page.goto("/journal");
  const first = page.locator('a[href^="/journal/"]').first();
  const href = await first.getAttribute("href");
  expect(href).toBeTruthy();

  const response = await page.goto(href!);
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("internal pages keep the shared container, not the homepage one", async ({
  page,
  viewport,
}) => {
  test.skip((viewport?.width ?? 0) < 1280, "gutter difference only shows at desktop");

  await page.goto("/catalogue");
  const internalGutter = await page.evaluate(() => {
    const el = document.querySelector("main h1");
    return el ? Math.round(el.getBoundingClientRect().x) : -1;
  });

  await page.goto("/");
  const homeGutter = await page.evaluate(() => {
    const el = document.querySelector("main h1");
    return el ? Math.round(el.getBoundingClientRect().x) : -1;
  });

  // The homepage deliberately runs tighter gutters than internal pages; if
  // these ever match, the homepage container has leaked into the shared one.
  expect(internalGutter).toBeGreaterThan(homeGutter);
});
