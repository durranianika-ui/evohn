import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { stacks } from "@/data/stacks";
import { articles } from "@/data/journal";
import { labBatches } from "@/data/lab-results";
import { site } from "@/data/site";
import { indexableRoutes } from "@/data/routes";

/**
 * Dynamic sitemap.
 * New compounds, stacks and journal entries appear automatically — the data
 * layer is the only place a route is registered.
 */
/** Emitted once at build time — required under `output: "export"`. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-03");

  // Registered once in `data/routes.ts`; noindex utility routes are excluded.
  const staticRoutes: MetadataRoute.Sitemap = indexableRoutes.map((route) => ({
    url: route.path === "/" ? site.url : `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${site.url}/products/${product.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const stackRoutes: MetadataRoute.Sitemap = stacks.map((stack) => ({
    url: `${site.url}/stacks/${stack.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site.url}/journal/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "yearly",
    priority: 0.65,
  }));

  // One page per documented compound, not per batch.
  const labRoutes: MetadataRoute.Sitemap = Array.from(
    new Set(labBatches.map((b) => b.product)),
  ).map((slug) => ({
    url: `${site.url}/lab-results/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...stackRoutes,
    ...articleRoutes,
    ...labRoutes,
  ];
}
