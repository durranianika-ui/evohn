"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import { useEnquiry } from "@/lib/enquiry";
import { whatsappConfigured } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * The enquiry drawer.
 *
 * Slides from the right, locks the page behind it, traps focus, restores focus
 * on close. It is what a cart drawer would be if the business had a cart —
 * except the terminal action composes one message rather than taking a
 * payment, because that is what actually happens next.
 */
export function EnquiryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, remove, clear, href, count } = useEnquiry();
  const reduced = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    const raf = requestAnimationFrame(() =>
      panelRef.current
        ?.querySelector<HTMLElement>("button, a[href]")
        ?.focus(),
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
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
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.45, ease: EASE_BRAND }}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry list"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-[26rem] flex-col overflow-hidden bg-soft text-carbon shadow-drawer"
            initial={{ x: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
            transition={{ duration: reduced ? 0.15 : 0.6, ease: EASE_BRAND }}
          >
            <header className="flex items-baseline justify-between border-b border-carbon/12 px-7 py-6">
              <div>
                <p className="type-label text-carbon/45">Enquiry list</p>
                <p className="type-title-s mt-1.5 text-carbon">
                  {count} {count === 1 ? "compound" : "compounds"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="type-label -mr-3 min-h-11 px-3 text-carbon/50 transition-colors duration-400 ease-brand hover:text-carbon"
              >
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-7">
              {items.length ? (
                <ul>
                  {items.map((item) => (
                    <li
                      key={item.slug}
                      className="flex items-start justify-between gap-5 border-b border-carbon/10 py-5"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="type-title-s block text-carbon transition-opacity duration-300 hover:opacity-65"
                        >
                          {item.name}
                        </Link>
                        <p className="type-label mt-2 text-carbon/40">
                          {item.subtitle}
                        </p>
                        {item.dosage ? (
                          <p className="type-body-s mt-1 text-carbon/50">
                            {item.dosage}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(item.slug)}
                        className="type-label -mr-2 min-h-11 shrink-0 px-2 text-carbon/40 transition-colors duration-400 ease-brand hover:text-carbon"
                      >
                        <span className="sr-only">Remove {item.name} from</span>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-14">
                  <p className="type-title-s text-carbon">
                    Nothing selected yet.
                  </p>
                  <p className="type-body-s mt-4 text-carbon/55">
                    Add compounds from the catalogue and they collect here, so
                    one message covers the whole enquiry instead of six.
                  </p>
                  <Link
                    href="/catalogue"
                    onClick={onClose}
                    className="type-label mt-8 inline-flex min-h-11 items-center border border-carbon/20 px-7 py-3.5 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
                  >
                    Browse the catalogue
                  </Link>
                </div>
              )}
            </div>

            <footer className="border-t border-carbon/12 px-7 pt-6 pb-safe">
              <p className="type-body-s text-carbon/50">
                No price is shown and nothing is ordered here. The list composes
                a single enquiry; supply is agreed separately in writing.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {whatsappConfigured ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-label inline-flex min-h-12 items-center justify-center bg-carbon px-8 py-4 text-soft transition-opacity duration-400 ease-brand hover:opacity-88 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                    aria-disabled={items.length === 0}
                    tabIndex={items.length === 0 ? -1 : undefined}
                  >
                    Send this enquiry
                  </a>
                ) : (
                  <a
                    href={`mailto:${site.email}`}
                    className="type-label inline-flex min-h-12 items-center justify-center bg-carbon px-8 py-4 text-soft transition-opacity duration-400 ease-brand hover:opacity-88"
                  >
                    Email this enquiry
                  </a>
                )}

                <div className="flex items-center justify-between">
                  <Link
                    href="/enquiry"
                    onClick={onClose}
                    className="type-label min-h-11 py-3 text-carbon/55 transition-colors duration-400 ease-brand hover:text-carbon"
                  >
                    Review the full list
                  </Link>

                  {items.length ? (
                    <button
                      type="button"
                      onClick={clear}
                      className="type-label min-h-11 py-3 text-carbon/40 transition-colors duration-400 ease-brand hover:text-carbon"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
