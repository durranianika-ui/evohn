/**
 * Motion audit.
 *
 * `audit-capture.mjs` measures a page at rest — how tall each block is, where
 * the gutters sit. That says nothing about how the page *behaves*, which is
 * most of what the reference's character actually is: cards that stick and
 * stack over one another, panels that shuffle as they pass, colour that moves
 * on hover, traces that draw in.
 *
 * This drives a target through its whole scroll length and records, at each
 * stop, the transform / opacity / position of every element that moves, then
 * hovers the interactive ones and diffs the computed style before and after.
 * The output is a behaviour profile that can be compared between two sites the
 * same way geometry is.
 *
 *   node scripts/audit-motion.mjs --target roehn --base https://roehn.co
 *   node scripts/audit-motion.mjs --target evohn --base http://127.0.0.1:3456
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const target = arg("target", "roehn");
const base = arg("base", "https://roehn.co");
const width = Number(arg("width", 1440));
const height = Number(arg("height", 900));
/** Fraction of the scrollable length sampled at each stop. */
const STOPS = Array.from({ length: 21 }, (_, i) => i / 20);

async function passAgeGate(page) {
  /* Matched anywhere in the label — see the note in audit-capture.mjs; the
     anchored version never matched "I CONFIRM BOTH — ENTER". */
  const affirmative = /(enter|confirm|accept|agree|continue|21\+|18\+|i am)/i;
  const decline = /(not|n't|decline|leave|exit|under|no,)/i;
  for (const sel of ["button", "[role=button]", "a"]) {
    for (const n of await page.$$(sel)) {
      const label = ((await n.textContent()) ?? "").trim();
      if (!label || !affirmative.test(label) || decline.test(label)) continue;
      if (!(await n.isVisible().catch(() => false))) continue;
      await n.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);
      return label;
    }
  }
  return null;
}

/**
 * Tag every element worth watching with a stable id, so the same box can be
 * followed across scroll stops. Anything with a transform, a transition, a
 * sticky position or a will-change hint is a candidate.
 */
const TAG = () => {
  const main = document.querySelector("main") || document.body;
  let host = main;
  while (host.children.length === 1 && host.children[0].children.length > 1)
    host = host.children[0];
  const blocks = [...host.children].filter(
    (e) => e.getBoundingClientRect().height > 4,
  );

  let n = 0;
  const watched = [];
  blocks.forEach((block, bi) => {
    for (const el of [block, ...block.querySelectorAll("*")]) {
      const s = getComputedStyle(el);
      const interesting =
        s.position === "sticky" ||
        s.position === "fixed" ||
        s.willChange !== "auto" ||
        (s.transform !== "none" && s.transform !== "matrix(1, 0, 0, 1, 0, 0)") ||
        (s.transitionDuration !== "0s" && s.transitionProperty !== "none") ||
        s.animationName !== "none";
      if (!interesting) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 8 || r.width < 8) continue;
      const id = `m${n++}`;
      el.setAttribute("data-motion-id", id);
      watched.push({
        id,
        block: bi,
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 90),
        position: s.position,
        top: s.top,
        transition: `${s.transitionProperty} ${s.transitionDuration} ${s.transitionTimingFunction}`.slice(0, 120),
        animation: s.animationName === "none" ? undefined : s.animationName,
        willChange: s.willChange === "auto" ? undefined : s.willChange,
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
      if (n > 400) return;
    }
  });
  return { blockCount: blocks.length, watched };
};

/** Read the moving properties of every tagged element at the current scroll. */
const SAMPLE = () =>
  [...document.querySelectorAll("[data-motion-id]")].map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      id: el.getAttribute("data-motion-id"),
      t: s.transform === "none" ? null : s.transform,
      o: Number(s.opacity),
      y: Math.round(r.top),
      x: Math.round(r.left),
      h: Math.round(r.height),
      bg: s.backgroundColor,
      filter: s.filter === "none" ? undefined : s.filter,
      clip: s.clipPath === "none" ? undefined : s.clipPath,
    };
  });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

await page.goto(base, { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle", { timeout: 25_000 }).catch(() => {});
await page.evaluate(() => document.fonts?.ready).catch(() => {});
const gate = await passAgeGate(page);
await page.waitForTimeout(1800);

const { blockCount, watched } = await page.evaluate(TAG);

const frames = [];
for (const stop of STOPS) {
  await page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * f));
  }, stop);
  await page.waitForTimeout(420);
  frames.push({ stop, sample: await page.evaluate(SAMPLE) });
}

/**
 * Hover profile. A card that changes nothing on hover and one that lifts,
 * inverts and slides a rule out are indistinguishable at rest.
 */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);

const hoverTargets = await page.evaluate(() => {
  const seen = new Set();
  const out = [];
  for (const el of document.querySelectorAll(
    "main a, main button, main article, main [role=group], main li",
  )) {
    const r = el.getBoundingClientRect();
    if (r.height < 24 || r.width < 24) continue;
    const key = (el.className || "").toString().slice(0, 60) + el.tagName;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!el.hasAttribute("data-motion-id"))
      el.setAttribute("data-motion-id", `h${out.length}`);
    out.push({
      id: el.getAttribute("data-motion-id"),
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 80),
    });
    if (out.length > 24) break;
  }
  return out;
});

const READ = (id) => {
  const el = document.querySelector(`[data-motion-id="${id}"]`);
  if (!el) return null;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const kid = el.querySelector("img, span, svg, div");
  const ks = kid ? getComputedStyle(kid) : null;
  return {
    transform: s.transform,
    bg: s.backgroundColor,
    color: s.color,
    borderColor: s.borderColor,
    opacity: s.opacity,
    letterSpacing: s.letterSpacing,
    w: Math.round(r.width),
    h: Math.round(r.height),
    child: ks
      ? { transform: ks.transform, w: Math.round(kid.getBoundingClientRect().width), o: ks.opacity }
      : undefined,
  };
};

const hovers = [];
for (const t of hoverTargets) {
  const before = await page.evaluate(READ, t.id);
  const handle = await page.$(`[data-motion-id="${t.id}"]`);
  if (!handle) continue;
  await handle.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(200);
  await handle.hover({ timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(700);
  const after = await page.evaluate(READ, t.id);
  const changed = {};
  for (const k of Object.keys(before ?? {})) {
    const a = JSON.stringify(before?.[k]);
    const b = JSON.stringify(after?.[k]);
    if (a !== b) changed[k] = [before?.[k], after?.[k]];
  }
  hovers.push({ ...t, changed });
  await page.mouse.move(2, 2);
  await page.waitForTimeout(150);
}

const dir = path.join(ROOT, "audit", target);
await mkdir(dir, { recursive: true });
await writeFile(
  path.join(dir, "motion.json"),
  JSON.stringify(
    { base, viewport: [width, height], ageGate: gate, blockCount, watched, frames, hovers, errors },
    null,
    1,
  ),
);

console.log(
  `${target}: ${blockCount} blocks, ${watched.length} moving elements, ${frames.length} scroll stops, ${hovers.length} hover probes`,
);
await browser.close();
