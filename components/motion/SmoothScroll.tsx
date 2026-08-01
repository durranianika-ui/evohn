"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum scrolling. Mounted once in the root layout.
 *
 * Disabled entirely when the visitor prefers reduced motion — hijacking the
 * scroll is exactly the kind of motion that setting exists to prevent.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Matches the CSS signature curve closely in exponential form.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
