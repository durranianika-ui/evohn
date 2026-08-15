#!/usr/bin/env node
/**
 * Targeted visual QA capture.
 *
 * `audit-capture.mjs` sweeps whole pages at ten scroll stops across seven
 * widths, which is the right tool for a geometry comparison and far too much
 * output when the question is "does this row look right at 768". This takes a
 * named route, a list of widths, and either a full-page frame or a single
 * element, and writes one PNG per combination.
 *
 *   node scripts/qa-shots.mjs --base http://127.0.0.1:3456 --route /stacks \
 *     --widths 1440,768,390 --out ../shots [--selector "article"] [--full]
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}
const flag = (name) => process.argv.includes(`--${name}`);

const base = arg("base", "http://127.0.0.1:3456");
// `--url` takes a complete address, for the cases where the route carries a
// query string. Passing an empty `--route` instead is fragile: some shells
// drop the empty argument and the next flag is read as the route.
const fullUrl = arg("url", null);
const route = arg("route", "/");
const widths = arg("widths", "1440").split(",").map(Number);
const outDir = path.resolve(arg("out", "qa-shots"));
const selector = arg("selector", null);
const nth = Number(arg("nth", 0));
const label = arg("label", (fullUrl ?? route).replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home");
const scrollTo = arg("scroll", null);

/**
 * The age gate, pre-acknowledged.
 *
 * Clicking through it after load is a race: the gate mounts from a
 * `localStorage` read on the client, so a click dispatched right after
 * `domcontentloaded` can land before the dialog exists and every capture
 * afterwards is a photograph of the gate. Seeding the same record the gate
 * writes, as an init script, means it never renders at all.
 */
const ENTRY_KEY = "evohn.entry.v1";

async function preAcknowledge(context) {
  await context.addInitScript(
    ([key, record]) => {
      try {
        window.localStorage.setItem(key, record);
      } catch {
        /* private mode — the gate will be clicked instead */
      }
    },
    [ENTRY_KEY, JSON.stringify({ accepted: true, at: Date.now() })],
  );
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: Math.round(width < 700 ? 844 : 900) },
    deviceScaleFactor: 2,
    hasTouch: width < 1024,
    isMobile: width < 700,
  });
  await preAcknowledge(context);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", (r) =>
    errors.push(`REQUEST FAILED ${r.url()} ${r.failure()?.errorText ?? ""}`),
  );

  await page.goto(fullUrl ?? base + route, { waitUntil: "domcontentloaded" });
  await page
    .waitForLoadState("networkidle", { timeout: 20_000 })
    .catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});

  // Reveal animations key off the viewport, so anything below the fold stays
  // at opacity 0 until it has been scrolled past. Walk the page first.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const click = arg("click", null);
  if (click) {
    await page.getByRole("button", { name: click, exact: false }).first().click();
    await page.waitForTimeout(1000);
  }

  if (scrollTo) {
    await page.evaluate((s) => {
      document.querySelector(s)?.scrollIntoView({ block: "center" });
    }, scrollTo);
    await page.waitForTimeout(900);
  }

  const file = path.join(outDir, `${label}-${width}.png`);
  if (selector) {
    const el = (await page.$$(selector))[nth];
    if (!el) {
      console.error(`  ${width}: selector "${selector}"[${nth}] not found`);
      await context.close();
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await el.screenshot({ path: file });
  } else {
    await page.screenshot({ path: file, fullPage: flag("full") });
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  console.log(
    `  ${String(width).padStart(4)}  ${path.basename(file)}` +
      (overflow > 0 ? `  H-OVERFLOW +${overflow}px` : "") +
      (errors.length ? `  ${errors.length} console/network errors` : ""),
  );
  for (const e of errors.slice(0, 4)) console.log(`         ${e}`);

  await context.close();
}

await browser.close();
