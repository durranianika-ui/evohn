import type { NextConfig } from "next";

/**
 * GitHub Pages serves static files from a subpath and has no image
 * optimisation server, so the export build differs from the default one.
 * Set `GITHUB_PAGES=true` to produce it; `npm run dev` and a normal
 * `next build` are unaffected and keep full `next/image` optimisation.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "/evohn";

const nextConfig: NextConfig = isPages
  ? {
      output: "export",
      basePath,
      assetPrefix: basePath,
      // Directory-style URLs (/products/) so Pages resolves them without
      // a server rewrite.
      trailingSlash: true,
      // No optimisation endpoint on Pages — the source files in `public/`
      // are already compressed progressive JPEGs.
      images: { unoptimized: true },
      // Unoptimised images bypass the loader that would apply basePath,
      // so components prefix their own srcs from this.
      env: { NEXT_PUBLIC_BASE_PATH: basePath },
    }
  : {};

export default nextConfig;
