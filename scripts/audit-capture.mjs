/**
 * Visual audit capture.
 *
 * Drives a target site through the seven audit viewports, dismisses an age
 * gate if one stands in the way, waits for fonts and media to settle, then
 * records both rendered frames and objective geometry.
 *
 * Screenshots alone cannot tell you a section is 12px too tall; geometry
 * alone cannot tell you it looks wrong. This writes both, side by side, so
 * the comparison step has something to measure and something to look at.
 *
 *   node scripts/audit-capture.mjs --target roehn --base https://roehn.co
 *   node scripts/audit-capture.mjs --target evohn-after --base http://127.0.0.1:3789
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const VIEWPORTS = [
  { w: 1920, h: 1080 },
  { w: 1440, h: 900 },
  { w: 1280, h: 800 },
  { w: 768, h: 1024 },
  { w: 430, h: 932 },
  { w: 390, h: 844 },
  { w: 360, h: 800 },
];

/** Fraction of total scroll captured as a discrete frame. */
const SCROLL_STOPS = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.94, 1];

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

/**
 * An age gate blocks everything behind it, so it has to go before any
 * measurement is meaningful. Matched on the affirmative control only —
 * never the decline control, which would navigate away.
 */
async function passAgeGate(page) {
  const affirmative =
    /^(enter|yes|i am|i'm|confirm|accept|agree|continue|21\+|18\+|over)/i;
  for (const sel of ["button", "[role=button]", "a"]) {
    const nodes = await page.$$(sel);
    for (const n of nodes) {
      const label = ((await n.textContent()) ?? "").trim();
      if (!label || !affirmative.test(label)) continue;
      if (!(await n.isVisible().catch(() => false))) continue;
      await n.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);
      return label;
    }
  }
  return null;
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  // Let entrance animations and any lazy media resolve.
  await page.waitForTimeout(1600);
}

/** Everything measurable about the rendered page, in one pass. */
const PROBE = () => {
  const px = (v) => Math.round(parseFloat(v) || 0);
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y + window.scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };

  const main = document.querySelector("main") || document.body;
  // Some frameworks wrap every section in one div; walk to the real list.
  let host = main;
  while (host.children.length === 1 && host.children[0].children.length > 1) {
    host = host.children[0];
  }

  const sections = [...host.children]
    .map((el) => {
      const s = getComputedStyle(el);
      const b = box(el);
      const heading = el.querySelector("h1,h2,h3");
      return {
        tag: el.tagName,
        top: b.y,
        height: b.h,
        bg: s.backgroundColor,
        position: s.position,
        heading: heading
          ? (heading.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48)
          : null,
        headingSize: heading ? px(getComputedStyle(heading).fontSize) : null,
      };
    })
    .filter((s) => s.height > 4);

  // Gutter: distance from viewport edge to the first substantial text block.
  const probeText = document.querySelector("main h1, main h2, main p");
  const gutter = probeText ? Math.round(probeText.getBoundingClientRect().x) : null;

  const type = {};
  for (const tag of ["h1", "h2", "h3", "p"]) {
    const el = document.querySelector(`main ${tag}`);
    if (!el) continue;
    const s = getComputedStyle(el);
    type[tag] = {
      family: s.fontFamily.split(",")[0].replace(/["']/g, ""),
      size: px(s.fontSize),
      lineHeight: px(s.lineHeight),
      tracking: s.letterSpacing,
      weight: s.fontWeight,
      transform: s.textTransform,
    };
  }

  const sticky = [...document.querySelectorAll("main *")]
    .filter((e) => {
      const p = getComputedStyle(e).position;
      return p === "sticky" || p === "fixed";
    })
    .slice(0, 10)
    .map((e) => ({
      cls: (e.className || "").toString().slice(0, 60),
      position: getComputedStyle(e).position,
      ...box(e),
    }));

  const header = document.querySelector("header");

  return {
    docHeight: document.documentElement.scrollHeight,
    viewport: [window.innerWidth, window.innerHeight],
    overflowX: Math.max(
      0,
      document.documentElement.scrollWidth - window.innerWidth,
    ),
    gutter,
    sections,
    type,
    sticky,
    header: header
      ? {
          ...box(header),
          bg: getComputedStyle(header).backgroundColor,
          backdrop: getComputedStyle(header).backdropFilter,
          radius: getComputedStyle(header).borderRadius,
          position: getComputedStyle(header).position,
        }
      : null,
    bodyCursor: getComputedStyle(document.body).cursor,
  };
};

async function captureTarget({ target, base, outDir }) {
  const browser = await chromium.launch();
  const report = { target, base, capturedAt: new Date().toISOString(), viewports: {} };

  for (const { w, h } of VIEWPORTS) {
    const key = `${w}x${h}`;
    const dir = path.join(outDir, key);
    await mkdir(dir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      hasTouch: w <= 768,
      isMobile: w <= 430,
      userAgent:
        w <= 430
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          : undefined,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
    });
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`.slice(0, 200)));

    try {
      await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60_000 });
      const gate = await passAgeGate(page);
      await settle(page);

      // Header at rest, before any scroll moves it.
      await page.screenshot({ path: path.join(dir, "00-initial.png") });
      const headerAtTop = await page.evaluate(() => {
        const el = document.querySelector("header");
        if (!el) return null;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { y: Math.round(r.y), h: Math.round(r.height), bg: s.backgroundColor, backdrop: s.backdropFilter };
      });

      const geometry = await page.evaluate(PROBE);

      // Discrete scroll states — pinned sections need more than one frame.
      const frames = [];
      for (const stop of SCROLL_STOPS) {
        const y = await page.evaluate((f) => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const target = Math.round(max * f);
          window.scrollTo(0, target);
          return target;
        }, stop);
        await page.waitForTimeout(650);
        const name = `scroll-${String(Math.round(stop * 100)).padStart(3, "0")}.png`;
        await page.screenshot({ path: path.join(dir, name) });
        frames.push({ stop, scrollY: y, file: name });
      }

      // Header once scrolled, to catch a state change.
      const headerScrolled = await page.evaluate(() => {
        const el = document.querySelector("header");
        if (!el) return null;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { y: Math.round(r.y), h: Math.round(r.height), bg: s.backgroundColor, backdrop: s.backdropFilter };
      });

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(dir, "full.jpg"),
        fullPage: true,
        type: "jpeg",
        quality: 72,
      });

      report.viewports[key] = {
        ...geometry,
        ageGate: gate,
        headerAtTop,
        headerScrolled,
        frames,
        consoleErrors: [...new Set(consoleErrors)].slice(0, 12),
      };
      console.log(
        `  ${key.padEnd(9)} doc=${geometry.docHeight} sections=${geometry.sections.length} gutter=${geometry.gutter} overflowX=${geometry.overflowX}`,
      );
    } catch (err) {
      report.viewports[key] = { error: err.message };
      console.log(`  ${key.padEnd(9)} FAILED ${err.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  await writeFile(
    path.join(outDir, "geometry.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
  return report;
}

const target = arg("target", "evohn-after");
const base = arg("base", "http://127.0.0.1:3789");
const outDir = path.join(ROOT, "audit", target);
await mkdir(outDir, { recursive: true });
console.log(`Capturing ${target} from ${base}`);
await captureTarget({ target, base, outDir });
console.log(`Wrote ${path.relative(ROOT, outDir)}/geometry.json`);
