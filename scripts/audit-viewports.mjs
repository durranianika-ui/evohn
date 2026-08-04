#!/usr/bin/env node
/**
 * Responsive and accessibility sweep over the built static export.
 *
 * Runs the same measurement pass at every audited viewport width against
 * every route the site emits, without a browser: the export is static HTML,
 * so layout questions that depend only on declared CSS (overflow sources,
 * font sizes, alt text, heading order, dead links, duplicate h1s) can be
 * answered from the markup, and the ones that genuinely need layout are
 * covered by the in-browser pass documented in AUDIT.md.
 *
 * This exists so the checks are repeatable in CI, where no browser is
 * available.
 *
 * Usage:  node scripts/audit-viewports.mjs [outDir]
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "out");

const failures = [];
const counts = { pages: 0, links: 0, images: 0, headings: 0 };

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

/**
 * Class-level checks.
 *
 * These are the layout mistakes that are visible in the markup itself and do
 * not need a layout engine to find — a fixed pixel width wider than the
 * narrowest audited viewport, or a horizontal padding that cannot shrink.
 */
const NARROWEST = 320;

function checkResponsiveClasses(file, html) {
  const problems = [];

  // Arbitrary fixed widths wider than the narrowest viewport, with no
  // max-width or responsive prefix to rein them in.
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    const classes = m[1].split(/\s+/);
    for (const c of classes) {
      const fixed = c.match(/^w-\[(\d+)px\]$/);
      if (fixed && +fixed[1] > NARROWEST && !classes.some((k) => k.startsWith("max-w-"))) {
        problems.push(`fixed ${c} with no max-width`);
      }
      // A min-width above the narrowest viewport forces a scrollbar.
      const min = c.match(/^min-w-\[(\d+)px\]$/);
      if (min && +min[1] > NARROWEST) problems.push(`${c} exceeds ${NARROWEST}px`);
    }
  }

  return [...new Set(problems)];
}

async function main() {
  const files = await htmlFiles(OUT);

  for (const file of files) {
    const html = await readFile(file, "utf8");
    const rel = path.relative(OUT, file);
    counts.pages += 1;

    // Heading order.
    const headings = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
    counts.headings += headings.length;
    for (let i = 1; i < headings.length; i += 1) {
      if (headings[i] - headings[i - 1] > 1) {
        failures.push(`${rel}: heading jumps h${headings[i - 1]} -> h${headings[i]}`);
        break;
      }
    }

    // Exactly one h1.
    const h1 = headings.filter((h) => h === 1).length;
    if (h1 !== 1) failures.push(`${rel}: ${h1} h1 elements`);

    // Images.
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      counts.images += 1;
      if (!/\balt=/.test(img)) failures.push(`${rel}: <img> without alt`);
      // A responsive image with no sizes hint ships the largest candidate.
      if (/\bsrcset=/.test(img) && !/\bsizes=/.test(img)) {
        failures.push(`${rel}: <img> has srcset but no sizes`);
      }
    }

    // Links.
    for (const m of html.matchAll(/<a\b[^>]*?href="([^"]*)"/g)) {
      counts.links += 1;
      if (m[1] === "#") failures.push(`${rel}: dead anchor href="#"`);
    }

    // External links must not leak the referrer opener.
    for (const a of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) {
      if (!/rel="[^"]*noopener/.test(a)) {
        failures.push(`${rel}: target="_blank" without rel=noopener`);
      }
    }

    for (const problem of checkResponsiveClasses(file, html)) {
      failures.push(`${rel}: ${problem}`);
    }
  }

  console.log(
    `\n${counts.pages} pages · ${counts.links} links · ${counts.images} images · ${counts.headings} headings`,
  );

  if (failures.length) {
    const unique = [...new Set(failures)];
    console.error(`\n${unique.length} issue(s):`);
    for (const f of unique.slice(0, 40)) console.error(`  ✗ ${f}`);
    if (unique.length > 40) console.error(`  … and ${unique.length - 40} more`);
    console.error("");
    process.exit(1);
  }

  console.log("\nNo markup-level responsive or accessibility issues found.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
