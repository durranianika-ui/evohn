"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import type { Category, CategorySlug } from "@/data/categories";
import { cn } from "@/lib/utils";

export interface CatalogueEntry {
  slug: string;
  category: CategorySlug;
  /**
   * The card, rendered on the server.
   * Cards read the filesystem to decide between photography and the vector
   * plate, so they cannot be constructed inside this client component —
   * they are passed in already rendered.
   */
  card: ReactNode;
}

/**
 * Catalogue with client-side filtering.
 *
 * Filtering is instant and does not navigate, so the grid re-flows rather
 * than reloading. Changes are announced politely for screen reader users.
 */
export function CatalogueGrid({
  entries,
  categories,
}: {
  entries: CatalogueEntry[];
  categories: Category[];
}) {
  const [active, setActive] = useState<CategorySlug | "all">("all");
  const reduced = useReducedMotion();

  const visible = useMemo(
    () => (active === "all" ? entries : entries.filter((e) => e.category === active)),
    [active, entries],
  );

  const filters = [{ slug: "all" as const, name: "All", token: null }, ...categories];

  return (
    <>
      <div
        role="group"
        aria-label="Filter catalogue by category"
        className="flex flex-wrap items-center gap-x-3 gap-y-3"
      >
        {filters.map((filter) => {
          const selected = active === filter.slug;
          return (
            <button
              key={filter.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(filter.slug as CategorySlug | "all")}
              className={cn(
                "type-label inline-flex items-center gap-2.5 border px-5 py-3",
                "transition-colors duration-400 ease-brand",
                selected
                  ? "border-carbon bg-carbon text-soft"
                  : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
              )}
            >
              {"token" in filter && filter.token ? (
                <span
                  aria-hidden
                  className="size-1.5 rounded-full ring-1 ring-current/25"
                  style={{ backgroundColor: filter.token }}
                />
              ) : null}
              {filter.name}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="type-label mt-8 text-carbon/62">
        Showing {String(visible.length).padStart(2, "0")} of{" "}
        {String(entries.length).padStart(2, "0")} compounds
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((entry) => (
            <motion.div
              key={entry.slug}
              layout={!reduced}
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -12 }}
              transition={{ duration: reduced ? 0.12 : 0.5, ease: EASE_BRAND }}
            >
              {entry.card}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 ? (
        <p className="type-body mt-16 text-carbon/62">
          No compounds in this domain yet.
        </p>
      ) : null}
    </>
  );
}
