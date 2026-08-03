import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DataTable } from "@/components/common/DataTable";
import { Figure } from "@/components/common/Figure";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/Parallax";
import { JsonLd } from "@/components/common/JsonLd";
import { getCategory } from "@/data/categories";
import {
  advantages,
  comparison,
  howItWorks,
  strips,
  stripStats,
} from "@/data/strips";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pocket Strips",
  description:
    "Pharmaceutical-grade oral dissolvable peptide films. No reconstitution, no syringe, no cold chain — sublingual delivery in a sealed, portable format. For laboratory research use only.",
  alternates: { canonical: "/strips" },
};

const BAND =
  "No needles · No mixing · No refrigeration · Sublingual absorption · Pharmaceutical grade";

export default function StripsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Pocket Strips", href: "/strips" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="New Format"
        title={"Peptide\npocket strips"}
        body="Pharmaceutical-grade oral dissolvable films. The vial catalogue solves purity; this format solves everything that happens after it — reconstitution, cold chain, and the assumption that research is conducted at a bench."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Pocket Strips", href: "/strips" },
        ]}
        meta={[
          { label: "Formats", value: String(strips.length).padStart(2, "0") },
          { label: "Per box", value: "30 strips" },
          { label: "Dissolve time", value: "15–30 seconds" },
          { label: "Storage", value: "Ambient" },
        ]}
      />

      {/* Assurance band */}
      <section className="border-b border-carbon/10 bg-soft py-7 text-carbon">
        <Marquee
          text={BAND}
          repeat={3}
          speed={58}
          className="type-label text-carbon/40"
        />
      </section>

      {/* How it works */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="Simple by design"
            title={"How it works"}
            size="display"
            body="Three steps, none of which involve a syringe, a diluent or a freezer."
          />

          <ol className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.08} as="li">
                <div className="border-t border-carbon/15 pt-8">
                  <p className="type-label tabular-nums text-carbon/35">
                    {step.index}
                  </p>
                  <h3 className="type-title mt-6 text-carbon">{step.title}</h3>
                  <p className="type-body mt-5 max-w-[36ch] text-carbon/62">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Advantages */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <SectionHeading
            eyebrow="The advantage"
            title={"Why an oral film"}
            size="display"
            body="The vial format is the right answer to a purity problem and the wrong answer to a logistics one. This is the second answer."
            className="[&_p]:text-soft/55"
          />

          <ul className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item, i) => (
              <Reveal key={item.index} delay={(i % 3) * 0.08} as="li">
                <div className="border-t border-soft/15 pt-8">
                  <p className="type-label tabular-nums text-soft/35">
                    {item.index}
                  </p>
                  <h3 className="type-title mt-6 max-w-[18ch] text-soft">
                    {item.title}
                  </h3>
                  <p className="type-body-s mt-5 text-soft/62">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="Delivery comparison"
            title={"Films against\nthe alternatives"}
            body="What each format can and cannot do. A tilde marks a property that holds for some preparations of that type but not reliably across them."
          />

          <Reveal className="mt-16">
            <DataTable head={comparison.head} rows={comparison.rows} />
          </Reveal>
        </div>
      </section>

      {/* The collection */}
      <section id="collection" className="section-y scroll-mt-24 bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="The collection"
            title={"Choose your\ncompound"}
            size="display"
            body="Each film is loaded for a single research question. Where a film carries more than one compound, it is marked as a stack."
          />

          <ul className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {strips.map((strip, i) => {
              const category = getCategory(strip.category);
              return (
                <Reveal key={strip.slug} delay={(i % 3) * 0.07} as="li">
                  <article className="group/strip flex h-full flex-col">
                    <div className="relative overflow-hidden">
                      <Figure
                        src={strip.image}
                        alt={`${strip.name} — ${strip.compound}`}
                        placeholderLabel={category.name}
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                        className="aspect-4/5 w-full transition-transform duration-[1.2s] ease-brand group-hover/strip:scale-[1.045] motion-reduce:transition-none"
                      />
                      <span className="type-label absolute top-5 left-5 flex gap-2">
                        {strip.isStack ? (
                          <span className="bg-carbon px-3 py-1.5 text-soft">
                            Stack
                          </span>
                        ) : null}
                        <span className="bg-soft/90 px-3 py-1.5 text-carbon/70">
                          COA
                        </span>
                      </span>
                    </div>

                    <div className="mt-7 flex flex-1 flex-col">
                      <div className="type-label flex items-center justify-between gap-4 text-carbon/62">
                        <span>{category.name}</span>
                        <span className="tabular-nums">{strip.perBox}</span>
                      </div>
                      <h3 className="type-title mt-4 text-carbon">
                        {strip.name}
                      </h3>
                      <p className="type-label mt-3 text-carbon/45">
                        {strip.loading}
                      </p>
                      <p className="type-body-s mt-4 flex-1 text-carbon/62">
                        {strip.summary}
                      </p>
                      <WhatsAppCTA
                        product={strip.name}
                        intent="information"
                        variant="outline"
                        tone="light"
                        className="mt-7 w-full"
                      />
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Full-bleed plate */}
      <section className="bg-soft">
        <ParallaxImage className="w-full">
          <Figure
            src="/strips/lifestyle.jpg"
            alt="EVOHN pocket strip sachets on a laboratory bench"
            placeholderLabel="Editorial plate"
            sizes="100vw"
            className="aspect-21/9 w-full"
          />
        </ParallaxImage>
      </section>

      {/* Technology */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="type-label text-soft/55">Our technology</h2>
              <p className="type-display-s mt-8 max-w-[15ch] text-soft">
                Pharmaceutical-grade film
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="type-body max-w-prose text-soft/72">
                EVOHN uses pharmaceutical-grade oral dissolvable film
                technology — a delivery system built to address the three
                problems that govern a lyophilised vial: the reconstitution
                step, the cold chain, and the handling error that both
                introduce.
              </p>
              <p className="type-body mt-7 max-w-prose text-soft/72">
                The film dissolves against the oral mucosa and delivers its
                load directly, rather than through gastric acid and first-pass
                hepatic metabolism. Each film is loaded at manufacture and
                sealed individually under moisture control, so the analytical
                record that released the batch still describes the material at
                the point of use.
              </p>

              <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-soft/15 pt-10">
                {stripStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="type-display-s block tabular-nums text-soft">
                        {stat.value}
                      </span>
                      <span className="type-label mt-3 block text-soft/45">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/lab-results"
                className="type-label mt-12 inline-flex items-center gap-3 text-soft"
              >
                Every film carries a batch certificate
                <span aria-hidden>&#8594;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Upgrade the\nformat."}
        body="Ask a specialist which films are currently in supply, what each carries, and what can be sent to your territory."
        secondary={{ label: "Full catalogue", href: "/catalogue" }}
      />
    </>
  );
}
