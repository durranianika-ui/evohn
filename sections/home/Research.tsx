import { Reveal } from "@/components/motion/Reveal";
import { LineMask } from "@/components/motion/LineMask";
import { Eyebrow } from "@/components/common/SectionHeading";
import { DotWave } from "@/components/home/DotWave";

/**
 * The research introduction — one full viewport, centred copy, and the
 * continuously moving dot-wave field behind it. The type stays sharp and
 * dominant; the field is texture in motion, never louder than 15% alpha.
 *
 * This block and the domain index below it share one dark ground; the
 * boundary between them is invisible by design, which is why neither carries
 * a blend class between the two.
 */
export function Research() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden bg-onyx text-soft">
      <DotWave className="-z-[1]" />

      <div className="container-home flex justify-center py-[clamp(6rem,14vh,10rem)] text-center">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-[30px]">
          <Reveal distance={10}>
            <Eyebrow className="text-stone">Our Research</Eyebrow>
          </Reveal>

          <LineMask
            as="h2"
            lines={[
              { text: "Eight Domains.", align: "center" },
              { text: "One Standard of", align: "center" },
              { text: "Excellence.", align: "center" },
            ]}
            delay={0.1}
            className="type-display text-center text-soft"
          />

          <Reveal delay={0.35} distance={14}>
            <p className="type-body-s max-w-[62ch] text-soft/55">
              From regenerative peptides to metabolic modulators, every
              compound in our catalog undergoes the same rigorous verification.
              Because precision isn&rsquo;t a feature &mdash; it&rsquo;s the
              foundation.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
