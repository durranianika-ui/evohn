"use client";

import { motion } from "framer-motion";
import { EASE_BRAND, VIEWPORT } from "@/constants/motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export interface Line {
  /** The words of this line. */
  text: string;
  /** Which edge the line sits against. The reference alternates. */
  align?: "left" | "right" | "center";
}

interface LineMaskProps {
  lines: Line[];
  className?: string;
  /** Seconds before the first line begins. */
  delay?: number;
  /** Gap between consecutive lines, in seconds. */
  gap?: number;
  as?: "h1" | "h2" | "p" | "div";
}

/**
 * Masked line reveal.
 *
 * Each line is its own clipping block; the text inside rises from fully below
 * that block to rest. Measured against the reference, whose display lines sit
 * on an 89px pitch at a 72px face — the extra 17px is the mask's breathing
 * room, not leading, so the pitch is set here (1.24) rather than in the type
 * scale, which keeps its own 0.95 line-height for wrapped copy.
 *
 * Under reduced motion the mask still clips, but the lines simply fade: no
 * travel, no stagger.
 */
export function LineMask({
  lines,
  className,
  delay = 0,
  gap = 0.09,
  as: Tag = "div",
}: LineMaskProps) {
  const reduced = useReducedMotionSafe();

  return (
    <Tag className={cn(className)}>
      {lines.map((line, i) => (
        <span
          key={`${line.text}-${i}`}
          className={cn(
            "block overflow-hidden",
            line.align === "right"
              ? "text-right"
              : line.align === "center"
                ? "text-center"
                : "text-left",
          )}
          /* The pitch the reference runs, expressed against the face size so
             it holds as the display scale clamps down on narrow viewports. */
          style={{ lineHeight: 1.24 }}
        >
          <motion.span
            className="block will-change-transform"
            /* The travel is 1.1em expressed in px-free style: framer receives
               a plain number so the value animates identically before and
               after hydration. A percentage here left the SSR style string
               unadopted — the one motion value in the site that did — and
               the lines never rose. 1.1 lines clears the 1.24 mask pitch. */
            initial={{ y: reduced ? 0 : "1.1em", opacity: reduced ? 0 : 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={VIEWPORT}
            transition={{
              duration: reduced ? 0.2 : 0.9,
              delay: reduced ? 0 : delay + i * gap,
              ease: EASE_BRAND,
            }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
