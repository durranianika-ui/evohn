import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CornerFrame } from "@/components/ui/CornerFrame";
import {
  SciencePattern,
  type SciencePatternVariant,
} from "@/components/ui/SciencePattern";
import { Eyebrow } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * Which field each card carries, cycling with the stack. The mirrored block
 * offsets into the cycle so the two sequences never show the same artwork
 * side by side.
 */
const PATTERNS: SciencePatternVariant[] = ["dots", "rings", "wave", "grid"];

/**
 * Where the first panel comes to rest, and how far each one behind it sits
 * below the last. Both measured off the reference, whose three panels stick at
 * 80 / 100 / 120px — clear of its 70–80px header, with a 20px edge of every
 * card left showing once the stack has formed.
 */
const STACK_TOP = 80;
const STACK_STEP = 20;

export interface Panel {
  title: string;
  body: string;
  /** Sand panels carry the accent; carbon panels recede. */
  tone: "sand" | "carbon";
}

interface PairedPanelsProps {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  panels: Panel[];
  /** Mirrors the composition so the pair reads as one sequence, not two blocks. */
  reverse?: boolean;
  /**
   * Closes the editorial column. The reference carries its final statement in
   * the held column of the last of these two blocks rather than in a row of
   * its own, so the statement stays in view while the last panels pass it and
   * costs the block no height at all.
   */
  closing?: ReactNode;
}

/**
 * The paired researcher / performance composition.
 *
 * Measured off the reference: each of the two blocks runs about 2.5 viewport
 * heights, with the editorial column held by `position: sticky` while a stack
 * of 1.3:1 panels travels past it. The second block mirrors the first — the
 * column moves to the other side — which is what makes the two read as a
 * deliberate pair rather than the same template used twice.
 *
 * Sticky is CSS, so this stays a server component: no scroll listener, no
 * hydration cost, and it survives `prefers-reduced-motion` untouched because
 * nothing here is animated except the entrance fade.
 */
export function PairedPanels({
  eyebrow,
  title,
  body,
  cta,
  panels,
  reverse = false,
  closing,
}: PairedPanelsProps) {
  return (
    <div className="container-home">
      {/* The mirror is explicit column placement, not `order`. Ordering the
          editorial column second while the panel column declared its own
          `col-start` pushed the editorial into a second row: the mirrored
          block stopped mirroring and stacked instead, which is where 648px of
          this block's excess height came from. */}
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-8 lg:gap-16">
        {/* Editorial column — held while the panels pass it. */}
        <div
          className={cn(
            "md:col-span-5 md:row-start-1",
            reverse ? "md:col-start-8" : "md:col-start-1",
          )}
        >
          <div className="md:sticky md:top-20">
            <Reveal distance={12}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="type-display-s mt-7 whitespace-pre-line text-soft">
                {title}
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="type-mono mt-8 max-w-[46ch] text-soft/55">{body}</p>
            </Reveal>

            <Reveal delay={0.24} className="mt-10">
              <CornerFrame className="inline-block" length={10}>
                <Link
                  href={cta.href}
                  className="type-label inline-block px-7 py-4 text-soft transition-colors duration-300 hover:text-soft/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft"
                >
                  {cta.label}
                </Link>
              </CornerFrame>
            </Reveal>

            {closing ? <div className="mt-12">{closing}</div> : null}
          </div>
        </div>

        {/* Panel stack.

            One column at every width, which is what the reference does — its
            own split is at md, not lg, and its panel column stays a single
            stack of three all the way down. Panels carry a floor rather than
            relying on the 1.3:1 aspect alone: measured off the reference they
            run about 400px on a phone, 580 at 768 and 1280, and 606 at 1440.
            The aspect alone would give 322 at 768, which is what left both
            blocks 0.8vh short there. */}
        <div
          className={cn(
            // A flex column, not a grid — which is also what the reference
            // uses here, and for the same reason: a sticky *grid* item is
            // confined to its own grid area, so it has nowhere to travel and
            // never sticks at all. In a flex column the containing block is
            // the whole column, which is what lets the panels stack.
            "flex min-w-0 flex-col gap-6 md:col-span-7 md:row-start-1 lg:col-span-6",
            reverse
              ? "md:col-start-1 lg:col-start-1"
              : "md:col-start-6 lg:col-start-7",
          )}
        >
          {panels.map((panel, i) => (
            /* Stacking cards.

               This is the reference's signature movement in these two blocks
               and the thing that was most obviously missing: each panel is
               sticky at a top offset 20px below the one before it — 80, 100,
               120 — so as the block scrolls the panels ride up, pile onto one
               another and leave a 20px edge of each showing underneath. The
               offsets are the reference's own, measured off its live DOM.

               Sticky belongs on the grid item, not on the article inside the
               reveal wrapper: a sticky box can only travel within its parent's
               padding box, and the wrapper is exactly the article's height, so
               it would never move at all. The reveal animation lives inside
               the sticky box for the same reason — an animated transform on
               the sticky element itself would fight the offset. */
            <div
              key={panel.title}
              className="sticky"
              style={{ top: `${STACK_TOP + i * STACK_STEP}px` }}
            >
              <Reveal delay={i * 0.06}>
                <article
                  className={cn(
                    // Height comes from explicit floors, not from an aspect
                    // ratio. A box carrying both `aspect-ratio` and a
                    // `min-height` transfers that height back through the
                    // ratio as a minimum *width* — 520px on a phone, 749 at
                    // 768 — which widened the track it sits in and scrolled
                    // the page sideways. The ratio was redundant anyway: at
                    // every width the floor is the taller of the two.
                    "relative isolate flex min-h-[25rem] min-w-0 flex-col justify-between overflow-hidden p-8 md:min-h-[36rem] md:p-11 xl:min-h-[38rem]",
                    panel.tone === "sand"
                      ? "bg-[var(--color-cat-growth)] text-carbon"
                      : "bg-onyx text-soft",
                  )}
                >
                  {/* The card's scientific field — the reference's own
                      treatment for these panels. Drawn in the card's ink at
                      low volume, seated in the open middle of the card where
                      neither the heading nor the body runs, and part of the
                      card itself so it travels with the stack. */}
                  <SciencePattern
                    variant={
                      PATTERNS[(i + (reverse ? 2 : 0)) % PATTERNS.length] ??
                      "dots"
                    }
                    className={cn(
                      "pointer-events-none absolute right-[4%] top-1/2 -z-[1] h-[62%] w-auto max-w-[70%] -translate-y-1/2",
                      panel.tone === "sand" ? "opacity-[0.16]" : "opacity-[0.13]",
                    )}
                  />
                  <div className="flex items-start justify-between gap-6">
                    <h3
                      className={cn(
                        "type-title-s max-w-[16ch]",
                        panel.tone === "sand" ? "text-carbon" : "text-soft",
                      )}
                    >
                      {panel.title}
                    </h3>
                    <span
                      className={cn(
                        "type-label tabular-nums",
                        panel.tone === "sand" ? "text-carbon/50" : "text-soft/60",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p
                    className={cn(
                      "type-body-s max-w-[42ch]",
                      panel.tone === "sand" ? "text-carbon/70" : "text-soft/55",
                    )}
                  >
                    {panel.body}
                  </p>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
