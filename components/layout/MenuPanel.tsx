"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { EASE_BRAND } from "@/constants/motion";
import { menuIndex, site } from "@/data/site";
import { legalDocuments } from "@/data/legal";

/**
 * The utility index.
 *
 * Opened by the Menu control at the right of the bar on desktop. The primary
 * bar carries seven destinations; this carries every destination, so trimming
 * the bar never costs reachability.
 *
 * It is a full-bleed dark sheet rather than a dropdown because it holds four
 * columns and a legal list — a 400px panel would turn that into a scroll.
 */
export function MenuPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus(),
    );

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
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = overflow;
      document.removeEventListener("keydown", onKey, true);
      restoreTo.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="utility-index"
          role="dialog"
          aria-modal="true"
          aria-label="Site index"
          data-lenis-prevent
          className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-ink text-soft"
          initial={{ opacity: 0, y: reduced ? 0 : -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -24 }}
          transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE_BRAND }}
        >
          <div className="container-content flex min-h-full flex-col justify-between pt-28 pb-16">
            <div>
              <div className="flex items-start justify-between gap-8">
                <Wordmark className="text-[1.15rem]" />
                <button
                  type="button"
                  onClick={onClose}
                  className="type-label min-h-11 px-3 text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                >
                  Close
                </button>
              </div>

              <div className="mt-20 grid gap-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
                {menuIndex.map((column, ci) => (
                  <motion.nav
                    key={column.heading}
                    aria-label={column.heading}
                    initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduced ? 0.15 : 0.55,
                      delay: reduced ? 0 : 0.08 + ci * 0.05,
                      ease: EASE_BRAND,
                    }}
                  >
                    <h2 className="type-label text-soft/40">{column.heading}</h2>
                    <ul className="mt-7 space-y-1">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="type-title-s block py-2 text-soft/70 transition-colors duration-400 ease-brand hover:text-soft"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.nav>
                ))}
              </div>
            </div>

            <div className="mt-20 border-t border-soft/12 pt-10">
              <nav aria-label="Legal">
                <h2 className="type-label text-soft/40">Legal</h2>
                <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                  {legalDocuments.map((doc) => (
                    <li key={doc.slug}>
                      <Link
                        href={doc.path}
                        onClick={onClose}
                        className="type-body-s inline-flex min-h-6 items-center text-soft/50 transition-colors duration-400 ease-brand hover:text-soft"
                      >
                        {doc.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <WhatsAppCTA intent="specialist" tone="dark" />
                <p className="type-label text-soft/40">
                  {site.name} — research use only
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
