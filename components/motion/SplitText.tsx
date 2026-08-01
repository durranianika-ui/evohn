"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_BRAND, DURATION, VIEWPORT } from "@/constants/motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger between words, in seconds. */
  gap?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * Masked word reveal: each word rises out of its own clipping box.
 *
 * Accessibility — the wrapper carries the complete string as `aria-label`
 * and the animated fragments are hidden from assistive technology, so the
 * heading is announced as one uninterrupted phrase. Newlines in `text`
 * become hard line breaks.
 */
export function SplitText({
  text,
  className,
  gap = 0.045,
  delay = 0,
  as: Tag = "span",
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const lines = text.split("\n");

  if (reduced) {
    return (
      <Tag className={cn(className)}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  let wordIndex = 0;

  return (
    <Tag className={cn(className)} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, lineNo) => (
        <span key={lineNo} className="block" aria-hidden>
          {line.split(" ").map((word) => {
            const index = wordIndex++;
            return (
              <span
                key={`${lineNo}-${index}`}
                // `pb`/`-mb` give descenders room inside the clip box.
                className="inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block whitespace-pre"
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: DURATION.xslow,
                    delay: delay + index * gap,
                    ease: EASE_BRAND,
                  }}
                >
                  {word}
                  {" "}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
