import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getPresentation,
  productBySlug,
  products,
  renderFor,
} from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { stacks } from "@/data/stacks";
import { labBatches } from "@/data/lab-results";

/**
 * Catalogue integrity.
 *
 * The site previously listed products the approved catalogue does not sell,
 * classified two of them under the wrong domain, and showed the same compound
 * against different photography depending on which page you were looking at.
 * Each of those is a data invariant, so each gets an assertion here rather
 * than a note in a document nobody re-reads.
 */

/** The approved EVOHN Catalogue & Price List 2026, in catalogue order. */
const APPROVED = [
  "nad-plus",
  "retatrutide",
  "tesamorelin",
  "bpc-157-tb-500",
  "cjc-1295-ipamorelin",
  "mots-c",
  "ghk-cu",
  "semax",
  "selank",
  "snap-8",
  "melanotan-ii",
  "bacteriostatic-water",
];

const publicPath = (p: string) => path.join(process.cwd(), "public", p.slice(1));

describe("the approved catalogue", () => {
  it("lists exactly the supplied products, in the supplied order", () => {
    expect(products.map((p) => p.slug)).toEqual(APPROVED);
  });

  it("carries no product the supplied catalogue dropped", () => {
    for (const gone of ["semaglutide", "tirzepatide", "pt-141", "tb-500"]) {
      expect(productBySlug.has(gone)).toBe(false);
    }
  });
});

describe("classification", () => {
  it("files Retatrutide under Weight Loss, not Performance", () => {
    const reta = productBySlug.get("retatrutide");
    expect(reta?.category).toBe("weight-loss");
    expect(reta?.subtitle.startsWith("Weight Loss")).toBe(true);
  });

  it("files GHK-Cu under Longevity", () => {
    const ghk = productBySlug.get("ghk-cu");
    expect(ghk?.category).toBe("longevity");
    expect(ghk?.subtitle.startsWith("Longevity")).toBe(true);
  });

  it("gives every product a domain that exists", () => {
    for (const product of products) {
      expect(categoryBySlug.has(product.category)).toBe(true);
    }
  });

  it("keeps the visible subtitle in step with the underlying domain", () => {
    // Changing the label without changing the data is the bug that put
    // Retatrutide under Performance in the first place.
    for (const product of products) {
      const domain = categoryBySlug.get(product.category)!;
      expect(product.subtitle.startsWith(domain.name)).toBe(true);
    }
  });
});

describe("presentations", () => {
  it("offers every compound as both a vial and a pen", () => {
    for (const product of products) {
      expect(getPresentation(product, "vial")).toBeDefined();
      expect(getPresentation(product, "pen")).toBeDefined();
    }
  });

  it("resolves every render through the one mapping", () => {
    for (const product of products) {
      for (const presentation of product.presentations) {
        expect(presentation.image).toBe(
          renderFor(product.slug, presentation.kind),
        );
      }
    }
  });

  it("uses the vial render as the card image", () => {
    // One image per product per surface: the card, the catalogue tile and the
    // related-product tile all read `image`, so it has to be the same file the
    // product page leads with.
    for (const product of products) {
      expect(product.image).toBe(renderFor(product.slug, "vial"));
      expect(product.gallery[0]).toBe(product.image);
    }
  });
});

describe("assets", () => {
  it("ships every product render the dataset references", () => {
    for (const product of products) {
      for (const image of [...product.gallery, product.image]) {
        expect(existsSync(publicPath(image))).toBe(true);
      }
    }
  });

  it("leaves no render behind for a product that was removed", () => {
    for (const orphan of [
      "/products/semaglutide.webp",
      "/products/tirzepatide.webp",
      "/products/pt-141.webp",
      "/products/tb-500-bpc-157.webp",
    ]) {
      expect(existsSync(publicPath(orphan))).toBe(false);
    }
  });
});

describe("cross-references", () => {
  it("resolves every related product", () => {
    for (const product of products) {
      for (const slug of product.related) {
        expect(productBySlug.has(slug)).toBe(true);
      }
    }
  });

  it("resolves every compatibility note", () => {
    for (const product of products) {
      for (const entry of product.compatibility) {
        expect(productBySlug.has(entry.slug)).toBe(true);
      }
    }
  });

  it("never relates a product to itself", () => {
    for (const product of products) {
      expect(product.related).not.toContain(product.slug);
      expect(product.compatibility.map((c) => c.slug)).not.toContain(
        product.slug,
      );
    }
  });

  it("resolves every stack component", () => {
    for (const stack of stacks) {
      for (const component of stack.includes) {
        expect(productBySlug.has(component.slug)).toBe(true);
      }
    }
  });

  it("attaches every certificate to a product still in the catalogue", () => {
    for (const batch of labBatches) {
      expect(productBySlug.has(batch.product)).toBe(true);
    }
  });
});
