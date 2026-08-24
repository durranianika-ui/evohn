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
 * and 32:17 from the tablet stop up, with a radial vignette, a heavier foot
 * for the type, and a breath of grain. The headline rides the bottom-left
 * of the frame; the band ends and the next section's light ground provides
 * the whitespace the reference keeps around its footage.
 *
 * ## How the film meets the band
 *
 * The film is the EVOHN brand edit, prepared by `scripts/prepare-hero-film.mjs`
 * — read that file before replacing it, because the supplied master carries a
 * watermark, a black bar and a misspelled label that the prepare pass strips.
 * What lands in `public/` is 1080x640, i.e. 27:16 (1.6875).
 *
 * That is NARROWER than the 32:17 band, so from `md` up `object-cover`
 * matches the film's width to the band's and takes its crop from the height:
 * about 10% of the frame, off the bottom, since the film is top-anchored
 * (see HeroFilm). The sides are never cropped and the film is never
 * stretched — the subject of every shot sits at or above the middle of the
 * frame and survives the trim. Below `md` the 4:5 band inverts that and
 * shows the middle 47% of the frame's width; the compositions are centred,
 * so they read, but anything that must stay whole — a wordmark spanning the
 * frame, say — cannot live in this film. That is why the prepare pass cuts
 * the end card rather than leaving it for CSS to rescue.
 *
 * The CTA is stationed on the film's upper-left corner as the hero action,
 * nothing more. Earlier footage hid a watermark under it and its geometry
 * was solved for that coverage; the mark is now cropped out of the source,
 * so the button is free to be sized however the design wants.
 */
const headline: Line[] = [
  { text: "Scientific", align: "left" },
  { text: "Precision.", align: "left" },
  { text: "Measured, Not Claimed.", align: "left" },
];

export function Hero() {
  const film = "/editorial/hero-film.mp4";
  const posterPath = "/editorial/hero-film-poster.jpg";
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

        {/* Primary CTA — stationed on the film's upper-left corner. */}
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
