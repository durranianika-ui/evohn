import type { CategorySlug } from "@/data/categories";

/**
 * Catalogue filtering and sorting.
 *
 * Pure, so the browser component can be tested for what it renders while the
 * rules about *which* compounds survive a filter set are tested here, against
 * plain objects, without mounting anything.
 */

export type SortKey = "featured" | "name-asc" | "name-desc" | "domain" | "evidence";

export interface SortOption {
  key: SortKey;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { key: "featured", label: "Curated" },
  { key: "name-asc", label: "A – Z" },
  { key: "name-desc", label: "Z – A" },
  { key: "domain", label: "Domain" },
  { key: "evidence", label: "Evidence" },
];

export const DEFAULT_SORT: SortKey = "featured";

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && SORT_OPTIONS.some((o) => o.key === value);
}

/**
 * How extensively a compound appears in the published record, ranked so
 * "Extensively studied" sorts above "Emerging" rather than alphabetically —
 * which would put Emerging first and read as a recommendation.
 */
const EVIDENCE_RANK: Record<string, number> = {
  "Extensively studied": 0,
  Established: 1,
  Emerging: 2,
};

/** The minimum a record needs to be filtered and sorted. */
export interface CatalogueRecord {
  slug: string;
  name: string;
  category: CategorySlug;
  evidence: string;
  /** Lower-cased haystack: name, subtitle, summary, aliases, CAS. */
  search: string;
  /** Position in the source data — the curated order. */
  order: number;
}

export interface CatalogueFilters {
  domain: CategorySlug | "all";
  query: string;
  sort: SortKey;
}

export const DEFAULT_FILTERS: CatalogueFilters = {
  domain: "all",
  query: "",
  sort: DEFAULT_SORT,
};

/** True when nothing has been narrowed — used to hide the reset control. */
export function isDefaultFilters(filters: CatalogueFilters): boolean {
  return (
    filters.domain === "all" &&
    filters.query.trim() === "" &&
    filters.sort === DEFAULT_SORT
  );
}

export function filterCatalogue<T extends CatalogueRecord>(
  records: T[],
  filters: Pick<CatalogueFilters, "domain" | "query">,
): T[] {
  const needle = filters.query.trim().toLowerCase();

  return records.filter((record) => {
    if (filters.domain !== "all" && record.category !== filters.domain) {
      return false;
    }
    if (needle && !record.search.includes(needle)) return false;
    return true;
  });
}

export function sortCatalogue<T extends CatalogueRecord>(
  records: T[],
  sort: SortKey,
): T[] {
  const sorted = [...records];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "en-GB"));
    case "domain":
      // Within a domain, keep the curated order rather than falling back to
      // an arbitrary one — the groups are the point, not the tie-break.
      return sorted.sort(
        (a, b) => a.category.localeCompare(b.category) || a.order - b.order,
      );
    case "evidence":
      return sorted.sort(
        (a, b) =>
          (EVIDENCE_RANK[a.evidence] ?? 99) - (EVIDENCE_RANK[b.evidence] ?? 99) ||
          a.order - b.order,
      );
    case "featured":
    default:
      return sorted.sort((a, b) => a.order - b.order);
  }
}

/** Filter then sort, in that order — sorting a smaller set is cheaper. */
export function applyCatalogue<T extends CatalogueRecord>(
  records: T[],
  filters: CatalogueFilters,
): T[] {
  return sortCatalogue(filterCatalogue(records, filters), filters.sort);
}

/** Compounds per domain, computed once against the unfiltered set. */
export function countByDomain(records: CatalogueRecord[]) {
  const counts = new Map<CategorySlug, number>();
  for (const record of records) {
    counts.set(record.category, (counts.get(record.category) ?? 0) + 1);
  }
  return counts;
}
