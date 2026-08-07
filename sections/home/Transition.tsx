import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";

/**
 * The post-collection dissolve.
 *
 * The reference lets its dark product stage fall away into a large, light
 * negative-space passage: a tall vertical blend from the near-black into the
 * soft ground, with a blurred atmospheric mass drifting against the scroll,
 * and then the thin repeating standard band. Nothing lives in the empty
 * stretch on purpose — the pause is the content.
 *
 * The gradient is static; the movement is the parallax layer beneath it and
 * the page travelling through, which is exactly how the reference produces
 * its "scroll-linked" read without a scroll listener.
 */
export function Transition() {
  return (
    <>
      <div
        aria-hidden
        className="relative -mt-px h-[120vh] overflow-hidden bg-[linear-gradient(to_bottom,var(--color-onyx)_0%,var(--color-onyx)_14%,#37342f_44%,#8d877c_66%,#c9c4ba_80%,var(--color-soft)_92%)]"
      >
        {/* The atmospheric mass — a soft light bloom rising through the dark
            as the passage scrolls, blurred far past legibility. */}
        <Parallax distance={-160} className="absolute inset-x-0 top-[18%]">
          <div className="mx-auto h-[60vh] w-[85vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(237,234,227,0.32)_0%,rgba(237,234,227,0.10)_45%,transparent_70%)] blur-[60px]" />
        </Parallax>
        <div aria-hidden className="grain-field absolute inset-0" />
      </div>

      {/* The standard band. Understated and technical: hairline rules, mono
          uppercase, continuous travel. */}
      <section className="bg-soft py-[clamp(2rem,6vh,4rem)] text-carbon">
        <div className="hairline-t hairline-b py-4">
          <Marquee
            text="The EVOHN Standard"
            speed={28}
            repeat={8}
            className="type-label-lg text-carbon/55"
          />
        </div>
      </section>
    </>
  );
}
