import Image from "next/image";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/common/SectionHeading";
import { ParallaxImage } from "@/components/motion/Parallax";
import { VialGlyph } from "@/components/product/VialGlyph";
import { asset, hasAsset } from "@/lib/media";

export function Philosophy() {
  const editorial = "/editorial/philosophy-vial.jpg";

  return (
    /* Ground is `mist` (#edeae3), not `soft` (#f5f4f0): measured off the
       reference, which uses its warmer neutral here and reserves the lighter
       one for the facility block further down. The two are close enough to
       read as a mistake and far enough apart to change the section's weight. */
    <section id="mission" className="section-y scroll-mt-24 bg-mist text-carbon">
      <div className="container-content">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <ParallaxImage className="relative aspect-4/5 w-full bg-[radial-gradient(120%_90%_at_50%_20%,var(--color-mist)_0%,var(--color-warm)_60%,#b0a9a1_100%)]">
              {hasAsset(editorial) ? (
                <Image
                  src={asset(editorial)}
                  alt="EVOHN vial with ivory label on warm stone"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-[14%]">
                  <VialGlyph
                    caption="NAD+"
                    labelColor="var(--color-cat-longevity)"
                    labelIsLight
                    seed={7}
                    className="h-full w-auto drop-shadow-[0_30px_50px_rgba(60,52,46,0.36)]"
                  />
                </div>
              )}
            </ParallaxImage>
          </div>

          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <Reveal distance={12}>
              <Eyebrow>Our Philosophy</Eyebrow>
            </Reveal>

            <SplitText
              as="h2"
              text={"Precision\nbefore promise."}
              className="type-display mt-8"
            />

            <Reveal delay={0.14} className="mt-10">
              <p className="type-body max-w-[52ch] text-carbon/62">
                A compound earns the EVOHN name only after it has been measured.
                Purity is determined by analysis and published per lot, identity
                is confirmed by mass spectrometry, and both are repeated by an
                accredited laboratory that has no stake in the result.
              </p>
            </Reveal>

            <Reveal delay={0.22} className="mt-7">
              <p className="type-body max-w-[52ch] text-carbon/62">
                We exist to remove uncertainty from research. That is a
                documentation problem before it is a chemistry problem, and we
                treat it as one.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-12">
              <ArrowLink href="/about">The EVOHN Standard</ArrowLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
