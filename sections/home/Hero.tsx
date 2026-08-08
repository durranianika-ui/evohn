import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { LineMask, type Line } from "@/components/motion/LineMask";
import { HeroFilm } from "@/components/home/HeroFilm";
import { asset, hasAsset } from "@/lib/media";

/**
 * Opening statement — the reference-labs hero, rebuilt for EVOHN.
 *
 * The film is a full-width band sitting under the fixed header, exactly as
 * the reference presents its own product footage: portrait 4:5 on a phone
 * and the film's native 32:17 from the tablet stop up, with a radial
 * vignette, a heavier foot for the type, and a breath of grain. The
 * headline rides the bottom-left of the frame; the band ends and the next
 * section's light ground provides the whitespace the reference keeps around
 * its footage.
 *
 * ## The CTA doubles as the mark cover
 *
 * The supplied footage carries a small watermark in its upper-left corner.
 * The primary CTA is deliberately stationed over that corner so the mark is
 * never visible — measured off the source frames (1920x1020), the mark
 * occupies 3.5–8.1% of the frame's width and 6.8–12% of its height, i.e.
 * 3.5vw–8.1vw across and 3.61vw–6.38vw down once the film spans the full
 * viewport width. The frame is the film's NATIVE ratio from `md` up (not
 * 16:9) precisely so `object-cover` never crops the sides: this mark hugs
 * the left edge, and any horizontal crop slides it out from under the
 * button. With the film top-anchored (see HeroFilm) the `max-h` clamp can
 * only crop the bottom, so the mark's position stays a pure function of
 * viewport width. The CTA's inset (2vw), minimum height (max(3rem, 4.75vw))
 * and minimum width (max(10rem, 13vw)) are solved against those bounds, so
 * the button covers the mark at every viewport from 768 to ultrawide
 * without ever reading as a patch. Below `md` the 4:5 crop removes the
 * corner of the frame the mark lives in entirely; the CTA simply remains
 * the hero action.
 *
 * Do not swap the CTA for a transparent variant: opacity is load-bearing.
 */
const headline: Line[] = [
  { text: "Scientific", align: "left" },
  { text: "Precision.", align: "left" },
  { text: "Measured, Not Claimed.", align: "left" },
];

export function Hero() {
  const film = "/editorial/hero-pen-fhd.mp4";
  const posterPath = "/editorial/hero-pen-fhd-poster.jpg";
  const poster = hasAsset(posterPath) ? asset(posterPath) : undefined;

  return (
    <section className="relative bg-ink text-soft">
      {/* Clearance for the fixed header, so the band's top-left corner —
          and the CTA parked on it — sits below the wordmark. */}
      <div aria-hidden className="h-18" />

      <div className="relative aspect-[4/5] max-h-[88svh] w-full overflow-hidden bg-ink md:aspect-[32/17]">
        {hasAsset(film) ? <HeroFilm src={asset(film)} poster={poster} /> : null}

        {/* The reference's treatment: radial vignette, heavier foot, grain. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.10)_55%,rgba(10,10,10,0.42)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
        />
        <div aria-hidden className="grain-field pointer-events-none absolute inset-0" />

        {/* Primary CTA — stationed over the film's upper-left corner. The
            geometry is coverage-critical; see the section comment. */}
        <Link
          href="/catalogue"
          className="group/cta type-label absolute left-[max(1rem,2vw)] top-[max(0.875rem,2vw)] z-20 inline-flex min-h-[max(3rem,4.75vw)] min-w-[max(10rem,13vw)] items-center justify-center gap-3 bg-soft px-[clamp(1.25rem,2vw,2.5rem)] text-carbon transition-colors duration-500 ease-brand hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft"
        >
          {/* Rolling label — the reference's own button gesture. */}
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-500 ease-brand group-hover/cta:-translate-y-full motion-reduce:transition-none">
              View Catalog
            </span>
            <span
              aria-hidden
              className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-brand group-hover/cta:translate-y-0 motion-reduce:hidden"
            >
              View Catalog
            </span>
          </span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-brand group-hover/cta:translate-x-1 motion-reduce:transition-none"
          >
            &#8594;
          </span>
        </Link>

        {/* Statement — bottom-left of the frame, as the reference sets its
            own headline against the footage. */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <Reveal distance={0} duration={0.8} delay={0.2}>
            <p className="type-label text-soft/60">Research Compounds</p>
          </Reveal>

          <LineMask
            as="h1"
            lines={headline}
            delay={0.35}
            className="type-display mt-5 max-w-[16ch] text-soft"
          />
        </div>
      </div>
    </section>
  );
}
