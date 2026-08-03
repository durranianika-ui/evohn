"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { EASE_BRAND } from "@/constants/motion";
import { nav, site, type NavItem, type NavLink } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Full-screen mobile drawer.
 *
 * Top-level destinations are always reachable in one tap: a section with
 * children exposes the parent link and a separate disclosure control, rather
 * than burying the parent behind an expand. Touch targets are 48px minimum.
 */

function children(item: NavItem): NavLink[] {
  return item.menu?.links ?? [];
}

function Section({
  item,
  index,
  onNavigate,
}: {
  item: NavItem;
  index: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const links = children(item);
  const panelId = `mobile-nav-${item.label.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.15 : 0.55,
        delay: reduced ? 0 : 0.08 + index * 0.04,
        ease: EASE_BRAND,
      }}
      className="border-b border-soft/12"
    >
      <div className="flex items-center justify-between">
        {item.href ? (
          <Link
            href={item.href}
            onClick={onNavigate}
            className="type-title flex-1 py-5 text-soft"
          >
            {item.label}
          </Link>
        ) : (
          /* A dropdown-only item has no destination; the whole row toggles. */
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="type-title flex-1 py-5 text-left text-soft"
          >
            {item.label}
          </button>
        )}

        {links.length ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="-mr-3 flex size-12 shrink-0 items-center justify-center text-soft/70"
          >
            <span className="sr-only">
              {open ? `Collapse ${item.label}` : `Expand ${item.label}`}
            </span>
            <span aria-hidden className="relative block size-3.5">
              <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
              <span
                className={cn(
                  "absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current",
                  "transition-transform duration-500 ease-brand",
                  open ? "scale-y-0" : "scale-y-100",
                  "motion-reduce:transition-none",
                )}
              />
            </span>
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {open && links.length ? (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.45, ease: EASE_BRAND }}
            className="overflow-hidden"
          >
            <ul className="pb-5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="block py-3 transition-colors duration-300"
                  >
                    <span className="type-label block text-soft/75">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span className="type-body-s mt-1 block text-soft/45">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="primary-menu"
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-ink xl:hidden"
          data-lenis-prevent
          initial={{ opacity: 0, y: reduced ? 0 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -16 }}
          transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE_BRAND }}
        >
          <div className="container-content flex min-h-full flex-col justify-between pt-28 pb-12">
            <nav aria-label="Primary" className="flex flex-col">
              {nav.map((item, i) => (
                <Section
                  key={item.label}
                  item={item}
                  index={i}
                  onNavigate={onClose}
                />
              ))}
            </nav>

            <div className="mt-12 flex flex-col gap-6">
              <WhatsAppCTA intent="specialist" tone="dark" className="w-full" />
              <p className="type-label text-soft/55">
                {site.name} — Precision Compounds
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
