import { describe, expect, it } from "vitest";
import { countByKind, normalise, search, searchIndex } from "@/lib/search";
import { products } from "@/data/products";
import { articles } from "@/data/journal";
import { labBatches } from "@/data/lab-results";
import { legalDocuments } from "@/data/legal";

describe("search index", () => {
  it("covers every compound", () => {
    for (const product of products) {
      expect(
        searchIndex.some((d) => d.href === `/products/${product.slug}`),
      ).toBe(true);
    }
  });

  it("covers every journal entry", () => {
    for (const article of articles) {
      expect(
        searchIndex.some((d) => d.href === `/journal/${article.slug}`),
      ).toBe(true);
    }
  });

  it("covers every batch, so a vial label can be pasted in", () => {
    for (const batch of labBatches) {
      expect(searchIndex.some((d) => d.title === batch.batch)).toBe(true);
    }
  });

  it("covers every legal document", () => {
    for (const doc of legalDocuments) {
      expect(searchIndex.some((d) => d.href === doc.path)).toBe(true);
    }
  });

  it("has no duplicate ids", () => {
    const ids = searchIndex.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every entry a title, a description and an href", () => {
    for (const doc of searchIndex) {
      expect(doc.title.trim()).not.toBe("");
      expect(doc.description.trim()).not.toBe("");
      expect(doc.href.startsWith("/")).toBe(true);
    }
  });

  it("never points at a reference site", () => {
    for (const doc of searchIndex) {
      expect(doc.href).not.toMatch(/roehn|reviva/i);
    }
  });
});

describe("query handling", () => {
  it("normalises case and collapses whitespace", () => {
    expect(normalise("  Semaglutide   Peptide ")).toBe("semaglutide peptide");
  });

  it("returns nothing for a query below two characters", () => {
    expect(search("")).toEqual([]);
    expect(search("s")).toEqual([]);
    expect(search("  ")).toEqual([]);
  });

  it("finds a compound by its exact name", () => {
    const results = search("semaglutide");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].href).toBe("/products/semaglutide");
  });

  it("is case-insensitive", () => {
    expect(search("SEMAGLUTIDE")[0].href).toBe(
      search("semaglutide")[0].href,
    );
  });

  it("finds a compound by an alternative designation", () => {
    // Every product carries its literature synonyms as keywords.
    const withAliases = products.find((p) => p.alsoKnownAs.length > 0);
    expect(withAliases).toBeDefined();
    const alias = withAliases!.alsoKnownAs[0];
    const results = search(alias);
    expect(results.some((r) => r.href === `/products/${withAliases!.slug}`)).toBe(
      true,
    );
  });

  it("finds a batch by its number", () => {
    const batch = labBatches[0];
    const results = search(batch.batch);
    expect(results[0].title).toBe(batch.batch);
    expect(results[0].kind).toBe("Batch");
  });

  it("ranks an exact title match above a body mention", () => {
    const results = search("calculator");
    expect(results[0].title.toLowerCase()).toBe("calculator");
  });

  it("requires every term of a multi-word query to match", () => {
    // A term that matches nothing eliminates the document entirely, rather
    // than being ORed in and returning the whole index.
    expect(search("semaglutide zzzzqqq")).toEqual([]);
  });

  it("returns nothing for a query that matches nothing", () => {
    expect(search("qqqzzzxxwv")).toEqual([]);
  });

  it("respects the result limit", () => {
    expect(search("a", 5).length).toBeLessThanOrEqual(5);
    expect(search("research", 3).length).toBeLessThanOrEqual(3);
  });

  it("returns results in descending score order", () => {
    const results = search("peptide");
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("counts results by kind", () => {
    const results = search("research");
    const counts = countByKind(results);
    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
    expect(total).toBe(results.length);
  });

  it("never throws on punctuation or regex metacharacters", () => {
    for (const query of ["(", "[a-z]+", "\\", ".*", "??", "a|b"]) {
      expect(() => search(query)).not.toThrow();
    }
  });
});
