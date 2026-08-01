/**
 * Category system.
 * Colours map 1:1 to Brand Identity Kit §02 "PRODUCT COLORS" and §05
 * "PRODUCT RANGE — COLOR SYSTEM". `token` resolves to a CSS custom property
 * declared in globals.css, so the palette is never duplicated in markup.
 */

export type CategorySlug =
  | "weight-loss"
  | "longevity"
  | "recovery"
  | "performance"
  | "metabolism"
  | "growth"
  | "neuro"
  | "regeneration";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Kit's own name for the label colour. */
  swatch: string;
  token: string;
  /** True when the swatch is light enough to require dark text on top. */
  swatchIsLight: boolean;
  tagline: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "weight-loss",
    name: "Weight Loss",
    swatch: "Black",
    token: "var(--color-cat-weight-loss)",
    swatchIsLight: false,
    tagline: "Incretin signalling",
    description:
      "Glucagon-like peptide-1 analogues and incretin mimetics characterised in the literature for their action on appetite regulation and glucose-dependent insulinotropic pathways.",
  },
  {
    slug: "recovery",
    name: "Recovery",
    swatch: "Brown",
    token: "var(--color-cat-recovery)",
    swatchIsLight: false,
    tagline: "Tissue repair",
    description:
      "Cytoprotective and angiogenic peptides examined for their role in soft-tissue repair, extracellular matrix organisation and musculoskeletal recovery models.",
  },
  {
    slug: "longevity",
    name: "Longevity",
    swatch: "Ivory",
    token: "var(--color-cat-longevity)",
    swatchIsLight: true,
    tagline: "Cellular energetics",
    description:
      "Coenzymes and redox-active compounds investigated for their function in mitochondrial metabolism, sirtuin activity and cellular ageing biochemistry.",
  },
  {
    slug: "performance",
    name: "Performance",
    swatch: "Graphite",
    token: "var(--color-cat-performance)",
    swatchIsLight: false,
    tagline: "Multi-receptor agonism",
    description:
      "Multi-receptor agonists and centrally-acting compounds studied across metabolic, melanocortin and neuroendocrine signalling pathways.",
  },
  {
    slug: "metabolism",
    name: "Metabolism",
    swatch: "Graphite",
    token: "var(--color-cat-metabolism)",
    swatchIsLight: false,
    tagline: "Mitochondrial signalling",
    description:
      "Mitochondrial-derived peptides examined for their role in metabolic homeostasis, AMPK activation and cellular energy regulation.",
  },
  {
    slug: "growth",
    name: "Growth",
    swatch: "Sand",
    token: "var(--color-cat-growth)",
    swatchIsLight: true,
    tagline: "Somatotropic axis",
    description:
      "Growth hormone-releasing analogues and selective secretagogues characterised for their action on the somatotropic axis and pulsatile secretion patterns.",
  },
  {
    slug: "neuro",
    name: "Neuro",
    swatch: "Slate Grey",
    token: "var(--color-cat-neuro)",
    swatchIsLight: false,
    tagline: "Neuropeptide pathways",
    description:
      "Regulatory neuropeptides investigated for their action on neurotrophic factor expression, monoaminergic signalling and neuroprotective pathways.",
  },
  {
    slug: "regeneration",
    name: "Regeneration",
    swatch: "Brown",
    token: "var(--color-cat-regeneration)",
    swatchIsLight: false,
    tagline: "Matrix remodelling",
    description:
      "Copper-binding and matrix-active peptides examined for their role in collagen synthesis, dermal barrier integrity and extracellular matrix remodelling.",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: CategorySlug): Category {
  const category = categoryBySlug.get(slug);
  if (!category) throw new Error(`Unknown category: ${slug}`);
  return category;
}
