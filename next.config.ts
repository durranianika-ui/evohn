import type { NextConfig } from "next";

/**
 * GitHub Pages serves static files from a subpath and has no image
 * optimisation server, so the export build differs from the default one.
 * Set `GITHUB_PAGES=true` to produce it; `npm run dev` and a normal
 * `next build` are unaffected and keep full `next/image` optimisation.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "/evohn";

/**
 * Both loopback spellings are the same server, but the dev origin check treats
 * them as different hosts: a page opened on `localhost` requesting a chunk
 * from `127.0.0.1` (or the reverse) had every one of those chunks answered
 * with 403. The audit harness and the Playwright projects address the server
 * by IP while the browser pane opens it by name, so both have to be allowed
 * or the e2e "no failed requests" assertion fails on a dev-server artefact.
 * Development only — `output: "export"` ships no server at all.
 */
const allowedDevOrigins = ["127.0.0.1", "localhost"];

const nextConfig: NextConfig = isPages
  ? {
      allowedDevOrigins,
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
  : { allowedDevOrigins };

export default nextConfig;
