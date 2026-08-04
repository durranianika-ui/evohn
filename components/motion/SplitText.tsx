"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  CHAR_RISE,
  CHAR_STAGGER,
  EASE_BRAND,
  DURATION,
  VIEWPORT,
} from "@/constants/motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger between characters, in seconds. */
  gap?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * Headline reveal, one character at a time.
 *
 * Each character starts 8px low and transparent and settles on its own a few
 * milliseconds after the one before it — the reference's `char-reveal`,
 * measured off its live DOM at translateY(8px)/opacity 0 with a stagger of a
 * few frames. This replaced a masked *word* reveal that lifted each word 110%
 * of its own height out of a clipping box: at display size that is a 69px
 * curtain per word, and it was the single loudest piece of motion on the page.
 *
 * Words stay `inline-block` so the line still breaks between words and never
 * inside one, and the 8px of travel needs no clipping box at all.
 *
 * Accessibility — the complete string is carried by a visually hidden span and
 * every animated fragment is hidden from assistive technology, so the line is
 * announced once, as one uninterrupted phrase, rather than spelled out. It
 * used to hang an `aria-label` on the wrapper instead, which axe rejects
 * outright when the wrapper is a `p` or a `span`: aria-label is prohibited on
 * elements with no valid role. Newlines in `text` become hard line breaks.
 */
export function SplitText({
  text,
  className,
  gap = CHAR_STAGGER,
  delay = 0,
  as: Tag = "span",
}: SplitTextProps) {
  const reduced = useReducedMotionSafe();
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

  let charIndex = 0;

  return (
    <Tag className={cn(className)}>
      {/* `whitespace-normal` undoes the `nowrap` that `sr-only` sets. Inside
          a 1px box, nowrap lays the whole phrase out as one 380px line, and
          that line box counts towards the heading's scrollWidth — the
          measurement everything uses to decide whether a heading is clipped.
          Wrapping instead, the copy occupies 1px in both directions and is
          still read out in full. */}
      <span className="sr-only whitespace-normal">
        {text.replace(/\n/g, " ")}
      </span>
      {lines.map((line, lineNo) => {
        const words = line.split(" ");
        return (
          <span key={lineNo} className="block" aria-hidden>
            {words.map((word, wordNo) => (
              <Fragment key={`${lineNo}-${wordNo}`}>
                <span
                  // The unit that may wrap is the word; `max-w-full` plus the
                  // wrapping rules let a single word longer than the line
                  // break rather than push the document wider than the
                  // viewport — at 320px a display-size compound name is wider
                  // than the screen.
                  className="inline-block max-w-full [overflow-wrap:anywhere]"
                >
                  {word.split("").map((char, i) => {
                    const index = charIndex++;
                    return (
                      <motion.span
                        key={`${lineNo}-${wordNo}-${i}`}
                        className="inline-block"
                        initial={{ y: CHAR_RISE, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={VIEWPORT}
                        transition={{
                          duration: DURATION.mid,
                          delay: delay + index * gap,
                          ease: EASE_BRAND,
                        }}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </span>
                {/* The space between words is an ordinary text node, not a
                    character inside the word's box. Held inside it — which is
                    where it lived when it needed `whitespace-pre` to survive —
                    it could not collapse at a line break, so every word was a
                    space wider than its own box and the heading measured as
                    clipped at 390px. */}
                {wordNo < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
