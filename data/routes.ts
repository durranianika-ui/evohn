/**
 * The route registry.
 *
 * Every address the site answers on that is *not* generated from a data
 * collection is declared here exactly once. The sitemap reads it, the link
 * checker reads it, and the navigation tests assert against it — so a route
 * cannot be added to the menu without also appearing in the sitemap, and a
 * link cannot point at an address that was never built.
 *
 * Dynamic segments (`/products/[slug]`, `/journal/[slug]`, `/stacks/[slug]`,
 * `/lab-results/[slug]`) are generated from `data/` and are appended by the
 * sitemap at build time; they are deliberately absent from this list.
 */

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface StaticRoute {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  /** Kept out of the sitemap and marked `noindex` — utility surfaces. */
  noindex?: boolean;
}

export const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },

  /* --- Catalogue -------------------------------------------------------- */
  { path: "/catalogue", changeFrequency: "weekly", priority: 0.9 },
  { path: "/stacks", changeFrequency: "monthly", priority: 0.85 },
  { path: "/strips", changeFrequency: "monthly", priority: 0.85 },

  /* --- Science ---------------------------------------------------------- */
  { path: "/science", changeFrequency: "monthly", priority: 0.85 },
  { path: "/calculator", changeFrequency: "yearly", priority: 0.75 },
  { path: "/peptide-pedia", changeFrequency: "weekly", priority: 0.8 },
  { path: "/reconstitution-guide", changeFrequency: "yearly", priority: 0.75 },
  { path: "/storage-handling", changeFrequency: "yearly", priority: 0.75 },
  { path: "/quality", changeFrequency: "monthly", priority: 0.8 },
  { path: "/lab-results", changeFrequency: "weekly", priority: 0.9 },

  /* --- Editorial and trust ---------------------------------------------- */
  { path: "/journal", changeFrequency: "weekly", priority: 0.85 },
  { path: "/reviews", changeFrequency: "monthly", priority: 0.6 },

  /* --- Company ---------------------------------------------------------- */
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/wholesale", changeFrequency: "yearly", priority: 0.6 },
  { path: "/business-accounts", changeFrequency: "yearly", priority: 0.6 },

  /* --- Legal ------------------------------------------------------------
     Eight separately addressable documents plus their index. Each is its own
     route so a specific clause can be linked to, cited and dated.           */
  { path: "/legal", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/shipping", changeFrequency: "yearly", priority: 0.3 },
  { path: "/returns", changeFrequency: "yearly", priority: 0.3 },
  { path: "/platform-use", changeFrequency: "yearly", priority: 0.3 },
  { path: "/age-verification", changeFrequency: "yearly", priority: 0.3 },
  { path: "/research-use-only", changeFrequency: "yearly", priority: 0.4 },
  { path: "/research-disclaimer", changeFrequency: "yearly", priority: 0.4 },

  /* --- Utility ----------------------------------------------------------
     A search results page and a private enquiry list have nothing a crawler
     should hold, so both stay out of the index and out of the sitemap.      */
  { path: "/search", changeFrequency: "never", priority: 0.1, noindex: true },
  { path: "/enquiry", changeFrequency: "never", priority: 0.1, noindex: true },
];

/** Everything a crawler should see. */
export const indexableRoutes = staticRoutes.filter((r) => !r.noindex);

/** Flat path list — used by the link checker to resolve every internal href. */
export const staticRoutePaths = staticRoutes.map((r) => r.path);
