import Link from "next/link";
import { Chromatogram } from "./Chromatogram";
import { PurityMeter } from "./PurityMeter";
import { VerifiedBadge } from "./VerifiedBadge";
import type { LabEntry } from "@/data/lab-results";
import { formatDateShort } from "@/lib/format";
import { hasAsset } from "@/lib/media";
import { asset } from "@/lib/media";

/**
 * Certificate summary card for the library index.
 *
 * Shows the current batch: its trace, its assayed purity against the
 * specification, and the identifiers needed to confirm the record with the
 * issuing laboratory. The PDF link appears only once the signed document has
 * been placed in `public/coa/` — an absent file degrades to a request route
 * rather than a broken download.
 */
export function CoaCard({ entry }: { entry: LabEntry }) {
  const { product, batch, batchCount } = entry;
  const pdfReady = Boolean(batch.certificateUrl && hasAsset(batch.certificateUrl));

  return (
    <article className="group/coa flex h-full flex-col border border-carbon/12 bg-soft transition-colors duration-500 ease-brand hover:border-carbon/25">
      <div className="border-b border-carbon/10 bg-mist/40 px-7 pt-7 pb-4">
        <Chromatogram peaks={batch.chromatogram} axis={false} />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="type-title text-carbon">
              <Link href={`/lab-results/${product.slug}`}>
                <span className="relative inline">
                  {product.name}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/coa:w-full motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </h3>
            <p className="type-label mt-3 text-carbon/62">
              {product.dosage} · Batch {batch.batch}
            </p>
          </div>
          <VerifiedBadge verified={batch.verified} />
        </div>

        <PurityMeter purity={batch.purity} className="mt-8" />

        <dl className="type-body-s mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-carbon/10 pt-6">
          <div>
            <dt className="type-label text-carbon/45">Content</dt>
            <dd className="mt-1.5 tabular-nums text-carbon/72">
              {batch.content}
            </dd>
          </div>
          <div>
            <dt className="type-label text-carbon/45">Manufactured</dt>
            <dd className="mt-1.5 text-carbon/72">
              {formatDateShort(batch.manufactured)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="type-label text-carbon/45">Laboratory</dt>
            <dd className="mt-1.5 text-carbon/72">
              {batch.laboratory} · {batch.accession}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-carbon/10 pt-6">
          {pdfReady ? (
            <a
              href={asset(batch.certificateUrl!)}
              download
              className="type-label inline-flex items-center gap-2.5 text-carbon"
            >
              Download COA
              <span aria-hidden>&#8595;</span>
            </a>
          ) : (
            <span className="type-label text-carbon/45">
              PDF on request
            </span>
          )}

          <Link
            href={`/lab-results/${product.slug}`}
            className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
          >
            {batchCount > 1
              ? `All ${batchCount} batches`
              : "Full certificate"}
          </Link>

          <Link
            href={`/catalogue/${product.slug}`}
            className="type-label ml-auto text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
          >
            Compound
          </Link>
        </div>
      </div>
    </article>
  );
}
