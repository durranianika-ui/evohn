"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import type { JournalTopic } from "@/data/journal";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export interface JournalEntry {
  slug: string;
  topic: string;
  card: ReactNode;
}

/**
 * Journal index with topic filtering.
 *
 * Cards are rendered on the server — they consult the filesystem for
 * photography — and handed here already built. Filtering re-flows the grid
 * rather than navigating, and announces the new count politely.
 */
export function JournalBrowser({
  entries,
  topics,
}: {
  entries: JournalEntry[];
  topics: JournalTopic[];
}) {
  const [active, setActive] = useState<string>("all");
  const reduced = useReducedMotionSafe();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      map.set(entry.topic, (map.get(entry.topic) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  const visible = useMemo(
    () =>
      active === "all" ? entries : entries.filter((e) => e.topic === active),
    [active, entries],
  );

  const filters = [
    { slug: "all", name: "All entries", count: entries.length },
    ...topics
      .filter((t) => counts.has(t.slug))
      .map((t) => ({
        slug: t.slug,
        name: t.name,
        count: counts.get(t.slug) ?? 0,
      })),
  ];

  const description = topics.find((t) => t.slug === active)?.description;

  return (
    <>
      <div
        role="group"
        aria-label="Filter the journal by topic"
        className={cn(
          "-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10",
          "lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {filters.map((filter) => {
          const selected = active === filter.slug;
          return (
            <button
              key={filter.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(filter.slug)}
              className={cn(
                "type-label inline-flex shrink-0 items-center gap-2.5 border px-5 py-3.5",
                "transition-colors duration-400 ease-brand",
                selected
                  ? "border-carbon bg-carbon text-soft"
                  : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
              )}
            >
              {filter.name}
              <span
                className={cn(
                  "tabular-nums",
                  selected ? "text-soft/55" : "text-carbon/35",
                )}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="type-body-s mt-8 max-w-[60ch] border-t border-carbon/10 pt-8 text-carbon/62"
      >
        {description ??
          "Research-framed writing on method, verification and handling — the thinking behind how every batch is evaluated."}
      </p>

      <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}
