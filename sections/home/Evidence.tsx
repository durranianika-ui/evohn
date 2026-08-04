import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PurityMeter } from "@/components/lab/PurityMeter";
import { Chromatogram } from "@/components/lab/Chromatogram";
import { labEntries, labSummary } from "@/data/lab-results";
import { formatDateShort } from "@/lib/format";

/**
 * Certificate preview.
 *
 * Three current batches, drawn straight from the records rather than chosen
 * for their numbers, with the trace, the assayed purity and the identifiers
 * needed to confirm the record with the issuing laboratory.
 *
 * Nothing here is composed for the home page. If a batch is superseded the
 * card changes; if a certificate is withdrawn the card disappears. That is
 * the point of putting real records on a marketing surface rather than an
 * illustration of one.
 */
export function Evidence() {
  const preview = labEntries.slice(0, 3);
  if (!preview.length) return null;

  return (
    <section className="section-y-home bg-soft text-carbon">
      <div className="container-home">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Evidence"
            title={"Every batch,\non the record."}
            body={`${labSummary.certificates} certificates across ${labSummary.compounds} compounds, issued by ${labSummary.laboratories} independent laboratories. Current and superseded records alike — a library that only holds the good results is not a library.`}
            className="lg:max-w-2xl"
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/lab-results" tone="light" variant="outline">
              Open the COA library
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {preview.map((entry, i) => (
            <Reveal key={entry.batch.batch} delay={i * 0.07} as="li">
              <Link
                href={`/lab-results/${entry.product.slug}`}
                className="group/coa flex h-full flex-col border border-carbon/12 transition-colors duration-500 ease-brand hover:border-carbon/30"
              >
                <div className="border-b border-carbon/10 bg-mist/40 px-6 pt-6 pb-3">
                  <Chromatogram peaks={entry.batch.chromatogram} axis={false} />
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
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

                  <PurityMeter purity={entry.batch.purity} className="mt-7" />

                  <dl className="type-body-s mt-7 flex-1 space-y-3 border-t border-carbon/10 pt-5">
                    <div className="flex justify-between gap-4">
                      <dt className="type-label text-carbon/60">Tested</dt>
                      <dd className="tabular-nums text-carbon/68">
                        {formatDateShort(entry.batch.tested)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="type-label text-carbon/60">Laboratory</dt>
                      <dd className="text-right text-carbon/68">
                        {entry.batch.laboratory}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
