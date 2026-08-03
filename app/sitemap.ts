import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { stacks } from "@/data/stacks";
import { articles } from "@/data/journal";
import { sciencePages } from "@/data/science";
import { labBatches } from "@/data/lab-results";
import { site } from "@/data/site";

/**
 * Dynamic sitemap.
 * New compounds, stacks, journal entries and science pages appear
 * automatically — the data layer is the only place a route is registered.
 */
/** Emitted once at build time — required under `output: "export"`. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-03");

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: site.url, changeFrequency: "monthly", priority: 1 },
      { url: `${site.url}/catalogue`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${site.url}/stacks`, changeFrequency: "monthly", priority: 0.85 },
      { url: `${site.url}/science`, changeFrequency: "monthly", priority: 0.8 },
      {
        url: `${site.url}/science/calculator`,
        changeFrequency: "yearly",
        priority: 0.6,
      },
      {
        url: `${site.url}/science/compound-index`,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      { url: `${site.url}/journal`, changeFrequency: "weekly", priority: 0.85 },
      {
        url: `${site.url}/lab-results`,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      { url: `${site.url}/reviews`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.7 },
      { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
      { url: `${site.url}/legal`, changeFrequency: "yearly", priority: 0.3 },
    ] satisfies MetadataRoute.Sitemap
  ).map((route) => ({ ...route, lastModified }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${site.url}/categories/${category.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${site.url}/catalogue/${product.slug}`,
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

  const scienceRoutes: MetadataRoute.Sitemap = sciencePages.map((page) => ({
    url: `${site.url}/science/${page.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
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
    ...categoryRoutes,
    ...productRoutes,
    ...stackRoutes,
    ...articleRoutes,
    ...scienceRoutes,
    ...labRoutes,
  ];
}
