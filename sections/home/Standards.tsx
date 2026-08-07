import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/common/SectionHeading";
import { StandardsCards } from "@/components/home/StandardsCards";

/**
 * Philosophy and the four standards — one block, as the reference composes it:
 * a compact editorial opening on the warm fog ground, then the interactive
 * four-card row (see StandardsCards for the measured mechanics), the whole
 * section dissolving into the dark research block below through the 200px
 * blend the reference draws on every section boundary.
 *
 * The grain layer sits behind everything; the cards are translucent with a
 * backdrop blur, so the grain is part of their material rather than a
 * texture pasted on top.
 */
export function Standards() {
  return (
    <section
      id="mission"
      className="section-blend-to-dark grain-field relative isolate overflow-hidden bg-mist pb-[clamp(6rem,16vh,12rem)] pt-[clamp(4rem,10vh,8rem)] text-carbon"
    >
      <div className="container-home relative z-[1]">
        <Reveal
          scaleFrom={0.95}
          distance={19}
          duration={1}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <Reveal distance={12}>
              <Eyebrow>Our Philosophy</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              text={"Precision before promise."}
              className="type-display-s mt-5 max-w-[18ch]"
            />
          </div>

          <div className="max-w-[46ch]">
            <Reveal delay={0.12}>
              <p className="type-body-s text-carbon/62">
                A compound earns the EVOHN name only after it has been measured.
                Purity is determined by analysis and published per lot, and
                confirmed by a laboratory with no stake in the result.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-6">
              <ArrowLink href="/about">The EVOHN Standard</ArrowLink>
            </Reveal>
          </div>
        </Reveal>

        {/* The four standards — the interactive row. */}
        <Reveal delay={0.1} distance={24} duration={0.9}>
          <StandardsCards />
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <p className="type-body-s max-w-[62ch] text-carbon/55">
            Purity figures quoted anywhere on this site are measured values
            published per batch on the certificate of analysis — not
            specifications, and not targets.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
