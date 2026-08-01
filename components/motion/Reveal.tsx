"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE_BRAND, DURATION, RISE, VIEWPORT } from "@/constants/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element begins. */
  delay?: number;
  duration?: number;
  /** Travel distance; 0 for a pure fade. */
  distance?: number;
  as?: ElementType;
}

/**
 * The workhorse scroll reveal: a short rise paired with a fade, fired once
 * as the element approaches the viewport. Collapses to a plain fade when
 * reduced motion is requested.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = DURATION.slow,
  distance = RISE,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: reduced ? 0.2 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE_BRAND,
      }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Gap between children, in seconds. */
  gap?: number;
  delay?: number;
}

/** Parent for staggered groups. Pair with `<StaggerItem>`. */
export function Stagger({ children, className, gap = 0.08, delay = 0 }: StaggerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : gap,
            delayChildren: reduced ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  distance = RISE,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : distance },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: DURATION.slow, ease: EASE_BRAND }}
    >
      {children}
    </motion.div>
  );
}
