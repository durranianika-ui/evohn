import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Server-only check for whether a public asset is actually present.
 *
 * Photography is delivered separately from code. Rather than shipping broken
 * image requests while a shoot is outstanding, components ask this at render
 * time — which, for these statically generated routes, means build time — and
 * fall back to the vector product plate when a file is missing.
 *
 * Drop a real file into `public/` and it is picked up on the next build with
 * no code change.
 */
/**
 * Prefix a `public/` path with the deployment base path.
 *
 * `next/image` prepends `basePath` via the optimiser URL, but with
 * `unoptimized: true` (the static-export build) it emits `src` untouched —
 * so under a subpath deployment every photograph would 404. Routing image
 * sources through here keeps them correct in both builds.
 *
 * `hasAsset` deliberately does NOT use this: it resolves against the
 * filesystem, where the base path does not exist.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(publicPath: string) {
  return `${BASE_PATH}${publicPath}`;
}

export function hasAsset(publicPath: string) {
  if (!publicPath.startsWith("/")) return false;
  // Reject traversal before touching the filesystem.
  if (publicPath.includes("..")) return false;

  const absolute = path.join(process.cwd(), "public", publicPath.slice(1));
  return existsSync(absolute);
}

/**
 * Intrinsic width/height ratio of a `public/` WebP, read at build time.
 *
 * The supplied photography arrives in more than one framing (most vials are
 * ~4:5 portrait, two presentations are square), so any hard-coded frame
 * ratio letterboxes part of the catalogue. Layouts that must wrap an image
 * exactly ask for the real ratio here and fall back to their own default
 * when the file is missing or not WebP.
 */
export function imageAspect(publicPath: string): number | null {
  if (!publicPath.startsWith("/") || publicPath.includes("..")) return null;
  if (!publicPath.endsWith(".webp")) return null;

  const absolute = path.join(process.cwd(), "public", publicPath.slice(1));
  if (!existsSync(absolute)) return null;

  const buf = readFileSync(absolute);
  if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;

  const chunk = buf.toString("ascii", 12, 16);
  let width = 0;
  let height = 0;
  if (chunk === "VP8X") {
    width = 1 + buf.readUIntLE(24, 3);
    height = 1 + buf.readUIntLE(27, 3);
  } else if (chunk === "VP8 ") {
    width = buf.readUInt16LE(26) & 0x3fff;
    height = buf.readUInt16LE(28) & 0x3fff;
  } else if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    width = (bits & 0x3fff) + 1;
    height = ((bits >>> 14) & 0x3fff) + 1;
  }
  return width > 0 && height > 0 ? width / height : null;
}
