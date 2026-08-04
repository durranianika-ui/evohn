/**
 * Reads a motion.json and prints what actually moves, per block.
 *
 *   node scripts/audit-motion-report.mjs --target roehn [--block 6]
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, f) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : f;
};

const target = arg("target", "roehn");
const only = arg("block", null);
const data = JSON.parse(
  await readFile(path.join(ROOT, "audit", target, "motion.json"), "utf8"),
);

const byId = new Map(data.watched.map((w) => [w.id, w]));
const track = new Map();
for (const frame of data.frames) {
  for (const s of frame.sample) {
    if (!track.has(s.id)) track.set(s.id, []);
    track.get(s.id).push({ stop: frame.stop, ...s });
  }
}

/** Pull the translate/scale out of a matrix so a range is readable. */
function decompose(t) {
  if (!t || t === "none") return { x: 0, y: 0, sx: 1, sy: 1 };
  const m = t.match(/matrix(3d)?\(([^)]+)\)/);
  if (!m) return { x: 0, y: 0, sx: 1, sy: 1 };
  const v = m[2].split(",").map(Number);
  return m[1]
    ? { x: v[12], y: v[13], sx: v[0], sy: v[5] }
    : { x: v[4], y: v[5], sx: v[0], sy: v[3] };
}

const rows = [];
for (const [id, samples] of track) {
  const meta = byId.get(id);
  if (!meta) continue;
  if (only !== null && String(meta.block) !== String(only)) continue;

  const dx = samples.map((s) => decompose(s.t).x);
  const dy = samples.map((s) => decompose(s.t).y);
  const sc = samples.map((s) => decompose(s.t).sx);
  const op = samples.map((s) => s.o);
  const range = (a) => +(Math.max(...a) - Math.min(...a)).toFixed(1);
  const moved = { x: range(dx), y: range(dy), scale: +range(sc).toFixed(3), opacity: +range(op).toFixed(2) };
  if (
    moved.x < 2 &&
    moved.y < 2 &&
    moved.scale < 0.01 &&
    moved.opacity < 0.05 &&
    meta.position !== "sticky"
  )
    continue;

  rows.push({ meta, moved, samples });
}

rows.sort((a, b) => a.meta.block - b.meta.block || b.moved.y - a.moved.y);

let block = -1;
for (const r of rows) {
  if (r.meta.block !== block) {
    block = r.meta.block;
    console.log(`\n===== block ${block} =====`);
  }
  const m = r.moved;
  console.log(
    `${r.meta.position.padEnd(8)} ${String(r.meta.w).padStart(4)}x${String(r.meta.h).padStart(4)}  ` +
      `dx=${String(m.x).padStart(6)} dy=${String(m.y).padStart(6)} scale=${String(m.scale).padStart(5)} op=${String(m.opacity).padStart(4)}  ` +
      `top=${r.meta.top}  ${r.meta.cls}`,
  );
  if (r.meta.transition && !r.meta.transition.startsWith("all 0s"))
    console.log(`         transition: ${r.meta.transition}`);
}

console.log("\n===== hover =====");
for (const h of data.hovers) {
  const keys = Object.keys(h.changed);
  if (!keys.length) continue;
  console.log(`${h.tag} ${h.cls}`);
  for (const k of keys) console.log(`   ${k}: ${JSON.stringify(h.changed[k])}`);
}
