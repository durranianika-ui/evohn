"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import { site } from "@/data/site";

/**
 * First-load curtain: the wordmark resolves out of the dark, holds, then the
 * panel lifts to reveal the hero.
 *
 * It renders on the server so it covers the page from the first paint rather
 * than flashing in. Because it lives in the root layout it does not remount
 * on client-side navigation — the ceremony plays on a genuine page load and
 * never repeats as the visitor moves between routes.
 */
export function Curtain() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Tie the curtain to real work rather than an arbitrary wait: it lifts
    // once the display face has loaded — which on a site this typographic is
    // exactly the moment that would otherwise show a font swap — subject to a
    // floor so the reveal still reads as deliberate, and a ceiling so a slow
    // font never holds the page hostage.
    const FLOOR = reduced ? 100 : 750;
    const CEILING = reduced ? 300 : 2200;
    const start = performance.now();

    let lift = 0;
    const release = () => {
      const wait = Math.max(0, FLOOR - (performance.now() - start));
      lift = window.setTimeout(() => setVisible(false), wait);
    };

    document.fonts.ready.then(release, release);
    const failsafe = window.setTimeout(() => setVisible(false), CEILING);

    return () => {
      window.clearTimeout(lift);
      window.clearTimeout(failsafe);
    };
  }, [reduced]);

  return (
    <>
      {/* Without JavaScript the curtain must never trap the page. */}
      <noscript>
        <style>{`[data-curtain]{display:none !important}`}</style>
      </noscript>

      <AnimatePresence>
        {visible && (
          <motion.div
            data-curtain
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: reduced ? 0.2 : 0.85,
              ease: EASE_BRAND,
            }}
            aria-hidden
          >
            {/* Timed to resolve as the panel begins to lift, so the wordmark
                is never cut off mid-animation. */}
            <motion.span
              className="type-wordmark text-soft text-[clamp(1.5rem,5vw,2.75rem)]"
              initial={{ opacity: 0, letterSpacing: "0.62em" }}
              animate={{ opacity: 1, letterSpacing: "0.34em" }}
              transition={{
                duration: reduced ? 0.2 : 0.75,
                ease: EASE_BRAND,
              }}
            >
              {site.name}
            </motion.span>

            {/* Hairline that draws across as the wordmark settles. */}
            <motion.span
              className="absolute bottom-0 left-0 h-px bg-soft/25"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduced ? 0.2 : 0.8, ease: EASE_BRAND }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
