import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

// Gridded sheet: each render at a known size with a labelled 10% grid, so the
// product's extent can be read off directly and recorded.
const dir = process.argv[2];
const kind = process.argv[3];
const out = process.argv[4];
const from = Number(process.argv[5] ?? 0);
const count = Number(process.argv[6] ?? 6);
const CW = 330;
const CH = 412;
const COLS = 3;
const GAP = 28;

const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith(kind + "-"))
  .sort()
  .slice(from, from + count);

const rows = Math.ceil(files.length / COLS);
const comps = [];

function gridSvg(label) {
  let lines = "";
  for (let p = 10; p < 100; p += 10) {
    const x = (p / 100) * CW;
    const y = (p / 100) * CH;
    const major = p === 50;
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${CH}" stroke="${major ? "#00e0ff" : "#ff2d55"}" stroke-width="${major ? 1.4 : 0.7}" opacity="0.85"/>`;
    lines += `<line x1="0" y1="${y}" x2="${CW}" y2="${y}" stroke="${major ? "#00e0ff" : "#ffd60a"}" stroke-width="${major ? 1.4 : 0.7}" opacity="0.85"/>`;
    lines += `<text x="2" y="${y - 2}" font-family="monospace" font-size="11" fill="#ffd60a">${p}</text>`;
    lines += `<text x="${x + 2}" y="12" font-family="monospace" font-size="11" fill="#ff2d55">${p}</text>`;
  }
  return Buffer.from(
    `<svg width="${CW}" height="${CH}">${lines}<text x="4" y="${CH - 5}" font-family="monospace" font-size="13" fill="#00ff88">${label}</text></svg>`,
  );
}

for (let i = 0; i < files.length; i++) {
  const base = await sharp(path.join(dir, files[i]))
    .resize(CW, CH, { fit: "fill" })
    .png()
    .toBuffer();
  comps.push({
    input: await sharp(base)
      .composite([{ input: gridSvg(files[i].replace(/\.png$/, "")) }])
      .png()
      .toBuffer(),
    left: GAP + (i % COLS) * (CW + GAP),
    top: GAP + Math.floor(i / COLS) * (CH + GAP),
  });
}

await sharp({
  create: {
    width: COLS * CW + (COLS + 1) * GAP,
    height: rows * CH + (rows + 1) * GAP,
    channels: 3,
    background: { r: 20, g: 20, b: 22 },
  },
})
  .composite(comps)
  .png()
  .toFile(out);

console.log(files.join("\n"), "->", out);
