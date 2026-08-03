import type { CategorySlug } from "./categories";

/**
 * Pocket strips.
 *
 * An oral dissolvable film format presented alongside the vial catalogue.
 * Like everything else here it is a presentation record: no price, no
 * quantity, no purchasable unit.
 */

export interface Strip {
  slug: string;
  name: string;
  /** Compound or blend carried by the film. */
  compound: string;
  category: CategorySlug;
  /** True where the film carries more than one active compound. */
  isStack: boolean;
  loading: string;
  perBox: string;
  summary: string;
  image: string;
}

export const strips: Strip[] = [
  {
    slug: "bpc-157",
    name: "BPC-157 Oral Strip",
    compound: "BPC-157",
    category: "recovery",
    isStack: false,
    loading: "500 mcg / strip",
    perBox: "30 strips",
    summary:
      "The pentadecapeptide most examined in tissue-repair research, presented as a dissolvable film.",
    image: "/strips/bpc-157.jpg",
  },
  {
    slug: "cjc-ipamorelin",
    name: "CJC / Ipamorelin Oral Strip",
    compound: "CJC-1295 + Ipamorelin",
    category: "growth",
    isStack: true,
    loading: "300 mcg + 300 mcg / strip",
    perBox: "30 strips",
    summary:
      "Both routes into the somatotropic axis carried on one film — GHRH receptor and GHS-R1a.",
    image: "/strips/cjc-ipamorelin.jpg",
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu Oral Strip",
    compound: "GHK-Cu",
    category: "regeneration",
    isStack: false,
    loading: "2 mg / strip",
    perBox: "30 strips",
    summary:
      "The copper-binding tripeptide studied for matrix synthesis, in a moisture-controlled film.",
    image: "/strips/ghk-cu.jpg",
  },
  {
    slug: "regenerative-stack",
    name: "Regenerative Stack Oral Strip",
    compound: "GHK-Cu · TB-500 · BPC-157",
    category: "recovery",
    isStack: true,
    loading: "Multi-compound film",
    perBox: "30 strips",
    summary:
      "Three stages of the repair sequence — vascular supply, cell migration and matrix deposition — on a single film.",
    image: "/strips/regenerative-stack.jpg",
  },
  {
    slug: "nad-plus",
    name: "NAD+ Oral Strip",
    compound: "NAD+",
    category: "longevity",
    isStack: false,
    loading: "25 mg / strip",
    perBox: "30 strips",
    summary:
      "The redox cofactor consumed by sirtuins, PARPs and CD38, in a format that avoids reconstitution entirely.",
    image: "/strips/nad-plus.jpg",
  },
  {
    slug: "semax-selank",
    name: "Semax / Selank Oral Strip",
    compound: "Semax + Selank",
    category: "neuro",
    isStack: true,
    loading: "300 mcg + 300 mcg / strip",
    perBox: "30 strips",
    summary:
      "The two most documented regulatory neuropeptides, carried together for comparative work.",
    image: "/strips/semax-selank.jpg",
  },
  {
    slug: "metabolic-stack",
    name: "Metabolic Stack Oral Strip",
    compound: "MOTS-c · NAD+",
    category: "metabolism",
    isStack: true,
    loading: "Multi-compound film",
    perBox: "30 strips",
    summary:
      "Mitochondrial energy signalling alongside the cofactor pool it reports on.",
    image: "/strips/metabolic-stack.jpg",
  },
];

export const stripBySlug = new Map(strips.map((s) => [s.slug, s]));

/** How the film format is described, step by step. */
export const howItWorks = [
  {
    index: "01",
    title: "Tear & place",
    body: "Open the individually sealed sachet and place one film on the tongue.",
  },
  {
    index: "02",
    title: "Dissolve",
    body: "The film dissolves completely in 15–30 seconds. No water and no mixing.",
  },
  {
    index: "03",
    title: "Absorb",
    body: "Active compounds pass through the sublingual mucosa directly, rather than through the gut.",
  },
];

/** Why the format exists at all. */
export const advantages = [
  {
    index: "01",
    title: "Sublingual route",
    body: "The film delivers through the oral mucosa rather than the gastrointestinal tract, bypassing gastric acid and first-pass hepatic metabolism.",
  },
  {
    index: "02",
    title: "Pre-measured loading",
    body: "Each film carries a fixed load, established at manufacture. No reconstitution, no dilution arithmetic, no syringe.",
  },
  {
    index: "03",
    title: "Faster onset",
    body: "Absorption begins in the mouth, which shortens the interval between administration and systemic availability relative to an enteric route.",
  },
  {
    index: "04",
    title: "No cold chain",
    body: "Individually sealed and moisture-controlled. Stable at ambient temperature, which removes the custody problem that governs a lyophilised vial.",
  },
  {
    index: "05",
    title: "Portable format",
    body: "A sealed sachet fits in a wallet. The format was designed around the constraint that most research schedules are not conducted at a bench.",
  },
  {
    index: "06",
    title: "cGMP manufacture",
    body: "Produced under current good manufacturing practice using pharmaceutical film technology, with the same batch-level analytical record as the vials.",
  },
];

/** Format comparison — the reference's own four columns. */
export const comparison = {
  head: ["", "EVOHN Strips", "Capsules", "Powders", "Liposomal"],
  rows: [
    ["Rapid delivery", "✓", "—", "—", "~"],
    ["Sublingual route", "✓", "—", "—", "—"],
    ["Pre-calibrated load", "✓", "✓", "—", "~"],
    ["No water needed", "✓", "—", "—", "✓"],
    ["Ambient temperature", "✓", "✓", "—", "—"],
    ["No reconstitution", "✓", "✓", "—", "✓"],
  ],
};

export const stripStats = [
  { value: "30", label: "Strips per box" },
  { value: "15–30s", label: "Dissolve time" },
  { value: "cGMP", label: "Certified manufacturing" },
];
