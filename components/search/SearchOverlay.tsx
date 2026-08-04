"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SearchResults } from "./SearchResults";
import { EASE_BRAND } from "@/constants/motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * Header search.
 *
 * A sheet that drops from the top rather than a modal in the middle of the
 * screen: it keeps the bar it was opened from visible, and it puts the field
 * exactly where the eye already is.
 *
 * Focus is moved into the field on open, trapped while open, and restored to
 * the control that opened it on close. Submitting hands off to `/search`,
 * so a query can be shared, bookmarked and reached with the back button.
 */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotionSafe();
  const router = useRouter();
  const uid = useId();

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    // One frame, so the field exists before focus is asked for.
    const raf = requestAnimationFrame(() => inputRef.current?.focus());

    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = overflow;
      restoreTo.current?.focus?.();
    };
  }, [open]);

  // Escape closes; Tab cycles inside the sheet.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
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
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.45, ease: EASE_BRAND }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search EVOHN"
            data-lenis-prevent
            className="fixed inset-x-0 top-0 z-[70] max-h-[90dvh] overflow-y-auto overscroll-contain bg-soft text-carbon"
            initial={{ y: reduced ? 0 : "-100%", opacity: reduced ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : "-100%", opacity: reduced ? 0 : 1 }}
            transition={{ duration: reduced ? 0.15 : 0.6, ease: EASE_BRAND }}
          >
            <div className="container-content py-8 md:py-10">
              <form onSubmit={submit} role="search">
                <label htmlFor={`${uid}-q`} className="type-label text-carbon/45">
                  Search the catalogue, the journal and the batch records
                </label>

                <div className="mt-4 flex items-center gap-5 border-b border-carbon/25 pb-3 focus-within:border-carbon">
                  <input
                    ref={inputRef}
                    id={`${uid}-q`}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Compound, batch number, article…"
                    className="type-display-s w-full bg-transparent text-carbon placeholder:text-carbon/25 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={onClose}
                    className="type-label min-h-11 shrink-0 px-3 text-carbon/50 transition-colors duration-400 ease-brand hover:text-carbon"
                  >
                    Close
                  </button>
                </div>
              </form>

              <div className="mt-6 max-h-[52dvh] overflow-y-auto overscroll-contain">
                <SearchResults
                  query={query}
                  kind={null}
                  onNavigate={onClose}
                  limit={12}
                  compact
                />
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
