import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { CoaCard } from "@/components/lab/CoaCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DataTable } from "@/components/common/DataTable";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { labEntries, labSummary, labBatches } from "@/data/lab-results";
import { specification } from "@/data/science";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "Lab Results",
  description:
    "Certificates of analysis for every released batch — assayed purity, confirmed identity, content, water and residual solvents, established by accredited laboratories outside our supply chain.",
  alternates: { canonical: "/lab-results" },
};

export default function LabResultsPage() {
  const laboratories = Array.from(
    new Set(labBatches.map((b) => b.laboratory)),
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Lab Results", href: "/lab-results" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Lab Results"
        title={"Certificates\nof analysis"}
        body="Every batch released is analysed by an accredited laboratory outside our supply chain, against a specification written before the batch existed. Certificates are published as a matter of course rather than disclosed on request, and every report carries an accession number the issuing laboratory can retrieve independently of us."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Lab Results", href: "/lab-results" },
        ]}
        meta={[
          {
            label: "Certificates",
            value: String(labSummary.certificates).padStart(2, "0"),
          },
          {
            label: "Compounds covered",
            value: String(labSummary.compounds).padStart(2, "0"),
          },
          { label: "Mean assayed purity", value: `${labSummary.meanPurity}%` },
          { label: "Laboratories engaged", value: String(labSummary.laboratories) },
        ]}
      />

      {/* Quality indicators */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content py-16 md:py-20">
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                value: `${labSummary.meanPurity}%`,
                label: "Mean assayed purity across all published batches",
              },
              {
                value: "100%",
                label: "Batches analysed by an independent laboratory",
              },
              {
                value: "ISO 17025",
                label: "Accreditation held by every engaged laboratory",
              },
              {
                value: "0",
                label: "Batches re-graded to fit a result",
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.07}>
                <div>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="type-display-s block tabular-nums text-carbon">
                      {stat.value}
                    </span>
                    <span className="type-body-s mt-4 block max-w-[30ch] text-carbon/62">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* The library */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="The library"
            title={"Current batch,\nevery compound"}
            body="Each card shows the trace for the batch currently in supply, its assayed purity against the specification line, and the identifiers needed to confirm the record with the issuing laboratory."
          />

          <ul className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {labEntries.map((entry, i) => (
              <Reveal key={entry.product.slug} delay={(i % 3) * 0.07} as="li">
                <CoaCard entry={entry} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Specification */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-soft/55">The specification</h2>
              <p className="type-display-s mt-8 max-w-[14ch] text-soft">
                What every batch is judged against
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-soft/55">
                Agreed before synthesis, so the acceptance criteria can never be
                adjusted to fit a result. A batch either meets it or it is
                rejected — there is no intermediate category.
              </p>
              <Link
                href="/science/manufacturing"
                className="type-label mt-10 inline-flex items-center gap-3 text-soft"
              >
                How material is made
                <span aria-hidden>&#8594;</span>
              </Link>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <DataTable
                  tone="dark"
                  caption="Release specification"
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

      {/* Laboratories */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">
                Testing laboratories
              </h2>
              <p className="type-display-s mt-8 max-w-[14ch]">
                Independent by structure
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-carbon/62">
                Two accredited laboratories are engaged, so that no single
                analytical relationship becomes load-bearing. Neither has an
                ownership relationship with EVOHN or with the contracted
                manufacturing sites.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-carbon/12">
                {laboratories.map((laboratory, i) => {
                  const batches = labBatches.filter(
                    (b) => b.laboratory === laboratory,
                  );
                  const latest = batches
                    .map((b) => b.tested)
                    .sort()
                    .at(-1);
                  return (
                    <Reveal key={laboratory} delay={i * 0.08} as="li">
                      <div className="grid gap-3 border-b border-carbon/12 py-7 sm:grid-cols-12 sm:gap-8">
                        <span className="type-title-s text-carbon sm:col-span-5">
                          {laboratory}
                        </span>
                        <span className="type-body-s text-carbon/62 sm:col-span-4">
                          ISO/IEC 17025 accredited
                        </span>
                        <span className="type-body-s text-carbon/45 sm:col-span-3 sm:text-right">
                          {batches.length} report
                          {batches.length === 1 ? "" : "s"}
                          {latest ? ` · to ${formatDateShort(latest)}` : ""}
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </ul>

              <Reveal delay={0.2} className="mt-12">
                <div className="border border-carbon/12 bg-soft p-8 md:p-10">
                  <p className="type-label text-carbon/45">
                    Verifying independently
                  </p>
                  <p className="type-body mt-5 max-w-prose text-carbon/72">
                    Every certificate carries an accession number issued by the
                    testing laboratory. That number is retrievable from the
                    laboratory directly — which is the point of publishing it.
                    If you would like a report confirmed at source, the desk
                    will arrange it rather than vouch for it.
                  </p>
                  <Link
                    href="/journal/third-party-verification-explained"
                    className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
                  >
                    Why independence is the point
                    <span aria-hidden>&#8594;</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Documentation"
        title={"Need a historical\nbatch?"}
        body="Archived certificates, retained-sample queries and confirmation direct from the issuing laboratory are all handled by the research desk."
        secondary={{ label: "Analytical methods", href: "/science/analytical-methods" }}
      />
    </>
  );
}
