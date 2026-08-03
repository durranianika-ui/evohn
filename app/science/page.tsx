import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DataTable } from "@/components/common/DataTable";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { sciencePillars, specification, sciencePages } from "@/data/science";
import { verificationChain } from "@/data/standards";
import { articlesByTopic } from "@/data/journal";
import { labSummary } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Science",
  description:
    "How EVOHN establishes quality: a written specification agreed before synthesis, independent analysis by accredited laboratories, and a certificate that travels with the batch.",
  alternates: { canonical: "/science" },
};

/** Bench resources — the practical half of the section. */
const benchResources = [
  {
    title: "Reconstitution guide",
    href: "/science/reconstitution",
    body: "Preparing lyophilised material without undoing the protection lyophilisation provides.",
  },
  {
    title: "Storage & handling",
    href: "/science/storage",
    body: "Four degradation pathways, four triggers, and what each handling instruction is actually guarding against.",
  },
  {
    title: "Dilution calculator",
    href: "/science/calculator",
    body: "Concentration, volume and the arithmetic that most preparation errors come from.",
  },
  {
    title: "Compound index",
    href: "/science/compound-index",
    body: "The catalogue as a reference library — every compound, alphabetically, with its analytical record.",
  },
];

export default function SciencePage() {
  const methodReading = articlesByTopic("laboratory-methods").slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Science", href: "/science" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Science"
        title={"Verification,\nnot assertion"}
        body="Quality is either designed into a process or it is absent, and final testing simply reports which. What follows is the specification every batch is judged against, the instruments that judge it, and the party that holds the instruments — deliberately not us."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
        ]}
        meta={[
          { label: "Purity specification", value: "≥ 99.0%" },
          { label: "Identity", value: "Mass-confirmed" },
          { label: "Analysis", value: "Independent" },
          { label: "Certificates published", value: String(labSummary.certificates) },
        ]}
      />

      {/* Pillars */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="How quality is established"
            title={"Four commitments,\nin order"}
            body="Each depends on the one before it. A specification is only meaningful if something independent tests against it; independent testing is only meaningful if the result is published; publication is only meaningful if the certificate names a batch you can identify in your own freezer."
          />

          <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {sciencePillars.map((pillar, i) => (
              <Reveal key={pillar.index} delay={(i % 2) * 0.08}>
                <article className="group/pillar border-t border-carbon/15 pt-8">
                  <p className="type-label tabular-nums text-carbon/35">
                    {pillar.index}
                  </p>
                  <h3 className="type-title mt-6 max-w-[22ch] text-carbon">
                    {pillar.title}
                  </h3>
                  <p className="type-body mt-6 max-w-[46ch] text-carbon/62">
                    {pillar.body}
                  </p>
                  <Link
                    href={pillar.href}
                    className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
                  >
                    <span className="relative">
                      {pillar.linkLabel}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/pillar:w-full motion-reduce:transition-none"
                      />
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform duration-500 ease-brand group-hover/pillar:translate-x-1 motion-reduce:transition-none"
                    >
                      &#8594;
                    </span>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specification */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-soft/55">The specification</h2>
              <p className="type-display-s mt-8 max-w-[13ch] text-soft">
                Agreed before anything is made
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-soft/55">
                Writing the acceptance criteria before the result exists is what
                stops the criteria being fitted to it. A batch either meets the
                specification or it is rejected; there is no intermediate
                category, because that is where standards erode quietly.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <DataTable
                  tone="dark"
                  head={["Determination", "Specification", "Why it matters"]}
                  rows={specification.map((row) => [
                    row.label,
                    row.value,
                    row.note,
                  ])}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Chain of verification */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="Chain of verification"
            title={"From synthesis\nto release"}
            body="Every stage settles a question, and settles it before the next stage begins. Where a stage fails, the consequence is documented rather than absorbed."
          />

          <Stagger className="mt-16">
            <ol className="border-t border-carbon/15">
              {verificationChain.map((step, i) => (
                <StaggerItem key={step.title} distance={16}>
                  <li className="grid gap-4 border-b border-carbon/12 py-8 md:grid-cols-12 md:gap-10">
                    <span className="type-label flex gap-5 text-carbon/45 md:col-span-4">
                      <span className="tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </span>
                    <span className="type-body-s text-carbon/72 md:col-span-8">
                      {step.body}
                    </span>
                  </li>
                </StaggerItem>
              ))}
            </ol>
          </Stagger>
        </div>
      </section>

      {/* Reading */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">In depth</h2>
              <p className="type-display-s mt-8 max-w-[13ch]">
                The long-form treatment
              </p>
              <p className="type-body-s mt-8 max-w-[38ch] text-carbon/62">
                Each subject below has a full page rather than a paragraph. If
                you only read one, read the difference between purity and
                identity — it is the distinction most often collapsed.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-carbon/15">
                {sciencePages.map((page, i) => (
                  <Reveal key={page.slug} delay={i * 0.06} as="li">
                    <Link
                      href={`/science/${page.slug}`}
                      className="group/sci grid gap-3 border-b border-carbon/12 py-7 md:grid-cols-12 md:gap-10"
                    >
                      <span className="type-title-s text-carbon md:col-span-5">
                        <span className="relative inline">
                          {page.title}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/sci:w-full motion-reduce:transition-none"
                          />
                        </span>
                      </span>
                      <span className="type-body-s text-carbon/62 md:col-span-6">
                        {page.intro}
                      </span>
                      <span className="type-label text-carbon/35 md:col-span-1 md:text-right">
                        {page.readMinutes}m
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bench resources */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2 className="type-label text-soft/55">At the bench</h2>
              <p className="type-display-s mt-7 max-w-[16ch] text-soft">
                Practical resources
              </p>
            </div>
            <p className="type-body-s max-w-[42ch] text-soft/55">
              Preparation, stability and arithmetic — the decisions that
              determine whether a result is reproducible, gathered where they
              can be found quickly.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {benchResources.map((resource, i) => (
              <Reveal key={resource.href} delay={(i % 2) * 0.08} as="li">
                <Link
                  href={resource.href}
                  className="group/res flex h-full flex-col border border-soft/12 p-8 transition-colors duration-500 ease-brand hover:border-soft/30"
                >
                  <h3 className="type-title text-soft">
                    <span className="relative inline">
                      {resource.title}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/res:w-full motion-reduce:transition-none"
                      />
                    </span>
                  </h3>
                  <p className="type-body-s mt-5 flex-1 text-soft/55">
                    {resource.body}
                  </p>
                  <span
                    aria-hidden
                    className="type-label mt-8 inline-flex items-center gap-3 text-soft/70"
                  >
                    Open
                    <span className="transition-transform duration-500 ease-brand group-hover/res:translate-x-1 motion-reduce:transition-none">
                      &#8594;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Method writing */}
      {methodReading.length ? (
        <section className="section-y bg-mist/50 text-carbon">
          <div className="container-content">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <h2 className="type-display-s max-w-[16ch]">
                From the research desk
              </h2>
              <Link
                href="/journal"
                className="type-label inline-flex items-center gap-3 text-carbon/62 transition-colors hover:text-carbon"
              >
                The Journal
                <span aria-hidden>&#8594;</span>
              </Link>
            </div>

            <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {methodReading.map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.08}>
                  <ArticleCard
                    article={article}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CallToAction
        eyebrow="Enquiries"
        title={"Ask about a\nspecific result."}
        body="Questions about gradient conditions, detection wavelength or how a determination was made are answered against the actual certificate rather than a general statement."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
