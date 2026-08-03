import { categories, getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import type { Article } from "@/data/journal";
import type { Stack } from "@/data/stacks";
import { allFaqItems } from "@/data/faq";
import { site } from "@/data/site";

/**
 * JSON-LD builders.
 *
 * Products are described with schema.org/Product but deliberately carry NO
 * `offers` node: this is a catalogue, not a store, and advertising an offer
 * without a price or availability would be both incorrect and a structured
 * data violation.
 */

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    email: site.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: site.whatsapp,
      availableLanguage: ["en"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { "@type": "Organization", name: site.name },
  };
}

export function productSchema(product: Product) {
  const category = getCategory(product.category);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    category: category.name,
    url: `${site.url}/catalogue/${product.slug}`,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@type": "Organization", name: site.name },
    additionalProperty: [
      { "@type": "PropertyValue", name: "CAS Number", value: product.specs.cas },
      { "@type": "PropertyValue", name: "Molecular Formula", value: product.specs.formula },
      { "@type": "PropertyValue", name: "Molar Mass", value: product.specs.molarMass },
      { "@type": "PropertyValue", name: "Purity", value: product.specs.purity },
      { "@type": "PropertyValue", name: "Form", value: product.specs.form },
      { "@type": "PropertyValue", name: "Presentation", value: product.dosage },
    ],
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Journal entries are Articles, not blog posts — the distinction matters to
 * how they are surfaced, and the content is reference writing rather than
 * news. No `image` node is emitted while photography is outstanding.
 */
export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `${site.url}/journal/${article.slug}`,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    isAccessibleForFree: true,
  };
}

/**
 * A stack is described as an ItemList of the compounds it groups. Modelling
 * it as a Product would imply a purchasable unit, which it is not.
 */
export function stackSchema(stack: Stack) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: stack.name,
    description: stack.tagline,
    url: `${site.url}/stacks/${stack.slug}`,
    numberOfItems: stack.includes.length,
    itemListElement: stack.includes.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/catalogue/${entry.slug}`,
    })),
  };
}

export function catalogueSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${site.name} Catalogue`,
    url: `${site.url}/catalogue`,
    description: site.description,
    hasPart: categories.map((category) => ({
      "@type": "CollectionPage",
      name: category.name,
      url: `${site.url}/categories/${category.slug}`,
      description: category.description,
    })),
  };
}
