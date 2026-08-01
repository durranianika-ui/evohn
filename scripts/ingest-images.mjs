/**
 * Image ingest: download generated renders and emit optimized JPGs
 * into `public/`. Usage:
 *
 *   node scripts/ingest-images.mjs manifest.json
 *
 * where the manifest maps output paths (relative to public/) to source URLs.
 * Re-running is idempotent — files are overwritten in place.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error("Usage: node scripts/ingest-images.mjs <manifest.json>");
  process.exit(1);
}

const { default: manifest } = await import(
  path.resolve(manifestPath).startsWith("file:")
    ? path.resolve(manifestPath)
    : `file://${path.resolve(manifestPath)}`,
  { with: { type: "json" } }
);

for (const [publicRel, url] of Object.entries(manifest)) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAILED ${publicRel}: HTTP ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());

  const outPath = path.join(process.cwd(), "public", publicRel);
  await mkdir(path.dirname(outPath), { recursive: true });

  await writeFile(
    outPath,
    await sharp(buf)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true })
      .toBuffer(),
  );
  console.log(`OK ${publicRel}`);
}
