import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Figure } from "@/components/common/Figure";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ParallaxImage } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { JsonLd } from "@/components/common/JsonLd";
import {
  aboutStats,
  facilities,
  leadership,
  mission,
  timeline,
  values,
} from "@/data/about";
import { site } from "@/data/site";
import { breadcrumbSchema, organisationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "EVOHN exists to make quality something you can check rather than something you are asked to trust — a written specification, independent analysis, and a certificate that travels with the batch.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          organisationSchema(),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="About"
        title={"Documented\nat every step"}
        body="EVOHN began as a procurement problem inside a research group: four suppliers, four incompatible certificate formats, and no reliable way to tie a vial in the freezer to the analysis that released it. The first work was not chemistry. It was a specification document."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
        meta={aboutStats.map((stat) => ({
          label: stat.label,
          value: stat.value,
        }))}
      />

      {/* Mission */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="type-label text-carbon/45">{mission.eyebrow}</p>
              <SplitText
                as="h2"
                text={mission.title}
                className="type-display mt-8 max-w-[14ch]"
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              {mission.body.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="type-body mt-7 max-w-prose text-carbon/72 first:mt-0">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial plate */}
      <section className="bg-soft">
        <div className="container-content">
          <ParallaxImage className="w-full">
            <Figure
              src="/editorial/philosophy-vial.jpg"
              alt="EVOHN presentation vial under studio light"
              placeholderLabel="Editorial plate"
              sizes="100vw"
              className="aspect-21/9 w-full"
            />
          </ParallaxImage>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <SectionHeading
            eyebrow="What we hold to"
            title={"Four positions,\nheld in public"}
            body="Each of these costs us something. That is generally how you can tell a position from a slogan."
          />

          <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {values.map((value, i) => (
              <Reveal key={value.index} delay={(i % 2) * 0.08}>
                <article className="border-t border-soft/15 pt-8">
                  <p className="type-label tabular-nums text-soft/35">
                    {value.index}
                  </p>
                  <h3 className="type-title mt-6 max-w-[20ch] text-soft">
                    {value.title}
                  </h3>
                  <p className="type-body mt-6 max-w-[46ch] text-soft/62">
                    {value.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="How we got here"
            title={"Six years,\nin order"}
            body="Not a growth story. A sequence of decisions about what would and would not be acceptable, most of them taken before there was a catalogue to apply them to."
          />

          <Stagger className="mt-20">
            <ol className="border-t border-carbon/15">
              {timeline.map((entry, i) => (
                <StaggerItem key={entry.year} distance={18}>
                  <li className="grid gap-4 border-b border-carbon/12 py-10 md:grid-cols-12 md:gap-10">
                    <span className="type-display-s tabular-nums text-carbon/25 md:col-span-2">
                      {entry.year}
                    </span>
                    <h3 className="type-title text-carbon md:col-span-4">
                      {entry.title}
                    </h3>
                    <p className="type-body-s max-w-prose text-carbon/68 md:col-span-6">
                      {entry.body}
                    </p>
                    <span className="sr-only">
                      Step {i + 1} of {timeline.length}
                    </span>
                  </li>
                </StaggerItem>
              ))}
            </ol>
          </Stagger>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="section-y scroll-mt-24 bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="Facilities"
            title={"Where the\nwork happens"}
            body="Synthesis, lyophilisation and analysis are contracted rather than owned. That is a deliberate structure: it keeps the party that makes the material separate from the party that judges it."
          />

          <div className="mt-20 flex flex-col gap-20 md:gap-28">
            {facilities.map((facility, i) => (
              <article
                key={facility.name}
                className={
                  i % 2 === 1
                    ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16 lg:[&>*:first-child]:order-2"
                    : "grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                }
              >
                <Reveal duration={1}>
                  <Figure
                    src={facility.image}
                    alt={`${facility.name} — ${facility.location}`}
                    placeholderLabel={facility.role}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="aspect-4/3 w-full"
                  />
                </Reveal>

                <div>
                  <div className="type-label flex items-center gap-4 text-carbon/45">
                    <span className="tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-carbon/12" />
                    <span>{facility.role}</span>
                  </div>
                  <h3 className="type-display-s mt-7 max-w-[16ch]">
                    {facility.name}
                  </h3>
                  <p className="type-label mt-5 text-carbon/45">
                    {facility.location}
                  </p>
                  <p className="type-body mt-7 max-w-[48ch] text-carbon/68">
                    {facility.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <Reveal className="mt-20">
            <Link
              href="/science/manufacturing"
              className="type-label inline-flex items-center gap-3 border border-carbon/20 px-8 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
            >
              Manufacturing and release in full
              <span aria-hidden>&#8594;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section-y scroll-mt-24 bg-carbon text-soft">
        <div className="container-content">
          <SectionHeading
            eyebrow="Leadership"
            title={"The people\naccountable"}
            body="Release decisions have a name attached. Where a batch is rejected, it is rejected by someone rather than by a policy."
          />

          <ul className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person, i) => (
              <Reveal key={person.name} delay={(i % 4) * 0.07} as="li">
                <Figure
                  src={person.image}
                  alt=""
                  placeholderLabel={person.discipline}
                  tone="dark"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                  className="aspect-3/4 w-full"
                />
                <h3 className="type-title mt-7 text-soft">{person.name}</h3>
                <p className="type-label mt-3 text-soft/45">{person.role}</p>
                <p className="type-body-s mt-5 text-soft/62">{person.bio}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Assurance band */}
      <section className="border-y border-carbon/10 bg-soft py-10 text-carbon">
        <Marquee
          text={site.assurances.join("  ·  ")}
          repeat={2}
          speed={62}
          className="type-label text-carbon/40"
        />
      </section>

      {/* Vision */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="mx-auto max-w-[62ch] text-center">
            <p className="type-label text-carbon/45">Vision</p>
            <SplitText
              as="h2"
              text={"A market that\nexplains itself"}
              className="type-display mt-8"
            />
            <Reveal delay={0.16} className="mt-10">
              <p className="type-body text-carbon/68">
                The research compound market is opaque because opacity is
                profitable. It stops being profitable the moment enough
                suppliers publish enough documentation that a buyer can compare
                one against another. We would rather compete on that basis than
                on the strength of a claim, and we publish accordingly.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Ask us something\nspecific."}
        body="Questions about a batch, a method, a facility or a supply arrangement are answered by the person responsible for it."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
