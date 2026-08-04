"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  id: string;
  label: string;
}

/**
 * Sticky section index.
 *
 * Shared by the two handling guides and by every legal document. The active
 * entry is tracked with an IntersectionObserver rather than a scroll handler,
 * so nothing runs on the main thread between intersections.
 *
 * Anchor clicks are left to the browser: `scroll-behavior` is already set
 * globally and honours `prefers-reduced-motion`, and hijacking the jump would
 * break the back button's restoration of the previous position.
 */
export function TableOfContents({
  entries,
  className,
  label = "On this page",
}: {
  entries: TocEntry[];
  className?: string;
  label?: string;
}) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (!entries.length) return;

    const nodes = entries
      .map((e) => document.getElementById(e.id))
      .filter((n): n is HTMLElement => n !== null);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (records) => {
        // The topmost intersecting heading wins, so scrolling up and down
        // through a section settles on the same entry either way.
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Top inset clears the fixed header; bottom inset stops a heading
      // counting as active once it has left through the top of the screen.
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [entries]);

  if (!entries.length) return null;

  return (
    <nav aria-label={label} className={cn(className)} data-print="hide">
      <h2 className="type-label text-carbon/45">{label}</h2>
      <ol className="mt-6 space-y-1">
        {entries.map((entry, i) => {
          const isActive = active === entry.id;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group/toc flex gap-4 py-2 transition-colors duration-400 ease-brand",
                  isActive ? "text-carbon" : "text-carbon/50 hover:text-carbon",
                )}
              >
                <span className="type-label shrink-0 tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="type-body-s leading-snug">{entry.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

