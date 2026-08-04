/**
 * Geometry comparison.
 *
 * Pixel diffing two sites with different branding, copy and photography tells
 * you almost nothing — every glyph differs, so the diff is uniformly hot. What
 * actually carries the brief is *relative* geometry: how tall each section is
 * in viewport multiples, where the gutters sit, how the type scales against
 * the viewport. Those survive a change of content, and those are what this
 * measures.
 *
 *   node scripts/audit-compare.mjs                       # reference structure
 *   node scripts/audit-compare.mjs --against evohn-after # side by side
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const load = async (t) =>
  JSON.parse(await readFile(path.join(ROOT, "audit", t, "geometry.json"), "utf8"));

const vhOf = (px, vh) => +(px / vh).toFixed(2);

function describe(vp) {
  const [, h] = vp.viewport;
  return vp.sections.map((s, i) => ({
    i,
    top: s.top,
    height: s.height,
    vh: vhOf(s.height, h),
    bg: s.bg,
    position: s.position,
    heading: s.heading,
    headingSize: s.headingSize,
  }));
}

const reference = await load(arg("reference", "roehn"));
const againstName = arg("against", null);
const against = againstName ? await load(againstName).catch(() => null) : null;

const lines = [];
const say = (s = "") => {
  lines.push(s);
  console.log(s);
};

for (const key of Object.keys(reference.viewports)) {
  const ref = reference.viewports[key];
  if (ref.error) continue;
  const cmp = against?.viewports?.[key];
  const [, vh] = ref.viewport;

  say(`\n=== ${key} ===`);
  say(
    `reference  doc=${ref.docHeight} (${vhOf(ref.docHeight, vh)}vh)  gutter=${ref.gutter}  overflowX=${ref.overflowX}`,
  );
  if (cmp && !cmp.error) {
    say(
      `evohn      doc=${cmp.docHeight} (${vhOf(cmp.docHeight, vh)}vh)  gutter=${cmp.gutter}  overflowX=${cmp.overflowX}`,
    );
  }

  const refRows = describe(ref);
  const cmpRows = cmp && !cmp.error ? describe(cmp) : [];

  say("");
  say(
    cmp
      ? " #  ref-vh  evo-vh   delta  ref-bg              heading"
      : " #  height    vh  bg                  position  heading",
  );
  const n = Math.max(refRows.length, cmpRows.length);
  for (let i = 0; i < n; i++) {
    const r = refRows[i];
    const c = cmpRows[i];
    if (cmp) {
      const delta = r && c ? (c.vh - r.vh).toFixed(2).padStart(6) : "     -";
      say(
        ` ${String(i).padEnd(2)} ${String(r?.vh ?? "-").padStart(6)}  ${String(c?.vh ?? "-").padStart(6)} ${delta}  ${(r?.bg ?? "-").padEnd(19)} ${(c?.heading ?? r?.heading ?? "").slice(0, 34)}`,
      );
    } else {
      say(
        ` ${String(i).padEnd(2)} ${String(r.height).padStart(6)} ${String(r.vh).padStart(5)}  ${r.bg.padEnd(19)} ${r.position.padEnd(9)} ${(r.heading ?? "").slice(0, 34)}`,
      );
    }
  }

  if (ref.sticky?.length) {
    say(`\n reference sticky/fixed inside main: ${ref.sticky.length}`);
    for (const s of ref.sticky.slice(0, 4)) {
      say(`   ${s.position.padEnd(7)} h=${String(s.h).padStart(5)} ${s.cls.slice(0, 52)}`);
    }
  }
  if (cmp?.sticky?.length) {
    say(` evohn sticky/fixed inside main: ${cmp.sticky.length}`);
    for (const s of cmp.sticky.slice(0, 4)) {
      say(`   ${s.position.padEnd(7)} h=${String(s.h).padStart(5)} ${s.cls.slice(0, 52)}`);
    }
  }

  const t = ref.type ?? {};
  const tc = cmp?.type ?? {};
  say("");
  for (const tag of ["h1", "h2", "h3"]) {
    if (!t[tag]) continue;
    const a = t[tag];
    const b = tc[tag];
    say(
      ` ${tag}  ref ${String(a.size).padStart(3)}px/${a.tracking.padStart(8)} ${a.family.padEnd(14)}` +
        (b ? `  evo ${String(b.size).padStart(3)}px/${b.tracking.padStart(8)} ${b.family}` : ""),
    );
  }
  if (ref.headerAtTop) {
    say(
      `\n header  ref h=${ref.headerAtTop.h} bg=${ref.headerAtTop.bg} backdrop=${ref.headerAtTop.backdrop}` +
        (cmp?.headerAtTop
          ? `\n         evo h=${cmp.headerAtTop.h} bg=${cmp.headerAtTop.bg} backdrop=${cmp.headerAtTop.backdrop}`
          : ""),
    );
  }
  if (cmp?.consoleErrors?.length) {
    say(`\n evohn console errors: ${cmp.consoleErrors.length}`);
    for (const e of cmp.consoleErrors.slice(0, 3)) say(`   ${e.slice(0, 110)}`);
  }
}

await writeFile(
  path.join(ROOT, "audit", "comparison.txt"),
  lines.join("\n"),
  "utf8",
);
console.log("\nWrote audit/comparison.txt");
