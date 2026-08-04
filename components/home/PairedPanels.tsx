import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { Eyebrow } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

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
}: PairedPanelsProps) {
  return (
    <div className="container-home">
      <div
        className={cn(
          "grid gap-12 lg:grid-cols-12 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        {/* Editorial column — held while the panels pass it. */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[18vh]">
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
          </div>
        </div>

        {/* Panel stack.

            Two across between 640 and 1024: at tablet a single column of
            full-width 1.3:1 panels ran roughly 590px each, and three of them
            plus the editorial column was most of why these two blocks were
            +0.32 and +0.59vh at 768. Back to one column at lg, where the
            editorial column takes half the width and the reference stacks
            them again. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:grid-cols-1">
          {panels.map((panel, i) => (
            <Reveal key={panel.title} delay={i * 0.06}>
              <article
                className={cn(
                  "flex aspect-[1.3/1] flex-col justify-between p-8 md:p-11",
                  panel.tone === "sand"
                    ? "bg-[var(--color-cat-growth)] text-carbon"
                    : "bg-onyx text-soft",
                )}
              >
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
          ))}
        </div>
      </div>
    </div>
  );
}
