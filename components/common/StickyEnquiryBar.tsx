"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { EASE_BRAND } from "@/constants/motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/** Scroll distance after which the bar is offered. */
const APPEAR_AT = 520;

/**
 * Persistent product enquiry action.
 *
 * Appears once the hero action has scrolled away, and retires as the closing
 * call-to-action and footer come into view — so the page always ends on its
 * own terms rather than under a floating bar.
 */
export function StickyEnquiryBar({ product }: { product: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > APPEAR_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // The closing CTA is the last section before the footer; once either is
    // on screen the user already has a full-size action in front of them.
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNearEnd(entry.isIntersecting),
      { rootMargin: "0px 0px 0px 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !nearEnd;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-carbon/10 bg-soft/85 backdrop-blur-xl supports-[backdrop-filter]:bg-soft/70"
          initial={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
          transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE_BRAND }}
        >
          <div className="container-content flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
              <p className="type-label text-carbon/62">Enquire</p>
              <p className="type-title-s truncate text-carbon">{product}</p>
            </div>
            <WhatsAppCTA
              product={product}
              tone="light"
              className="shrink-0 px-6 py-3.5"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
