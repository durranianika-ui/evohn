import { products } from "@/data/products";
import { stacks } from "@/data/stacks";
import { strips } from "@/data/strips";
import { articles } from "@/data/journal";
import { labBatches } from "@/data/lab-results";
import { allFaqItems } from "@/data/faq";
import { legalDocuments } from "@/data/legal";
import { categories } from "@/data/categories";

/**
 * Site search.
 *
 * The index is built once from the same `data/` modules that render the
 * pages, so it can never describe a document the site does not serve. It is
 * a few hundred entries — small enough that a scored substring match beats
 * shipping a search library, and small enough to run on every keystroke
 * without a debounce budget.
 *
 * Scoring is deliberately blunt and explainable: an exact title match beats a
 * title prefix, which beats a title substring, which beats a keyword hit,
 * which beats a body hit. Kind weight breaks ties, so a compound outranks a
 * legal clause when both merely mention a word.
 */

export type SearchKind =
  | "Compound"
  | "Stack"
  | "Strip"
  | "Article"
  | "Batch"
  | "Domain"
  | "Question"
  | "Page"
  | "Legal";

export interface SearchDocument {
  id: string;
  kind: SearchKind;
  title: string;
  /** One line shown under the title in the results list. */
  description: string;
  href: string;
  /** Extra match surface — synonyms, codes, categories. Not displayed. */
  keywords: string[];
  /** Longer text, matched last and weighted lowest. */
  body?: string;
}

/** How much a kind is worth before any query is considered. */
const KIND_WEIGHT: Record<SearchKind, number> = {
  Compound: 6,
  Stack: 5,
  Strip: 5,
  Domain: 5,
  Article: 4,
  Batch: 3,
  Page: 3,
  Question: 2,
  Legal: 1,
};

/** Static destinations that are not generated from a data collection. */
const PAGES: SearchDocument[] = [
  {
    id: "page:catalogue",
    kind: "Page",
    title: "Catalogue",
    description: "Every compound in the reference library, filterable by domain.",
    href: "/catalogue",
    keywords: ["products", "compounds", "shop", "browse", "all"],
  },
  {
    id: "page:science",
    kind: "Page",
    title: "Science",
    description: "How quality is established, and the tools that support it.",
    href: "/science",
    keywords: ["research", "method", "analysis", "domains"],
  },
  {
    id: "page:calculator",
    kind: "Page",
    title: "Calculator",
    description:
      "Reconstitution, mix and blend arithmetic with the working shown.",
    href: "/calculator",
    keywords: [
      "reconstitution",
      "dilution",
      "concentration",
      "syringe",
      "units",
      "mix",
      "blend",
      "maths",
      "convert",
    ],
  },
  {
    id: "page:peptide-pedia",
    kind: "Page",
    title: "Peptide Pedia",
    description: "The reference library — searchable, cited, neutral.",
    href: "/peptide-pedia",
    keywords: ["encyclopedia", "reference", "library", "compendium", "pedia"],
  },
  {
    id: "page:reconstitution-guide",
    kind: "Page",
    title: "Reconstitution Guide",
    description:
      "Bringing lyophilised material into solution without degrading it.",
    href: "/reconstitution-guide",
    keywords: ["reconstitute", "bacteriostatic", "water", "solvent", "dissolve"],
  },
  {
    id: "page:storage-handling",
    kind: "Page",
    title: "Storage & Handling Guide",
    description: "Temperature, light, cycling, and the chemistry behind each rule.",
    href: "/storage-handling",
    keywords: ["fridge", "freezer", "cold chain", "stability", "degradation"],
  },
  {
    id: "page:quality",
    kind: "Page",
    title: "Quality",
    description: "The verification standard applied to every released batch.",
    href: "/quality",
    keywords: ["purity", "hplc", "mass spectrometry", "verification", "coa"],
  },
  {
    id: "page:lab-results",
    kind: "Page",
    title: "Lab Results",
    description: "Certificates of analysis for every released batch.",
    href: "/lab-results",
    keywords: ["coa", "certificate", "batch", "assay", "chromatogram"],
  },
  {
    id: "page:journal",
    kind: "Page",
    title: "Journal",
    description: "Writing from the research desk about method and evidence.",
    href: "/journal",
    keywords: ["blog", "articles", "writing", "editorial"],
  },
  {
    id: "page:reviews",
    kind: "Page",
    title: "Reviews",
    description: "What researchers report back about the material.",
    href: "/reviews",
    keywords: ["testimonials", "feedback", "ratings"],
  },
  {
    id: "page:about",
    kind: "Page",
    title: "About",
    description: "Why EVOHN exists and the standard it holds itself to.",
    href: "/about",
    keywords: ["company", "story", "mission", "team", "facility"],
  },
  {
    id: "page:contact",
    kind: "Page",
    title: "Contact",
    description: "Reach the research desk, the laboratory or the partners team.",
    href: "/contact",
    keywords: ["email", "enquiry", "whatsapp", "support", "get in touch"],
  },
  {
    id: "page:wholesale",
    kind: "Page",
    title: "Wholesale",
    description: "Distribution and resale enquiries.",
    href: "/wholesale",
    keywords: ["distribution", "reseller", "bulk", "trade", "partner"],
  },
  {
    id: "page:business-accounts",
    kind: "Page",
    title: "Business Accounts",
    description: "Accounts for laboratories, clinics and institutions.",
    href: "/business-accounts",
    keywords: ["institution", "laboratory", "clinic", "university", "b2b"],
  },
  {
    id: "page:stacks",
    kind: "Page",
    title: "Research Stacks",
    description: "Multi-compound groupings studied together in the literature.",
    href: "/stacks",
    keywords: ["protocol", "combination", "group"],
  },
  {
    id: "page:strips",
    kind: "Page",
    title: "Pocket Strips",
    description: "Oral dissolvable films — no reconstitution, no cold chain.",
    href: "/strips",
    keywords: ["film", "sublingual", "oral", "odf"],
  },
  {
    id: "page:faq",
    kind: "Page",
    title: "FAQ",
    description: "Common questions about the catalogue, testing and handling.",
    href: "/faq",
    keywords: ["questions", "help", "answers"],
  },
];

function buildIndex(): SearchDocument[] {
  const index: SearchDocument[] = [...PAGES];

  for (const product of products) {
    index.push({
      id: `product:${product.slug}`,
      kind: "Compound",
      title: product.name,
      description: product.summary,
      href: `/products/${product.slug}`,
      keywords: [
        ...product.alsoKnownAs,
        product.category,
        product.subtitle,
        product.dosage,
        product.specs.cas,
        product.specs.formula,
      ].filter(Boolean),
      body: product.description,
    });
  }

  for (const stack of stacks) {
    index.push({
      id: `stack:${stack.slug}`,
      kind: "Stack",
      title: stack.name,
      description: stack.tagline,
      href: `/stacks/${stack.slug}`,
      keywords: [stack.eyebrow, stack.category, ...stack.includes.map((c) => c.slug)],
      body: stack.scientificSummary,
    });
  }

  for (const strip of strips) {
    index.push({
      id: `strip:${strip.slug}`,
      kind: "Strip",
      title: strip.name,
      description: strip.summary,
      href: "/strips",
      keywords: [strip.compound, strip.category, strip.loading, "film", "oral"],
    });
  }

  for (const article of articles) {
    index.push({
      id: `article:${article.slug}`,
      kind: "Article",
      title: article.title,
      description: article.excerpt,
      href: `/journal/${article.slug}`,
      keywords: [article.topic, "journal", "article"],
    });
  }

  for (const category of categories) {
    index.push({
      id: `domain:${category.slug}`,
      kind: "Domain",
      title: category.name,
      description: category.tagline,
      href: `/catalogue?domain=${category.slug}`,
      keywords: [category.swatch, "domain", "category"],
      body: category.description,
    });
  }

  // One entry per batch: a batch number is the thing people actually paste
  // into a search box when they are holding a vial.
  for (const batch of labBatches) {
    const product = products.find((p) => p.slug === batch.product);
    index.push({
      id: `batch:${batch.batch}`,
      kind: "Batch",
      title: batch.batch,
      description: `${product?.name ?? batch.product} — ${batch.purity} purity, tested ${batch.tested} by ${batch.laboratory}.`,
      href: `/lab-results/${batch.product}`,
      keywords: [
        product?.name ?? "",
        batch.product,
        batch.laboratory,
        batch.accession,
        batch.current ? "current" : "superseded",
        "coa",
        "certificate",
      ].filter(Boolean),
    });
  }

  for (const item of allFaqItems) {
    index.push({
      id: `faq:${item.question.slice(0, 40)}`,
      kind: "Question",
      title: item.question,
      description: item.answer.slice(0, 160),
      href: "/faq",
      keywords: ["faq", "question"],
      body: item.answer,
    });
  }

  for (const doc of legalDocuments) {
    index.push({
      id: `legal:${doc.slug}`,
      kind: "Legal",
      title: doc.title,
      description: doc.summary,
      href: doc.path,
      keywords: ["legal", doc.label],
      body: doc.sections.map((s) => s.heading).join(" "),
    });
  }

  return index;
}

export const searchIndex = buildIndex();

export function normalise(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Score one document against one normalised query. 0 means "no match". */
export function scoreDocument(doc: SearchDocument, query: string) {
  const title = doc.title.toLowerCase();
  let score = 0;

  if (title === query) score = 100;
  else if (title.startsWith(query)) score = 70;
  else if (title.includes(query)) score = 50;
  else if (doc.keywords.some((k) => k.toLowerCase() === query)) score = 40;
  else if (doc.keywords.some((k) => k.toLowerCase().includes(query))) score = 25;
  else if (doc.description.toLowerCase().includes(query)) score = 14;
  else if (doc.body?.toLowerCase().includes(query)) score = 6;
  else return 0;

  return score + KIND_WEIGHT[doc.kind];
}

export interface SearchResult extends SearchDocument {
  score: number;
}

/**
 * Run a query. Multi-word queries require **every** term to match somewhere
 * in the document — an AND, not an OR, because an OR over a small index
 * returns the whole index.
 */
export function search(rawQuery: string, limit = 40): SearchResult[] {
  const query = normalise(rawQuery);
  if (query.length < 2) return [];

  const terms = query.split(" ");

  const results: SearchResult[] = [];
  for (const doc of searchIndex) {
    let total = 0;
    let matchedAll = true;

    for (const term of terms) {
      const score = scoreDocument(doc, term);
      if (score === 0) {
        matchedAll = false;
        break;
      }
      total += score;
    }

    if (matchedAll) results.push({ ...doc, score: total });
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

/** Result counts per kind, for the filter chips on /search. */
export function countByKind(results: SearchResult[]) {
  const counts = new Map<SearchKind, number>();
  for (const result of results) {
    counts.set(result.kind, (counts.get(result.kind) ?? 0) + 1);
  }
  return counts;
}
