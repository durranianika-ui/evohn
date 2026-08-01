import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { SectionHeading, Eyebrow } from "@/components/common/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ParallaxImage } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { VialGlyph } from "@/components/product/VialGlyph";
import { JsonLd } from "@/components/common/JsonLd";
import { capabilities } from "@/data/standards";
import { asset, hasAsset } from "@/lib/media";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "EVOHN exists to remove uncertainty from research — through measured purity, independent verification and documentation that holds up to scrutiny.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Research",
    body: "We publish what we measure. Every claim on this site traces back to an analytical result on a specific lot, and where a result is not available, we say nothing.",
  },
  {
    title: "Precision",
    body: "Tolerance is decided before synthesis begins, not negotiated afterwards. A batch either meets the specification recorded in its own documentation, or it does not leave the facility.",
  },
  {
    title: "Quality",
    body: "Materials, containers and closures are qualified as rigorously as the compound they hold. Presentation is not decoration — an amber vial and a butyl stopper are stability decisions.",
  },
  {
    title: "Innovation",
    body: "Method development continues after a compound enters the catalogue. Improving how accurately we can measure something is as valuable as expanding what we offer.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />

      <PageHero
        eyebrow="The Brand"
        title={"Certainty,\nmanufactured."}
        body={site.tagline}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      {/* Mission */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <Reveal distance={12}>
                <Eyebrow>Our Mission</Eyebrow>
              </Reveal>

              <SplitText
                as="h2"
                text={"Research fails on\nbad inputs."}
                className="type-display mt-8"
              />

              <Reveal delay={0.16} className="mt-10">
                <p className="type-body max-w-[58ch] text-carbon/62">
                  A result is only as trustworthy as the material that produced
                  it. When purity is assumed rather than established, an entire
                  programme inherits an error it has no way of seeing — and the
                  cost of that error is paid months later, in work that cannot
                  be reproduced.
                </p>
              </Reveal>

              <Reveal delay={0.24} className="mt-7">
                <p className="type-body max-w-[58ch] text-carbon/62">
                  EVOHN was founded to close that gap. We manufacture to a
                  documented specification, measure the outcome, publish the
                  measurement, and have it confirmed by a laboratory with no
                  interest in the answer. Nothing about that process is
                  remarkable. It is simply done, every time, without exception.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <ParallaxImage
                className="relative aspect-3/4 w-full bg-[radial-gradient(120%_90%_at_50%_20%,var(--color-mist)_0%,var(--color-warm)_60%,#aea79f_100%)]"
                from={1.12}
              >
                {hasAsset("/editorial/packaging.jpg") ? (
                  <Image
                    src={asset("/editorial/packaging.jpg")}
                    alt="EVOHN matte debossed box with foam insert and vial"
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-[16%]">
                    <VialGlyph
                      caption="Tirzepatide"
                      seed={11}
                      className="h-full w-auto drop-shadow-[0_30px_50px_rgba(60,52,46,0.36)]"
                    />
                  </div>
                )}
              </ParallaxImage>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <SectionHeading
            eyebrow="Principles"
            title={"Four positions\nwe do not trade."}
            size="display"
          />

          <Stagger className="mt-20 grid gap-px border border-soft/12 bg-soft/12 md:grid-cols-2">
            {principles.map((principle, i) => (
              <StaggerItem key={principle.title} className="bg-carbon">
                <article className="flex h-full flex-col gap-10 p-10 lg:p-14">
                  <span className="type-label tabular-nums text-soft/55">
                    {String(i + 1).padStart(2, "0")} / {String(principles.length).padStart(2, "0")}
                  </span>
                  <h3 className="type-title text-soft">{principle.title}</h3>
                  <p className="type-body-s max-w-[46ch] text-soft/55">
                    {principle.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="bg-mist text-carbon">
        <div className="border-y border-carbon/12 py-7">
          <Marquee
            text="Synthesis — Purification — Verification — Documentation"
            className="type-display-s text-carbon/50"
            speed={62}
          />
        </div>

        <div className="container-content section-y">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal distance={12}>
                <Eyebrow>Manufacturing</Eyebrow>
              </Reveal>
              <SplitText
                as="h2"
                text={"The facility\nis the product."}
                className="type-display mt-8"
              />
              <Reveal delay={0.16} className="mt-10">
                <p className="type-body max-w-[46ch] text-carbon/62">
                  Classified environments, validated storage and instrumentation
                  under documented method validation. What a facility can prove
                  about itself determines what its output is worth.
                </p>
              </Reveal>
            </div>

            <Stagger className="lg:col-span-6 lg:col-start-7">
              <ul className="border-t border-carbon/12">
                {capabilities.map((item, i) => (
                  <StaggerItem key={item.title} distance={18}>
                    <li className="flex gap-8 border-b border-carbon/12 py-8">
                      <span className="type-label shrink-0 tabular-nums text-carbon/62">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="type-title-s">{item.title}</h3>
                        <p className="type-body-s mt-3 max-w-[46ch] text-carbon/62">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </Stagger>
          </div>
        </div>
      </section>

      {/* Voice — Brand Identity Kit §12 */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading eyebrow="Brand Voice" title="How we speak." />

          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:gap-20">
            <Reveal>
              <h3 className="type-label text-carbon/62">We are</h3>
              <ul className="mt-8 border-t border-carbon/12">
                {site.voice.are.map((word) => (
                  <li key={word} className="type-title border-b border-carbon/12 py-5">
                    {word}.
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="type-label text-carbon/62">We are not</h3>
              <ul className="mt-8 border-t border-carbon/12">
                {site.voice.areNot.map((word) => (
                  <li
                    key={word}
                    className="type-title border-b border-carbon/12 py-5 text-carbon/62"
                  >
                    {word}.
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <CallToAction secondary={{ label: "Our Science", href: "/science" }} />
    </>
  );
}
