#!/usr/bin/env node
/**
 * Normalise the supplied product photography into the catalogue's card frame.
 *
 * WHY THIS EXISTS
 * ---------------
 * The renders are delivered one per compound, shot to the same brief but not
 * to the same frame: the source aspect ratio varies (most are 4:5, two are
 * square), the bottle sits anywhere between 68% and 74% of the frame height,
 * and its centre drifts by up to five points horizontally and four
 * vertically. Dropped straight into a grid those differences read as sloppy
 * photography — one card's vial noticeably larger than its neighbour's, one
 * sitting lower than the rest.
 *
 * Fixing that in CSS is not possible: `object-fit` can only scale the whole
 * frame, and the frames disagree about where the product is inside them. So
 * the correction is made once, here, at prepare time — every render is
 * recropped so the product lands at the same size and the same place in a
 * single 4:5 canvas. After this runs, the components can use one frame and
 * one `object-fit` rule for the entire catalogue, which is what makes the
 * grid read as a single shoot.
 *
 * THE MEASUREMENTS
 * ----------------
 * `top`/`bottom` are the product's vertical extent (top of the crimp cap to
 * the foot of the base for a vial; top of the glass cartridge to the foot of
 * the device for a pen) and `cx` its horizontal centre, all as fractions of
 * the SOURCE frame. They were read off a labelled 10% grid overlaid on each
 * render rather than detected programmatically: the compositions wrap the
 * product in a bright water swirl that defeats edge- and detail-based
 * subject detection, and with two dozen fixed assets a measured table is both
 * more accurate and easier to audit than a heuristic. Re-measure with
 * `scripts/grid-sheet.mjs` if the photography is ever replaced.
 *
 * Usage:  node scripts/prepare-product-renders.mjs <source-dir> [--dry]
 * Sources are named `<kind>-<slug>.png`, matching `renderFor` in
 * `data/products.ts`.
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "products");

/* --------------------------------------------------------------------------
   Output frame.

   4:5 matches the product gallery (`aspect-4/5`) and the catalogue card, so
   the same file is pixel-correct on both without a second crop. 1000×1250 is
   a little above the largest place it is drawn at 2× device pixels, and the
   production build serves `public/` unoptimised, so this is the file the
   browser actually downloads — hence the restraint.
   -------------------------------------------------------------------------- */
const CANVAS_W = 1000;
const CANVAS_H = 1250;
const QUALITY = 80;

/* --------------------------------------------------------------------------
   Targets.

   Both are set to the largest measured product in their family, so every
   transform is a crop inwards and no render is ever scaled beyond its own
   pixels or padded with invented background. The centres are the family
   averages, which keeps the correction to a couple of points and leaves each
   composition's balance intact.
   -------------------------------------------------------------------------- */
const TARGET = {
  vial: { height: 0.74, cx: 0.51, cy: 0.56 },
  pen: { height: 0.82, cx: 0.505, cy: 0.515 },
};

/** Measured against a 10% grid. See the note above. */
const MEASURED = {
  "vial-bacteriostatic-water": { top: 0.2, bottom: 0.92, cx: 0.49 },
  "vial-bpc-157-tb-500": { top: 0.19, bottom: 0.93, cx: 0.51 },
  "vial-cjc-1295-ipamorelin": { top: 0.19, bottom: 0.93, cx: 0.51 },
  "vial-ghk-cu": { top: 0.21, bottom: 0.91, cx: 0.5 },
  "vial-melanotan-ii": { top: 0.22, bottom: 0.9, cx: 0.51 },
  "vial-mots-c": { top: 0.2, bottom: 0.91, cx: 0.505 },
  "vial-nad-plus": { top: 0.19, bottom: 0.92, cx: 0.515 },
  "vial-retatrutide": { top: 0.19, bottom: 0.92, cx: 0.53 },
  "vial-selank": { top: 0.22, bottom: 0.92, cx: 0.515 },
  "vial-semax": { top: 0.25, bottom: 0.94, cx: 0.515 },
  "vial-snap-8": { top: 0.24, bottom: 0.93, cx: 0.515 },
  "vial-tesamorelin": { top: 0.25, bottom: 0.94, cx: 0.525 },

  "pen-bacteriostatic-water": { top: 0.1, bottom: 0.92, cx: 0.5 },
  "pen-bpc-157-tb-500": { top: 0.11, bottom: 0.92, cx: 0.5 },
  "pen-cjc-1295-ipamorelin": { top: 0.11, bottom: 0.93, cx: 0.505 },
  "pen-ghk-cu": { top: 0.11, bottom: 0.92, cx: 0.5 },
  "pen-melanotan-ii": { top: 0.11, bottom: 0.91, cx: 0.5 },
  "pen-mots-c": { top: 0.11, bottom: 0.91, cx: 0.505 },
  "pen-nad-plus": { top: 0.11, bottom: 0.92, cx: 0.5 },
  "pen-retatrutide": { top: 0.11, bottom: 0.91, cx: 0.5 },
  "pen-selank": { top: 0.11, bottom: 0.9, cx: 0.53 },
  "pen-semax": { top: 0.12, bottom: 0.91, cx: 0.48 },
  "pen-snap-8": { top: 0.11, bottom: 0.92, cx: 0.495 },
  "pen-tesamorelin": { top: 0.12, bottom: 0.91, cx: 0.525 },
};

/* --------------------------------------------------------------------------
   Tonal convergence.

   The renders are shot on backgrounds ranging from near-black to a light warm
   grey — a five-fold spread in corner luminance — which reads as several
   different shoots sitting next to each other in the grid.

   The correction is a pure gamma curve, `out = (in/255)^e`, chosen per image
   so its background lands part of the way toward the set's median. A gamma
   curve holds 0 at 0 and 255 at 255, so the black ground and the blown
   highlights of the water swirl and the glass are mathematically untouched;
   only the midtones the background actually occupies move. `strength` is
   deliberately partial: the aim is to bring the set within a recognisable
   range of one another, not to flatten twelve photographs onto one value and
   crush the kraft and off-white labels in the process.

   Targets are per family, and each is that family's own measured median. The
   pens arrived consistent already (corner luma 30–46) and a shared target
   would have lifted all twelve off their intended near-black ground to fix a
   problem they do not have; the vials arrived spread 45–122 and are where the
   work is needed. Grading each family toward its own centre removes the
   inconsistency without restyling either.
   -------------------------------------------------------------------------- */
const GRADE = {
  vial: { target: 82, strength: 0.8 },
  pen: { target: 35, strength: 0.8 },
};

function gammaExponent(from, to) {
  const a = Math.log(Math.min(254, Math.max(1, from)) / 255);
  const b = Math.log(Math.min(254, Math.max(1, to)) / 255);
  return b / a;
}

async function applyGrade(buffer, luma, kind) {
  const { target, strength } = GRADE[kind];
  const to = luma + (target - luma) * strength;
  const e = gammaExponent(luma, to);
  if (Math.abs(e - 1) < 0.01) return buffer;

  const lut = Buffer.alloc(256);
  for (let v = 0; v < 256; v++)
    lut[v] = Math.round(255 * Math.pow(v / 255, e));

  const { data, info } = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i++) data[i] = lut[data[i]];

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();
}

/** Mean luminance of the frame's four corners — a proxy for the background. */
async function cornerLuma(buffer) {
  const s = sharp(buffer);
  const { width, height } = await s.metadata();
  const box = Math.round(Math.min(width, height) * 0.12);
  const corners = [
    { left: 0, top: 0 },
    { left: width - box, top: 0 },
    { left: 0, top: height - box },
    { left: width - box, top: height - box },
  ];
  let total = 0;
  for (const c of corners) {
    const { channels } = await sharp(buffer)
      .extract({ ...c, width: box, height: box })
      .stats();
    const [r, g, b] = channels;
    total += 0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean;
  }
  return total / corners.length;
}

async function prepare(sourceFile, name, dry, grade) {
  const kind = name.startsWith("pen-") ? "pen" : "vial";
  const target = TARGET[kind];
  const m = MEASURED[name];
  if (!m) throw new Error(`No measurement recorded for ${name}`);

  const meta = await sharp(sourceFile).metadata();
  const { width: sw, height: sh } = meta;

  // The product's height in source pixels, and the crop window that puts it
  // at the target fraction of the finished frame.
  const productPx = (m.bottom - m.top) * sh;
  let winH = productPx / target.height;
  let winW = winH * (CANVAS_W / CANVAS_H);

  // Never ask for more than the source has.
  const fit = Math.min(1, sw / winW, sh / winH);
  winW *= fit;
  winH *= fit;

  // Place the window so the product's centre lands on the target.
  const productCx = m.cx * sw;
  const productCy = ((m.top + m.bottom) / 2) * sh;
  let left = productCx - target.cx * winW;
  let top = productCy - target.cy * winH;

  const clampedLeft = Math.max(0, Math.min(sw - winW, left));
  const clampedTop = Math.max(0, Math.min(sh - winH, top));
  const drift = {
    x: (clampedLeft - left) / winW,
    y: (clampedTop - top) / winH,
  };

  let buffer = await sharp(sourceFile)
    .extract({
      left: Math.round(clampedLeft),
      top: Math.round(clampedTop),
      width: Math.round(winW),
      height: Math.round(winH),
    })
    .resize(CANVAS_W, CANVAS_H, { fit: "fill" })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  const before = await cornerLuma(buffer);
  if (grade) buffer = await applyGrade(buffer, before, kind);
  const after = grade ? await cornerLuma(buffer) : before;

  const outPath = path.join(OUT_DIR, `${name}.webp`);
  if (!dry) fs.writeFileSync(outPath, buffer);

  return {
    name,
    kind,
    // What fraction of the finished frame the product now occupies.
    finalHeight: (productPx * (CANVAS_H / winH)) / CANVAS_H,
    scale: fit,
    driftX: drift.x,
    driftY: drift.y,
    kb: Math.round(buffer.length / 1024),
    luma: Math.round(after),
    lumaBefore: Math.round(before),
  };
}

const sourceDir = process.argv[2];
const dry = process.argv.includes("--dry");
const grade = !process.argv.includes("--no-grade");
if (!sourceDir) {
  console.error(
    "usage: prepare-product-renders.mjs <source-dir> [--dry] [--no-grade]",
  );
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const names = Object.keys(MEASURED);
const results = [];
for (const name of names) {
  const file = path.join(sourceDir, `${name}.png`);
  if (!fs.existsSync(file)) {
    console.error(`MISSING SOURCE  ${name}.png`);
    process.exitCode = 1;
    continue;
  }
  results.push(await prepare(file, name, dry, grade));
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("render", 30) +
    pad("height", 9) +
    pad("driftX", 9) +
    pad("driftY", 9) +
    pad("KB", 6) +
    "bg",
);
for (const r of results)
  console.log(
    pad(r.name, 30) +
      pad(r.finalHeight.toFixed(3), 9) +
      pad(r.driftX.toFixed(3), 9) +
      pad(r.driftY.toFixed(3), 9) +
      pad(r.kb, 6) +
      `${r.lumaBefore} -> ${r.luma}`,
  );

for (const kind of ["vial", "pen"]) {
  const set = results.filter((r) => r.kind === kind);
  if (!set.length) continue;
  const h = set.map((r) => r.finalHeight);
  const l = set.map((r) => r.luma);
  const l0 = set.map((r) => r.lumaBefore);
  console.log(
    `\n${kind}: height ${Math.min(...h).toFixed(3)}–${Math.max(...h).toFixed(3)} ` +
      `(spread ${((Math.max(...h) - Math.min(...h)) * 100).toFixed(1)} pts), ` +
      `background luma ${Math.min(...l0)}–${Math.max(...l0)} -> ${Math.min(...l)}–${Math.max(...l)}, ` +
      `total ${set.reduce((a, r) => a + r.kb, 0)} KB`,
  );
}
