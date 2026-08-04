#!/usr/bin/env node
/**
 * End-to-end integrity check over the built static export.
 *
 * This is the site's end-to-end test. There is no server, no session and no
 * database — the deployable artefact is a directory of HTML — so the honest
 * end-to-end assertion is made against that directory rather than against a
 * browser driving a mock of it.
 *
 * It checks, for every emitted page:
 *
 *   1. Every internal href resolves to a file that was actually built.
 *   2. No href is a dead anchor (`#`) or a `javascript:` no-op.
 *   3. No reference-site brand, domain or asset survived anywhere.
 *   4. Every page has a title, a description and a canonical.
 *   5. Every page has exactly one <h1>.
 *   6. Every <img> carries an alt attribute (empty is valid for decoration).
 *   7. Every route the registry declares was emitted.
 *   8. The sitemap lists the indexable routes and excludes the utility ones.
 *
 * Usage:  node scripts/check-export.mjs [outDir]
 * Build the export first:  GITHUB_PAGES=true PAGES_BASE_PATH= npm run build
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "out");

/** Brands, domains and identifiers that must not appear in the output. */
const FORBIDDEN = [
  /roehn/i,
  /reviva/i,
  // Analytics identifiers inherited from a template or a reference site.
  /\bUA-\d{4,}/,
  /\bG-[A-Z0-9]{8,}\b/,
  /\bGTM-[A-Z0-9]{4,}\b/,
];

const failures = [];
const warnings = [];
let pagesChecked = 0;

function fail(file, message) {
  failures.push(`${path.relative(OUT, file) || "."}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${path.relative(OUT, file) || "."}: ${message}`);
}

/** Every .html file under the export. */
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
 * Resolve an internal href to a path on disk.
 *
 * The export uses `trailingSlash: true`, so `/terms` is `out/terms/index.html`.
 * A file reference (`/coa/x.pdf`) resolves directly.
 */
function resolveHref(href, basePath) {
  let target = href.split(/[?#]/)[0];
  if (target === "") return null; // pure fragment — same page
  if (basePath && target.startsWith(basePath)) {
    target = target.slice(basePath.length) || "/";
  }
  if (target === "/") return path.join(OUT, "index.html");

  const clean = target.replace(/^\/+|\/+$/g, "");
  const asDir = path.join(OUT, clean, "index.html");
  const asFile = path.join(OUT, clean);
  const asHtml = path.join(OUT, `${clean}.html`);

  if (existsSync(asDir)) return asDir;
  if (existsSync(asHtml)) return asHtml;
  if (existsSync(asFile)) return asFile;
  return asDir; // report the canonical form in the error
}

async function main() {
  try {
    await stat(OUT);
  } catch {
    console.error(
      `\nNo export found at ${OUT}.\n` +
        `Build one first:\n\n  GITHUB_PAGES=true PAGES_BASE_PATH= npm run build\n`,
    );
    process.exit(1);
  }

  const files = await htmlFiles(OUT);
  if (!files.length) {
    console.error(`No HTML files under ${OUT}.`);
    process.exit(1);
  }

  // The base path the export was built with, read from any emitted asset URL.
  const firstHtml = await readFile(files[0], "utf8");
  const baseMatch = firstHtml.match(/href="(\/[^"/]+)\/_next\//);
  const basePath = baseMatch ? baseMatch[1] : "";

  for (const file of files) {
    const html = await readFile(file, "utf8");
    pagesChecked += 1;

    /* --- 3. Reference-site residue ------------------------------------- */
    for (const pattern of FORBIDDEN) {
      const hit = html.match(pattern);
      if (hit) fail(file, `contains forbidden token "${hit[0]}"`);
    }

    /* --- 4. Metadata ---------------------------------------------------- */
    if (!/<title>[^<]+<\/title>/.test(html)) {
      fail(file, "has no <title>");
    }
    if (!/<meta name="description" content="[^"]+"/.test(html)) {
      fail(file, "has no meta description");
    }
    if (!/<link rel="canonical"/.test(html)) {
      warn(file, "has no canonical link");
    }

    /* --- 5. One h1 ------------------------------------------------------ */
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length === 0) fail(file, "has no <h1>");
    if (h1s.length > 1) fail(file, `has ${h1s.length} <h1> elements`);

    /* --- 6. Image alt text ---------------------------------------------- */
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\balt=/.test(img)) {
        fail(file, `an <img> has no alt attribute: ${img.slice(0, 90)}…`);
      }
    }

    /* --- 1 & 2. Links --------------------------------------------------- */
    for (const match of html.matchAll(/<a\b[^>]*?href="([^"]*)"/g)) {
      const href = match[1];

      if (href === "#" || href.startsWith("javascript:")) {
        fail(file, `dead link: href="${href}"`);
        continue;
      }
      // External and protocol links are out of scope for a file check.
      if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
      if (href.startsWith("#")) continue;

      if (!href.startsWith("/")) {
        warn(file, `relative href not checked: "${href}"`);
        continue;
      }

      const resolved = resolveHref(href, basePath);
      if (resolved && !existsSync(resolved)) {
        fail(file, `broken link "${href}" → ${path.relative(OUT, resolved)}`);
      }
    }
  }

  /* --- 7. Every registered route was emitted ---------------------------- */
  // Read the registry as text: this script runs on plain Node with no
  // TypeScript loader, and a regex over a literal list is enough.
  const registry = await readFile(
    path.resolve("data/routes.ts"),
    "utf8",
  ).catch(() => "");
  const declared = Array.from(registry.matchAll(/path:\s*"([^"]+)"/g)).map(
    (m) => m[1],
  );

  for (const route of declared) {
    const expected =
      route === "/"
        ? path.join(OUT, "index.html")
        : path.join(OUT, route.replace(/^\//, ""), "index.html");
    if (!existsSync(expected)) {
      failures.push(
        `registry declares ${route} but ${path.relative(OUT, expected)} was not emitted`,
      );
    }
  }

  /* --- 8. Sitemap ------------------------------------------------------- */
  const sitemapPath = path.join(OUT, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    const sitemap = await readFile(sitemapPath, "utf8");
    for (const utility of ["/search", "/enquiry"]) {
      if (sitemap.includes(`${utility}<`) || sitemap.includes(`${utility}/<`)) {
        failures.push(`sitemap.xml lists the noindex route ${utility}`);
      }
    }
    for (const route of declared) {
      if (route === "/search" || route === "/enquiry") continue;
      const needle = route === "/" ? "</loc>" : `${route}<`;
      if (!sitemap.includes(needle)) {
        warnings.push(`sitemap.xml does not list ${route}`);
      }
    }
  } else {
    warnings.push("no sitemap.xml in the export");
  }

  /* --- Report ----------------------------------------------------------- */
  console.log(`\nChecked ${pagesChecked} pages in ${path.relative(process.cwd(), OUT)}`);
  console.log(`Registry declares ${declared.length} static routes`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 30)) console.log(`  · ${w}`);
    if (warnings.length > 30) {
      console.log(`  … and ${warnings.length - 30} more`);
    }
  }

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const f of failures.slice(0, 60)) console.error(`  ✗ ${f}`);
    if (failures.length > 60) {
      console.error(`  … and ${failures.length - 60} more`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("\nAll checks passed.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
