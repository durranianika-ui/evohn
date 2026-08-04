import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/** Emitted once at build time — required under `output: "export"`. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The two utility surfaces hold nothing a crawler should keep: /search
    // renders a query the visitor typed, /enquiry renders their own local
    // selection. Both are also `noindex` at the page level.
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/enquiry"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
