"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import type { NavItem } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Desktop dropdown surface.
 *
 * Two shapes share one component: a compact single-column menu, and the
 * full-width mega panel with columns and a promoted card. Both open on the
 * light ground — the header commits to its solid state whenever a panel is
 * open, so there is never a light panel hanging off a transparent bar.
 */

function PanelLink({
  href,
  label,
  description,
  onNavigate,
}: {
  href: string;
  label: string;
  description?: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group/link block py-2.5"
    >
      <span className="type-title-s relative inline-block text-carbon">
        {label}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-0 bg-current",
            "transition-[width] duration-500 ease-brand",
            "group-hover/link:w-full motion-reduce:transition-none",
          )}
        />
      </span>
      {description ? (
        <span className="type-body-s mt-1 block text-carbon/55">
          {description}
        </span>
      ) : null}
    </Link>
  );
}

export function NavPanel({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const reduced = useReducedMotion();

  const enter = {
    initial: { opacity: 0, y: reduced ? 0 : -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -8 },
    transition: { duration: reduced ? 0.12 : 0.42, ease: EASE_BRAND },
  };

  /* -------------------------------------------------- compact dropdown */
  if (item.menu) {
    return (
      <motion.div
        {...enter}
        className="absolute top-full left-0 pt-3"
      >
        <div className="min-w-[22rem] border border-carbon/10 bg-soft p-7 shadow-[0_28px_60px_-28px_rgba(17,17,17,0.28)]">
          <p className="type-label mb-5 text-carbon/45">{item.label}</p>
          <ul>
            {item.menu.map((link) => (
              <li key={link.href}>
                <PanelLink {...link} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  /* ------------------------------------------------------- mega panel */
  if (!item.mega) return null;
  const { columns, feature } = item.mega;

  return (
    <motion.div
      {...enter}
      className="fixed inset-x-0 top-18 border-t border-carbon/10 bg-soft shadow-[0_28px_60px_-28px_rgba(17,17,17,0.28)]"
    >
      <div className="container-content py-14">
        <div
          className={cn(
            "grid gap-x-12 gap-y-12",
            feature ? "lg:grid-cols-12" : "lg:grid-cols-3",
          )}
        >
          {columns.map((column) => (
            <div
              key={column.heading}
              className={cn(feature && "lg:col-span-3")}
            >
              <p className="type-label mb-6 text-carbon/45">
                {column.heading}
              </p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <PanelLink {...link} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {feature ? (
            <div
              className={cn(
                "lg:col-span-3",
                // Push the card to the right edge when the columns do not fill.
                columns.length < 3 && "lg:col-start-10",
              )}
            >
              <Link
                href={feature.href}
                onClick={onNavigate}
                className="group/feature block h-full border border-carbon/10 bg-mist/60 p-8 transition-colors duration-500 ease-brand hover:bg-mist"
              >
                <p className="type-label text-carbon/45">{feature.eyebrow}</p>
                <p className="type-title mt-5 text-carbon">{feature.title}</p>
                <p className="type-body-s mt-4 text-carbon/62">
                  {feature.body}
                </p>
                <span className="type-label mt-8 inline-flex items-center gap-3 text-carbon">
                  {feature.cta}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-500 ease-brand group-hover/feature:translate-x-1 motion-reduce:transition-none"
                  >
                    &#8594;
                  </span>
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
