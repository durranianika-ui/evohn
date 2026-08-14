import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/common/SectionHeading";
import { ArrowLink } from "@/components/ui/Button";
import { products } from "@/data/products";
import { asset } from "@/lib/media";

/**
 * The pen stage.
 *
 * The pen is half of what EVOHN supplies and had no presence on the site at
 * all — no render, no mention outside a dosage line. It gets a stage of its
 * own here, between the collection and the dissolve, where the page has just
 * finished walking the compounds and can be shown the second form they come
 * in.
 *
 * The rail is a pure CSS marquee: two identical halves translating by exactly
 * -50%, so the loop closes without a jump and nothing has to run in JavaScript
 * to keep twelve photographs moving. It is deliberately slow — a full pass
 * takes a minute and a half — because the point is that each pen is legible,
 * not that the band is busy. `motion-reduce` stops it outright and the rail
 * becomes a normal horizontal scroller.
 */
export function Presentations() {
  const pens = products
    .map((product) => {
      const pen = product.presentations.find((p) => p.kind === "pen");
      return pen ? { slug: product.slug, name: product.name, image: pen.image } : null;
    })
    .filter((p): p is { slug: string; name: string; image: string } => p !== null);

  // One half of the track. Built once and rendered twice — the second copy is
  // what makes -50% land exactly on the first pen again.
  const half = (
    <div className="flex shrink-0" aria-hidden>
      {pens.map((pen) => (
        <div
          key={pen.slug}
          className="relative aspect-[1276/753] w-[62vw] shrink-0 sm:w-[42vw] lg:w-[26vw]"
        >
          <Image
            src={asset(pen.image)}
            alt=""
            fill
            sizes="(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 62vw"
            loading="lazy"
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-onyx text-soft">
      <div className="container-home pt-[clamp(4rem,9vh,7rem)]">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal distance={10}>
            <Eyebrow className="text-[var(--color-cat-growth)] opacity-100">
              The Pen
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="type-display-s mt-4 text-soft">
              The same compound, pre-filled.
            </h2>
          </Reveal>
          <Reveal delay={0.16} className="mt-6">
            <p className="type-body max-w-[54ch] text-soft/60">
              Every compound in the catalogue is supplied in two presentations:
              the lyophilised vial, reconstituted before use, and a metered
              delivery device carrying the identical certified material —
              released against the same specification, under the same cold
              chain, traceable to the same batch.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-8">
            <ArrowLink href="/catalogue?as=pen" className="text-soft">
              See the catalogue as pens
            </ArrowLink>
          </Reveal>
        </div>
      </div>

      {/* The rail.

          `tabIndex` is deliberate, not decorative: the band scrolls
          horizontally, and a scrollable region with no focusable content
          inside it cannot be reached or panned from the keyboard at all. */}
      <div
        className={
          "relative mt-[clamp(2rem,5vh,4rem)] w-full min-w-0 overflow-x-auto pb-[clamp(3rem,7vh,5rem)] " +
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-soft " +
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }
        role="group"
        tabIndex={0}
        aria-label={`The EVOHN pen, in ${pens.length} presentations`}
      >
        <div
          className="flex w-max animate-[marquee_var(--rail-speed)_linear_infinite] motion-reduce:animate-none"
          style={{ ["--rail-speed" as string]: "90s" }}
        >
          {half}
          {half}
        </div>
      </div>

      {/* Edge fades, so pens enter and leave the band rather than being cut
          off against a hard edge. Pointer-events off — the rail beneath is
          still scrollable under reduced motion. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-[linear-gradient(to_right,var(--color-onyx),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-[linear-gradient(to_left,var(--color-onyx),transparent)]"
      />
    </section>
  );
}
