import { existsSync } from "node:fs";
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
