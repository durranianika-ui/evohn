"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { EASE_BRAND } from "@/constants/motion";
import { useEnquiry } from "@/lib/enquiry";
import { menuIndex, nav, site, type NavItem, type NavLink } from "@/data/site";
import { legalDocuments } from "@/data/legal";
import { cn } from "@/lib/utils";

/**
 * Full-screen mobile drawer.
 *
 * The seven primary destinations at display size, Science as a nested
 * accordion, then the full index and the legal list beneath — so the drawer is
 * a complete map of the site rather than a copy of the desktop bar.
 *
 * Every top-level destination stays reachable in one tap: a section with
 * children exposes its own link *and* a separate disclosure control rather
 * than burying the parent behind an expand. Targets are 48px minimum, and the
 * foot clears the iOS home indicator.
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
              {links.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="flex min-h-12 gap-4 py-3 transition-colors duration-300"
                  >
                    <span
                      aria-hidden
                      className="type-label shrink-0 tabular-nums text-soft/30"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="type-label block text-soft/75">
                        {link.label}
                      </span>
                      {link.description ? (
                        <span className="type-body-s mt-1 block text-soft/45">
                          {link.description}
                        </span>
                      ) : null}
                    </span>
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
  const { count, ready } = useEnquiry();
  const panelRef = useRef<HTMLDivElement>(null);

  // Trap Tab inside the drawer while it is open. Escape is handled by the
  // header, which owns the open state for every one of its surfaces.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="primary-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-ink xl:hidden"
          data-lenis-prevent
          initial={{ opacity: 0, y: reduced ? 0 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -16 }}
          transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE_BRAND }}
        >
          <div className="container-content flex min-h-full flex-col justify-between pt-28 pb-safe">
            <div>
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

              <Link
                href="/enquiry"
                onClick={onClose}
                className="mt-8 flex min-h-14 items-center justify-between border border-soft/20 px-5"
              >
                <span className="type-label text-soft">Enquiry list</span>
                <span className="type-label tabular-nums text-soft/55">
                  {ready ? count : 0}
                </span>
              </Link>

              <Link
                href="/search"
                onClick={onClose}
                className="mt-3 flex min-h-14 items-center justify-between border border-soft/20 px-5"
              >
                <span className="type-label text-soft">Search</span>
                <span aria-hidden className="type-label text-soft/40">
                  &rarr;
                </span>
              </Link>

              {/* Everything not in the primary seven. */}
              <div className="mt-14 grid gap-10 border-t border-soft/12 pt-12 sm:grid-cols-2">
                {menuIndex.map((column) => (
                  <nav key={column.heading} aria-label={column.heading}>
                    <h2 className="type-label text-soft/40">{column.heading}</h2>
                    <ul className="mt-5 space-y-0.5">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="type-body-s flex min-h-11 items-center text-soft/60 transition-colors duration-300 hover:text-soft"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
              </div>

              <nav aria-label="Legal" className="mt-12 border-t border-soft/12 pt-10">
                <h2 className="type-label text-soft/40">Legal</h2>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
                  {legalDocuments.map((doc) => (
                    <li key={doc.slug}>
                      <Link
                        href={doc.path}
                        onClick={onClose}
                        className="type-body-s flex min-h-11 items-center text-soft/45 transition-colors duration-300 hover:text-soft"
                      >
                        {doc.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="mt-14 flex flex-col gap-6 pt-6">
              <WhatsAppCTA intent="specialist" tone="dark" className="w-full" />
              <p className="type-label text-soft/45">
                {site.name} — research use only
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
