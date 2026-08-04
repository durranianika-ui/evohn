import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Chromatogram } from "@/components/lab/Chromatogram";
import { PurityMeter } from "@/components/lab/PurityMeter";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { labEntries, labSummary } from "@/data/lab-results";
import { formatDateShort } from "@/lib/format";

/**
 * Verification proof on the home page.
 *
 * Shows an actual trace from an actual batch rather than an assurance about
 * traces in general. The claim the section makes is checkable from the page
 * it is made on, which is the entire argument of the brand.
 */
export function Verification() {
  const showcase = labEntries.slice(0, 4);
  const lead = showcase[0];
  if (!lead) return null;

  return (
    <section className="section-y-home bg-carbon text-soft">
      <div className="container-home">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Lab Results"
            title={"Published, not\non request."}
            size="display"
            body="Every batch released is analysed by an accredited laboratory outside our supply chain. Certificates carry an accession number the issuing laboratory can retrieve independently of us — which is the point of publishing it."
            className="lg:max-w-3xl [&_p]:text-soft/55 [&_p.type-label]:text-soft/55"
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/lab-results" tone="dark" variant="outline">
              Open the COA Library
            </ButtonLink>
          </Reveal>
        </div>

        {/* The twelve-column split starts at md, not lg. Waiting for 1024 gave
            a 768 tablet one full-width stacked column and ran the block to
            1802px against the reference's 1106 — the largest single defect at
            that width. */}
        <div className="mt-20 grid gap-14 md:grid-cols-12 md:gap-10 lg:gap-16">
          {/* Lead trace */}
          <div className="md:col-span-7">
            <Reveal duration={1}>
              <div className="border border-soft/12 p-7 md:p-10">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="type-label text-soft/60">
                      {lead.product.name} · Batch {lead.batch.batch}
                    </p>
                    <p className="type-body-s mt-2 text-soft/60">
                      {lead.batch.laboratory} ·{" "}
                      {formatDateShort(lead.batch.tested)}
                    </p>
                  </div>
                  <VerifiedBadge verified={lead.batch.verified} tone="dark" />
                </div>

                <div className="mt-8">
                  <Chromatogram peaks={lead.batch.chromatogram} tone="dark" />
                </div>

                <PurityMeter
                  purity={lead.batch.purity}
                  tone="dark"
                  className="mt-10"
                />
              </div>
            </Reveal>
          </div>

          {/* Aggregate + other batches */}
          <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            {/* One column on a phone. Two 40px figures side by side in a 358px
                column left each label wrapping to three lines and read as a
                table; full width they read as four statements, which is what
                the reference does with its own aggregate figures. */}
            <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {[
                {
                  value: `${labSummary.meanPurity}%`,
                  label: "Mean assayed purity",
                },
                { value: "100%", label: "Independently analysed" },
                {
                  value: String(labSummary.certificates),
                  label: "Certificates published",
                },
                { value: "0", label: "Batches re-graded" },
              ].map((stat, i) => (
                /* The reveal wrapper *is* the div this list is allowed to
                   wrap its terms in. Nesting a second one inside it put the
                   dt/dd two levels below the dl, which axe reads as terms
                   outside any list at all — nine serious findings from one
                   redundant element. */
                <Reveal key={stat.label} delay={i * 0.07}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="type-display-s block tabular-nums text-soft">
                      {stat.value}
                    </span>
                    <span className="type-label mt-3 block text-soft/60">
                      {stat.label}
                    </span>
                  </dd>
                </Reveal>
              ))}
            </dl>

            <p className="type-label mt-14 text-soft/60">Recent releases</p>
            <ul className="mt-6 border-t border-soft/15">
              {showcase.slice(1).map((entry, i) => (
                <Reveal key={entry.product.slug} delay={i * 0.08} as="li">
                  <Link
                    href={`/lab-results/${entry.product.slug}`}
                    className="group/lab flex items-baseline justify-between gap-6 border-b border-soft/12 py-5"
                  >
                    <span className="type-title-s text-soft">
                      <span className="relative inline">
                        {entry.product.name}
                        <span
                          aria-hidden
                          className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/lab:w-full motion-reduce:transition-none"
                        />
                      </span>
                    </span>
                    <span className="type-label shrink-0 tabular-nums text-soft/55">
                      {entry.batch.purity}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
