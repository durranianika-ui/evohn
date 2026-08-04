"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Travel across the full scroll pass, in pixels.
   * Negative moves the layer against the scroll direction.
   */
  distance?: number;
}

/**
 * Vertical parallax driven by the element's own progress through the
 * viewport. Kept deliberately shallow — the brand is restrained.
 */
export function Parallax({ children, className, distance = -80 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={reduced ? undefined : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Slow scale-down applied to large photography as it passes — the
 * "image settles into place" treatment used across the reference layout.
 */
export function ParallaxImage({
  children,
  className,
  from = 1.16,
  to = 1,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        style={reduced ? undefined : { scale }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
