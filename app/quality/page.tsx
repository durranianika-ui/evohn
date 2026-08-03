import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DataTable } from "@/components/common/DataTable";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { specification } from "@/data/science";
import { verificationChain } from "@/data/standards";
import { labSummary, labBatches } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Quality",
  description:
    "Verified purity, every batch. A written specification agreed before synthesis, independent analysis by accredited laboratories, and a certificate published for every release.",
  alternates: { canonical: "/quality" },
};

/** The reference's three-step quality process, in order. */
const PROCESS = [
  {
    index: "01",
    title: "Batch production",
    body: "Every batch begins under a written specification agreed before the first coupling — sequence, target purity, permitted impurity profile, residual solvent ceiling, and the analytical methods each will be judged by. Agreeing the criteria before the result exists is what stops the criteria being fitted to it.",
  },
  {
    index: "02",
    title: "Third-party verified",
    body: "Independent laboratories accredited to ISO/IEC 17025 establish identity and purity by HPLC and mass spectrometry. In-process testing informs manufacturing decisions; it does not release material. Keeping those two functions structurally separate is the point — we do not grade our own work.",
  },
  {
    index: "03",
    title: "Certificate released",
    body: "A certificate of analysis is published for every batch, carrying an accession number the issuing laboratory can retrieve independently of us. Browse them all in the lab results library — no request, no login, no gate.",
  },
];

export default function QualityPage() {
  const laboratories = Array.from(new Set(labBatches.map((b) => b.laboratory)));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Quality", href: "/quality" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Quality"
        title={"Verified purity,\nevery batch"}
        body="Quality is not a tagline — it is a process, and a process leaves a record. Every batch is judged against criteria written before it existed, analysed by a party with nothing to gain from the answer, and released with a certificate anyone can check."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Quality", href: "/quality" },
        ]}
        meta={[
          { label: "Purity specification", value: "≥ 99.0%" },
          { label: "Batches analysed", value: "100% independently" },
          { label: "Mean assayed purity", value: `${labSummary.meanPurity}%` },
          { label: "Batches re-graded", value: "0" },
        ]}
      />

      {/* Three-step process */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="How every batch reaches you"
            title={"Three steps,\nin order"}
            body="Each depends on the one before it. A specification means nothing without independent testing; independent testing means nothing unless the result is published; publication means nothing unless the certificate names a batch you can identify in your own freezer."
          />

          <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-3">
            {PROCESS.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.08}>
                <article className="border-t border-carbon/15 pt-8">
                  <p className="type-label tabular-nums text-carbon/35">
                    {step.index}
                  </p>
                  <h3 className="type-title mt-6 max-w-[20ch] text-carbon">
                    {step.title}
                  </h3>
                  <p className="type-body-s mt-6 text-carbon/68">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24} className="mt-16 flex flex-wrap gap-4">
            <Link
              href="/lab-results"
              className="type-label inline-flex min-h-12 items-center gap-3 bg-carbon px-8 py-4 text-soft"
            >
              Browse all lab results
              <span aria-hidden>&#8594;</span>
            </Link>
            <Link
              href="/journal/third-party-verification-explained"
              className="type-label inline-flex min-h-12 items-center gap-3 border border-carbon/25 px-8 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
            >
              Why independence is the point
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Specification */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-soft/55">The specification</h2>
              <p className="type-display-s mt-8 max-w-[13ch] text-soft">
                What every batch is judged against
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-soft/55">
                A batch either meets it or it is rejected. There is no
                intermediate category, because an intermediate category is where
                standards erode quietly.
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
            body="Every stage settles a question, and settles it before the next begins. Where a stage fails, the consequence is documented rather than absorbed."
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

      {/* Laboratories */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">
                Testing laboratories
              </h2>
              <p className="type-display-s mt-8 max-w-[13ch]">
                Independent by structure
              </p>
              <p className="type-body-s mt-8 max-w-[38ch] text-carbon/62">
                Two accredited laboratories are engaged, so no single analytical
                relationship becomes load-bearing. Neither has an ownership
                relationship with EVOHN or with the contracted manufacturing
                sites.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-carbon/15">
                {laboratories.map((laboratory, i) => {
                  const count = labBatches.filter(
                    (b) => b.laboratory === laboratory,
                  ).length;
                  return (
                    <Reveal key={laboratory} delay={i * 0.08} as="li">
                      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-carbon/12 py-7">
                        <span className="type-title-s text-carbon">
                          {laboratory}
                        </span>
                        <span className="type-body-s text-carbon/55">
                          ISO/IEC 17025 accredited · {count} report
                          {count === 1 ? "" : "s"}
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </ul>

              <Reveal delay={0.2} className="mt-12">
                <div className="border border-carbon/12 bg-mist/50 p-8 md:p-10">
                  <p className="type-label text-carbon/45">
                    Verifying independently
                  </p>
                  <p className="type-body mt-5 max-w-prose text-carbon/72">
                    Every certificate carries an accession number issued by the
                    testing laboratory, retrievable from that laboratory
                    directly — which is the point of publishing it. If you would
                    like a report confirmed at source, the desk will arrange it
                    rather than vouch for it.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Documentation"
        title={"Check it rather\nthan trust it."}
        body="Certificates are published for every batch, current and superseded. Archived records and confirmation at source are both handled by the research desk."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
