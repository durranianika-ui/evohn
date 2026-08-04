import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  SORT_OPTIONS,
  applyCatalogue,
  countByDomain,
  filterCatalogue,
  isDefaultFilters,
  isSortKey,
  sortCatalogue,
  type CatalogueRecord,
} from "@/lib/catalogue";

const records: CatalogueRecord[] = [
  {
    slug: "zeta",
    name: "Zeta",
    category: "recovery",
    evidence: "Emerging",
    search: "zeta repair peptide cas-111",
    order: 0,
  },
  {
    slug: "alpha",
    name: "Alpha",
    category: "weight-loss",
    evidence: "Extensively studied",
    search: "alpha incretin glp-1 cas-222",
    order: 1,
  },
  {
    slug: "mid",
    name: "Mid",
    category: "recovery",
    evidence: "Established",
    search: "mid tissue peptide cas-333",
    order: 2,
  },
];

describe("filtering", () => {
  it("returns everything when nothing is narrowed", () => {
    expect(filterCatalogue(records, { domain: "all", query: "" })).toHaveLength(
      3,
    );
  });

  it("narrows to one domain", () => {
    const result = filterCatalogue(records, { domain: "recovery", query: "" });
    expect(result.map((r) => r.slug)).toEqual(["zeta", "mid"]);
  });

  it("matches a query anywhere in the haystack", () => {
    expect(
      filterCatalogue(records, { domain: "all", query: "incretin" }),
    ).toHaveLength(1);
    expect(
      filterCatalogue(records, { domain: "all", query: "cas-333" }),
    ).toHaveLength(1);
  });

  it("is case-insensitive and ignores surrounding whitespace", () => {
    expect(
      filterCatalogue(records, { domain: "all", query: "  GLP-1 " }),
    ).toHaveLength(1);
  });

  it("applies domain and query together, not either/or", () => {
    // "peptide" matches zeta and mid; the weight-loss filter removes both.
    expect(
      filterCatalogue(records, { domain: "weight-loss", query: "peptide" }),
    ).toHaveLength(0);
  });

  it("returns an empty array rather than everything when nothing matches", () => {
    expect(
      filterCatalogue(records, { domain: "all", query: "qqqzzz" }),
    ).toEqual([]);
  });

  it("does not mutate its input", () => {
    const before = records.map((r) => r.slug);
    filterCatalogue(records, { domain: "recovery", query: "peptide" });
    expect(records.map((r) => r.slug)).toEqual(before);
  });
});

describe("sorting", () => {
  it("restores the curated order by default", () => {
    expect(sortCatalogue(records, "featured").map((r) => r.slug)).toEqual([
      "zeta",
      "alpha",
      "mid",
    ]);
  });

  it("sorts by name in both directions", () => {
    expect(sortCatalogue(records, "name-asc").map((r) => r.name)).toEqual([
      "Alpha",
      "Mid",
      "Zeta",
    ]);
    expect(sortCatalogue(records, "name-desc").map((r) => r.name)).toEqual([
      "Zeta",
      "Mid",
      "Alpha",
    ]);
  });

  it("groups by domain and keeps the curated order inside each group", () => {
    expect(sortCatalogue(records, "domain").map((r) => r.slug)).toEqual([
      "zeta",
      "mid",
      "alpha",
    ]);
  });

  it("ranks evidence by how extensively studied, not alphabetically", () => {
    // Alphabetically "Emerging" would come first, which reads as a ranking.
    expect(sortCatalogue(records, "evidence").map((r) => r.evidence)).toEqual([
      "Extensively studied",
      "Established",
      "Emerging",
    ]);
  });

  it("puts an unrecognised evidence level last rather than first", () => {
    const withUnknown = [
      ...records,
      {
        slug: "odd",
        name: "Odd",
        category: "neuro" as const,
        evidence: "Unclassified",
        search: "odd",
        order: 3,
      },
    ];
    expect(sortCatalogue(withUnknown, "evidence").at(-1)?.slug).toBe("odd");
  });

  it("does not mutate its input", () => {
    const before = records.map((r) => r.slug);
    sortCatalogue(records, "name-asc");
    expect(records.map((r) => r.slug)).toEqual(before);
  });
});

describe("combined application", () => {
  it("filters first, then sorts what survives", () => {
    const result = applyCatalogue(records, {
      domain: "recovery",
      query: "",
      sort: "name-asc",
    });
    expect(result.map((r) => r.name)).toEqual(["Mid", "Zeta"]);
  });
});

describe("filter state", () => {
  it("recognises the untouched state", () => {
    expect(isDefaultFilters(DEFAULT_FILTERS)).toBe(true);
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, domain: "neuro" })).toBe(false);
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, query: "a" })).toBe(false);
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, sort: "name-asc" })).toBe(
      false,
    );
  });

  it("treats a whitespace-only query as untouched", () => {
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, query: "   " })).toBe(true);
  });

  it("validates a sort key from a hand-edited URL", () => {
    expect(isSortKey("name-asc")).toBe(true);
    expect(isSortKey("nonsense")).toBe(false);
    expect(isSortKey(null)).toBe(false);
  });

  it("offers a default that is one of the options", () => {
    expect(SORT_OPTIONS.some((o) => o.key === DEFAULT_SORT)).toBe(true);
  });
});

describe("domain counts", () => {
  it("counts against the unfiltered set", () => {
    const counts = countByDomain(records);
    expect(counts.get("recovery")).toBe(2);
    expect(counts.get("weight-loss")).toBe(1);
    expect(counts.get("neuro")).toBeUndefined();
  });

  it("sums to the total", () => {
    const total = Array.from(countByDomain(records).values()).reduce(
      (a, b) => a + b,
      0,
    );
    expect(total).toBe(records.length);
  });
});
