import { Reveal } from "@/components/motion/Reveal";
import { LineMask, type Line } from "@/components/motion/LineMask";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVideo } from "@/components/motion/HeroVideo";
import { asset, hasAsset } from "@/lib/media";

/**
 * Opening statement.
 *
 * Composition measured off the reference at 1440x900: the hero fills exactly
 * one viewport, a full-bleed film sits behind everything, and the headline is
 * a four-line display stack whose lines alternate against the left and right
 * edges — lines one and two left, three and four right. That alternation is
 * most of the section's character; a centred or two-column arrangement reads
 * as an ordinary landing page instead.
 *
 * The headline block starts at roughly 44% of the viewport and resolves at
 * 83%, which is what `justify-end` plus the bottom inset reproduces without
 * pinning anything to a fixed pixel height.
 *
 * The words are EVOHN's own: "measured, not claimed" is the phrase already
 * carried in `data/standards.ts`, promoted here to the cover statement.
 */
const headline: Line[] = [
  { text: "Scientific", align: "left" },
  { text: "Precision.", align: "left" },
  { text: "Measured,", align: "right" },
  { text: "Not Claimed.", align: "right" },
];

export function Hero() {
  const heroImage = "/editorial/hero-vial.jpg";
  const heroFilm = "/editorial/hero.mp4";

  return (
    <section className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden bg-ink text-soft">
      {/* Full-bleed film. Suppressed under reduced motion and on a metered
          connection — see HeroVideo, which falls back to the poster. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {hasAsset(heroFilm) ? (
          <HeroVideo
            src={asset(heroFilm)}
            poster={hasAsset(heroImage) ? asset(heroImage) : undefined}
            className="h-full w-full object-cover"
          />
        ) : null}
        {/* One even sink so the film reads as ground, then a heavier foot so
            the display type keeps its contrast where it actually sits. */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      </div>

      <div className="container-content relative pt-32 pb-[8vh]">
        <Reveal distance={0} duration={0.8}>
          <p className="type-label text-soft/55">Research Compounds</p>
        </Reveal>

        <LineMask
          as="h1"
          lines={headline}
          delay={0.15}
          className="type-display-l mt-6 text-soft"
        />

        <Reveal delay={0.62} distance={12} className="mt-10 flex justify-end">
          <ButtonLink href="/catalogue" tone="dark">
            View Catalogue
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
