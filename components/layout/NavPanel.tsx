"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import type { NavItem } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Dropdown panel.
 *
 * One shape only, matching the reference: a small group heading, then a list
 * of rows carrying a label and a one-line description. No columns, no mega
 * layout, no promoted card — the reference has none of those, and adding
 * them was the error this replaces.
 */
export function NavPanel({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
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
      <div className="min-w-[21rem] border border-carbon/10 bg-soft p-6 shadow-[0_28px_60px_-28px_rgba(17,17,17,0.3)]">
        <p className="type-label mb-5 text-carbon/40">{item.menu.heading}</p>

        <ul>
          {item.menu.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className={cn(
                  "group/row block px-3 py-3.5 -mx-3",
                  "transition-colors duration-300 ease-brand hover:bg-mist/70",
                )}
              >
                <span className="type-label block text-carbon">
                  {link.label}
                </span>
                {link.description ? (
                  <span className="type-body-s mt-1.5 block text-carbon/55">
                    {link.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
