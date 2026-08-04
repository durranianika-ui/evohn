"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import type { NavItem } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The Science dropdown.
 *
 * One heading, a line of orientation, then four numbered rows carrying a
 * label and a one-line description. The index is not decoration — the four
 * tools have a reading order (convert, look up, prepare, store) and the
 * numbers make it legible at a glance.
 *
 * There is no gap between the trigger and this panel: the wrapper's top
 * padding is inside the hover target, so a cursor travelling from the trigger
 * to a row never crosses dead space.
 */
export function NavPanel({
  item,
  onNavigate,
  id,
}: {
  item: NavItem;
  onNavigate: () => void;
  id?: string;
}) {
  const reduced = useReducedMotion();
  if (!item.menu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -6 }}
      transition={{ duration: reduced ? 0.12 : 0.36, ease: EASE_BRAND }}
      className="absolute top-full left-1/2 z-10 -translate-x-1/2 pt-4"
    >
      <div
        id={id}
        className="w-[26rem] max-w-[92vw] border border-carbon/10 bg-soft p-7 shadow-panel"
      >
        <p className="type-label text-carbon/40">{item.menu.heading}</p>

        {item.menu.intro ? (
          <p className="type-body-s mt-3 max-w-[38ch] text-carbon/50">
            {item.menu.intro}
          </p>
        ) : null}

        <ul className="mt-6 border-t border-carbon/10">
          {item.menu.links.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className={cn(
                  "group/row -mx-3 flex gap-5 border-b border-carbon/10 px-3 py-4",
                  "transition-colors duration-300 ease-brand hover:bg-mist/70",
                )}
              >
                <span
                  aria-hidden
                  className="type-label shrink-0 tabular-nums text-carbon/30 transition-colors duration-300 group-hover/row:text-carbon/55"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="type-label block text-carbon">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="type-body-s mt-1.5 block text-carbon/55">
                      {link.description}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
