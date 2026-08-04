"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { EASE_BRAND } from "@/constants/motion";
import { createLocalStore, hydratedStore } from "@/lib/local-store";
import { site } from "@/data/site";

/**
 * Entrance notice.
 *
 * Two declarations, one accept, one decline, and no third option engineered to
 * make declining feel like a mistake. There is no countdown, no pre-ticked
 * box, no "are you sure", and the decline path is a real page rather than a
 * loop back to the same overlay.
 *
 * It is a declaration, not an identity check. Nothing is transmitted, nothing
 * is verified, and that limitation is stated on `/age-verification` rather
 * than papered over.
 *
 * ## Why it renders after mount
 *
 * These pages are statically exported. Whether the visitor has already
 * acknowledged is in their own localStorage, which the export cannot know — so
 * the HTML ships without the gate and the gate appears on hydration if it is
 * needed. The alternative, blocking the document until storage is read, would
 * make the first paint of every page depend on JavaScript.
 *
 * That means the content behind is technically present in the DOM before the
 * overlay mounts. This is a presentational notice about research context, not
 * a security control, and it is not represented as one.
 */

const STORAGE_KEY = "evohn.entry.v1";

/** Re-ask after this long, so an acknowledgement is not permanent. */
const TTL_DAYS = 30;

interface StoredConsent {
  accepted: true;
  at: number;
}

/**
 * Parse a stored acknowledgement.
 *
 * Storage is writable by anyone with a console, so a record that is not
 * exactly the shape we wrote is treated as absent rather than trusted. An
 * acknowledgement older than the window is likewise treated as absent — a
 * declaration made a year ago is not a declaration made today.
 */
function parseConsent(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as StoredConsent).accepted !== true ||
      typeof (parsed as StoredConsent).at !== "number"
    ) {
      return false;
    }
    const age = Date.now() - (parsed as StoredConsent).at;
    return age >= 0 && age < TTL_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * The acknowledgement, as an external store.
 *
 * Read during render on the client rather than mirrored in by an effect, so
 * the gate never renders once with a guess and again with the truth.
 */
const consentStore = createLocalStore<boolean>({
  key: STORAGE_KEY,
  parse: parseConsent,
  // The stored shape is a timestamped record, not the bare boolean the store
  // hands around — an acknowledgement has to carry the moment it was made, or
  // it can never expire.
  serialise: (accepted) =>
    JSON.stringify({ accepted, at: Date.now() } satisfies {
      accepted: boolean;
      at: number;
    }),
  fallback: false,
});

export function AgeGate() {
  const acknowledged = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.getSnapshot,
    consentStore.getServerSnapshot,
  );

  // False during the prerender and the first client render. Until the client
  // has taken over, nothing renders at all — the export cannot know whether
  // this visitor acknowledged last week, and flashing the notice at someone
  // who did would be worse than showing it a frame late.
  const hydrated = useSyncExternalStore(
    hydratedStore.subscribe,
    hydratedStore.getSnapshot,
    hydratedStore.getServerSnapshot,
  );

  const [declined, setDeclined] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const open = hydrated && !acknowledged;

  // Lock the page and trap focus while the notice is up.
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => acceptRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      // Escape deliberately does nothing. There is no dismiss-without-
      // answering path, because the question is the point.
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
    };
  }, [open]);

  // The store owns the stored shape (see `serialise` above), so accepting is
  // a single write. In private mode the write fails silently and the notice
  // is simply shown again next visit.
  const accept = () => consentStore.set(true);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="entry-title"
          aria-describedby="entry-body"
          data-lenis-prevent
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto overscroll-contain bg-ink/96 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.5, ease: EASE_BRAND }}
        >
          <motion.div
            ref={panelRef}
            className="px-safe w-full max-w-[46rem] py-16 pb-safe"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.12 : 0.7,
              delay: reduced ? 0 : 0.1,
              ease: EASE_BRAND,
            }}
          >
            <Wordmark className="text-[1.35rem] text-soft" />

            {declined ? (
              <>
                <h2
                  id="entry-title"
                  className="type-display-s mt-14 max-w-[18ch] text-soft"
                >
                  This catalogue is not for you
                </h2>
                <div id="entry-body" className="mt-8 space-y-5">
                  <p className="type-body max-w-[58ch] text-soft/60">
                    The compounds described here are characterised for
                    laboratory research only. They are not medicines, they are
                    not approved for human or veterinary administration, and
                    presenting them outside that context would be misleading.
                  </p>
                  <p className="type-body max-w-[58ch] text-soft/60">
                    If you reached this page in error, or if your circumstances
                    change, you are welcome to return.
                  </p>
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setDeclined(false)}
                    className="type-label min-h-12 border border-soft/25 px-9 py-4 text-soft transition-colors duration-400 ease-brand hover:border-soft"
                  >
                    Back to the notice
                  </button>
                  <Link
                    href="/research-use-only"
                    className="type-label min-h-12 border border-transparent px-9 py-4 text-soft/55 transition-colors duration-400 ease-brand hover:text-soft"
                  >
                    Read the research-use condition
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="type-label mt-14 text-soft/45">
                  Entrance notice
                </p>
                <h2
                  id="entry-title"
                  className="type-display-s mt-6 max-w-[20ch] text-soft"
                >
                  Research use only
                </h2>

                <div id="entry-body" className="mt-10 space-y-6">
                  <p className="type-body max-w-[62ch] text-soft/62">
                    {site.name} is an informational catalogue of compounds
                    characterised for laboratory research. Nothing described
                    here is a medicine, nothing is approved for human or
                    veterinary use, and nothing on this site is offered for
                    sale.
                  </p>

                  <ul className="space-y-4 border-t border-soft/12 pt-8">
                    <li className="type-body-s flex gap-5 text-soft/70">
                      <span className="type-label shrink-0 text-soft/35">01</span>
                      <span className="max-w-[56ch]">
                        I am at least 18 years of age.
                      </span>
                    </li>
                    <li className="type-body-s flex gap-5 text-soft/70">
                      <span className="type-label shrink-0 text-soft/35">02</span>
                      <span className="max-w-[56ch]">
                        I am accessing this catalogue in a research, laboratory
                        or professional capacity — not to obtain material for
                        personal use.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                  <button
                    ref={acceptRef}
                    type="button"
                    onClick={accept}
                    className="type-label min-h-12 bg-soft px-10 py-4 text-carbon transition-opacity duration-400 ease-brand hover:opacity-88"
                  >
                    I confirm both — enter
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeclined(true)}
                    className="type-label min-h-12 border border-soft/25 px-10 py-4 text-soft/70 transition-colors duration-400 ease-brand hover:border-soft/50 hover:text-soft"
                  >
                    I do not confirm
                  </button>
                </div>

                <p className="type-body-s mt-10 max-w-[62ch] text-soft/40">
                  Your acknowledgement is stored in this browser only and is not
                  transmitted to {site.name}. Read the{" "}
                  <Link
                    href="/age-verification"
                    className="underline underline-offset-4 transition-colors duration-400 hover:text-soft/70"
                  >
                    age-verification position
                  </Link>
                  , the{" "}
                  <Link
                    href="/research-use-only"
                    className="underline underline-offset-4 transition-colors duration-400 hover:text-soft/70"
                  >
                    research-use condition
                  </Link>{" "}
                  and the{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 transition-colors duration-400 hover:text-soft/70"
                  >
                    terms
                  </Link>
                  .
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export const AGE_GATE_STORAGE_KEY = STORAGE_KEY;
