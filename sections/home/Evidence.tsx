import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Eyebrow } from "@/components/common/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { PurityMeter } from "@/components/lab/PurityMeter";
import { labEntries, labSummary } from "@/data/lab-results";
import { formatDateShort } from "@/lib/format";

/**
 * Certificate preview.
 *
 * Three current batches, drawn straight from the records rather than chosen
 * for their numbers, with the assayed purity and the identifiers needed to
 * confirm the record with the issuing laboratory.
 *
 * Nothing here is composed for the home page. If a batch is superseded the
 * row changes; if a certificate is withdrawn the row disappears. That is the
 * point of putting real records on a marketing surface rather than an
 * illustration of one.
 *
 * Composition follows the reference, which resolves this block as a narrow
 * heading column beside a wider content column — 442px of content at desktop
 * and 1050px at 390, against the 1197/1861 a full-width heading over three
 * tall cards was costing. The trace that used to head each card is not lost:
 * the Verification block directly above shows an actual chromatogram at full
 * width, so repeating a thumbnail of one here was duplication paid for in
 * half a viewport.
 */
export function Evidence() {
  const preview = labEntries.slice(0, 3);
  if (!preview.length) return null;

  return (
    <section className="section-y-home bg-soft text-carbon">
      <div className="container-home">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Heading column */}
          <div className="flex flex-col lg:col-span-4">
            <Reveal distance={12}>
              <Eyebrow className="mb-6">Evidence</Eyebrow>
            </Reveal>

            <SplitText
              as="h2"
              text={"Every batch,\non the record."}
              className="type-display-s max-w-[18ch]"
            />

            <Reveal delay={0.12} className="mt-6 max-w-[46ch]">
              <p className="type-body-s text-carbon/62">
                {labSummary.certificates} certificates across{" "}
                {labSummary.compounds} compounds, issued by{" "}
                {labSummary.laboratories} independent laboratories. Current and
                superseded records alike — a library that only holds the good
                results is not a library.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-8">
              <ButtonLink href="/lab-results" tone="light" variant="outline">
                Open the COA library
              </ButtonLink>
            </Reveal>
          </div>

          {/* Records */}
          <ul className="lg:col-span-7 lg:col-start-6">
            {preview.map((entry, i) => (
              <Reveal key={entry.batch.batch} delay={i * 0.07} as="li">
                <Link
                  href={`/lab-results/${entry.product.slug}`}
                  className="group/coa flex flex-col gap-5 border-t border-carbon/12 py-7 transition-colors duration-500 ease-brand last:border-b hover:border-carbon/30 sm:flex-row sm:items-center sm:gap-10"
                >
                  <div className="min-w-0 sm:w-[42%]">
                    <h3 className="type-title text-carbon">
                      <span className="relative inline">
                        {entry.product.name}
                        <span
                          aria-hidden
                          className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/coa:w-full motion-reduce:transition-none"
                        />
                      </span>
                    </h3>
                    <p className="type-label mt-3 text-carbon/50">
                      Batch {entry.batch.batch}
                    </p>
                    <p className="type-body-s mt-2 text-carbon/62">
                      {entry.batch.laboratory} ·{" "}
                      {formatDateShort(entry.batch.tested)}
                    </p>
                  </div>

                  <PurityMeter purity={entry.batch.purity} className="sm:flex-1" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
