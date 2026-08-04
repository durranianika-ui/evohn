/**
 * Footer and tail probe.
 *
 * The block heights inside <main> only account for part of the page. This
 * measures what sits outside it — the footer above all — because a tail that
 * runs several viewports long will dominate total page height no matter how
 * accurately the sections above it are matched.
 */
import { chromium } from "@playwright/test";

const targets = [
  ["roehn", "https://roehn.co"],
  ["evohn", "http://127.0.0.1:3456/"],
];

const browser = await chromium.launch();
for (const [name, url] of targets) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    for (const b of await page.$$("button")) {
      const t = ((await b.textContent()) ?? "").trim();
      if (/^(enter|yes|i am|confirm|accept|agree|21|18)/i.test(t)) {
        await b.click({ timeout: 2500 }).catch(() => {});
        break;
      }
    }
    await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const vh = window.innerHeight;
      const doc = document.documentElement.scrollHeight;
      const main = document.querySelector("main");
      const footer = document.querySelector("footer");
      const box = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: Math.round(b.y + window.scrollY), h: Math.round(b.height), vh: +(b.height / window.innerHeight).toFixed(2) };
      };
      return {
        vh,
        doc,
        docVh: +(doc / vh).toFixed(2),
        main: box(main),
        footer: box(footer),
        bodyChildren: [...document.body.children]
          .map((el) => ({ tag: el.tagName, h: Math.round(el.getBoundingClientRect().height) }))
          .filter((x) => x.h > 8),
      };
    });
    console.log(`\n${name}  vh=${r.vh} doc=${r.doc} (${r.docVh}vh)`);
    console.log(`  main   h=${r.main?.h} (${r.main?.vh}vh)`);
    console.log(`  footer h=${r.footer?.h} (${r.footer?.vh}vh) top=${r.footer?.top}`);
    console.log(`  body children: ${r.bodyChildren.map((c) => `${c.tag}:${c.h}`).join(" ")}`);
  } catch (e) {
    console.log(`\n${name} FAILED ${e.message}`);
  } finally {
    await ctx.close();
  }
}
await browser.close();
