import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { Chromatogram } from "@/components/lab/Chromatogram";
import { PurityMeter } from "@/components/lab/PurityMeter";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { DataTable, SpecList } from "@/components/common/DataTable";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { products, productBySlug } from "@/data/products";
import { batchesForProduct } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate, formatDateShort } from "@/lib/format";
import { asset, hasAsset } from "@/lib/media";
import { site } from "@/data/site";

/** Only compounds with at least one released batch have a page. */
const documented = products.filter((p) => batchesForProduct(p.slug).length > 0);

export function generateStaticParams() {
  return documented.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/lab-results/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) return {};

  return {
    title: `${product.name} — Lab Results`,
    description: `Certificates of analysis for every released batch of ${product.name}: assayed purity, confirmed identity, content, water and residual solvents.`,
    alternates: { canonical: `/lab-results/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — Lab Results | ${site.name}`,
      description: `Published certificates of analysis for ${product.name}.`,
      url: `${site.url}/lab-results/${product.slug}`,
    },
  };
}

export default async function LabResultPage(
  props: PageProps<"/lab-results/[slug]">,
) {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const batches = batchesForProduct(product.slug);
  if (batches.length === 0) notFound();

  const [current, ...archive] = batches;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Lab Results", href: "/lab-results" },
            { name: product.name, href: `/lab-results/${product.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Certificate of analysis"
        title={product.name}
        body={`Every released batch of ${product.name}, with the analytical record that released it. Figures are the laboratory's measurements — where the label and the assay disagree, the assay is the number to calculate from.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Lab Results", href: "/lab-results" },
          { name: product.name, href: `/lab-results/${product.slug}` },
        ]}
        meta={[
          { label: "Batches published", value: String(batches.length).padStart(2, "0") },
          { label: "Current batch", value: current.batch },
          { label: "Assayed purity", value: current.purity },
          { label: "Released", value: formatDateShort(current.released) },
        ]}
      />

      {/* Current batch */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="type-label text-carbon/45">Current batch</p>
              <h2 className="type-display-s mt-5">{current.batch}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <VerifiedBadge verified={current.verified} />
              {current.certificateUrl && hasAsset(current.certificateUrl) ? (
                <a
                  href={asset(current.certificateUrl)}
                  download
                  className="type-label inline-flex items-center gap-3 border border-carbon/25 px-7 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
                >
                  Download certificate
                  <span aria-hidden>&#8595;</span>
                </a>
              ) : (
                <span className="type-label border border-carbon/12 px-7 py-4 text-carbon/45">
                  Signed PDF on request
                </span>
              )}
            </div>
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal duration={1}>
                <div className="border border-carbon/12 bg-mist/40 p-7 md:p-10">
                  <Chromatogram peaks={current.chromatogram} />
                </div>
              </Reveal>

              <Reveal delay={0.12} className="mt-12">
                <h3 className="type-label text-carbon/45">
                  Determinations
                </h3>
                <DataTable
                  className="mt-6"
                  head={["Determination", "Result", "Specification", "Method"]}
                  rows={current.assays.map((assay) => [
                    assay.label,
                    assay.result,
                    assay.specification,
                    assay.method,
                  ])}
                />
              </Reveal>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-32">
                <PurityMeter purity={current.purity} />

                <SpecList
                  className="mt-10"
                  items={[
                    { label: "Assayed content", value: current.content },
                    { label: "Laboratory", value: current.laboratory },
                    { label: "Accreditation", value: current.accreditation },
                    { label: "Accession", value: current.accession },
                    {
                      label: "Manufactured",
                      value: formatDate(current.manufactured),
                    },
                    { label: "Tested", value: formatDate(current.tested) },
                    { label: "Released", value: formatDate(current.released) },
                    { label: "Retest interval", value: current.retest },
                  ]}
                />

                <div className="mt-10 border border-carbon/12 bg-mist/45 p-7">
                  <p className="type-label text-carbon/45">
                    Storage conditions
                  </p>
                  <p className="type-body-s mt-4 text-carbon/68">
                    {current.storageConditions}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                  <Link
                    href={`/catalogue/${product.slug}`}
                    className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                  >
                    Compound entry
                  </Link>
                  <Link
                    href="/quality"
                    className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                  >
                    Method notes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-soft/55">Testing standards</h2>
              <p className="type-display-s mt-8 max-w-[14ch] text-soft">
                The references applied
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-soft/55">
                Compendial standards govern how each determination is made and
                what limit it is judged against. Naming them is what allows a
                result to be compared with one produced elsewhere.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-soft/15">
                {current.standards.map((standard, i) => (
                  <Reveal key={standard} delay={i * 0.06} as="li">
                    <div className="flex gap-8 border-b border-soft/12 py-6">
                      <span className="type-label shrink-0 tabular-nums text-soft/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="type-body-s text-soft/72">
                        {standard}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Archive */}
      {archive.length ? (
        <section className="section-y bg-mist/50 text-carbon">
          <div className="container-content">
            <h2 className="type-display-s max-w-[16ch]">Previous batches</h2>
            <p className="type-body mt-8 max-w-[54ch] text-carbon/62">
              Superseded batches remain published. A result produced months ago
              needs the certificate that released the material it used, not the
              one that happens to be current.
            </p>

            <div className="mt-14 flex flex-col gap-10">
              {archive.map((batch, i) => (
                <Reveal key={batch.batch} delay={i * 0.08}>
                  <article className="border border-carbon/12 bg-soft p-7 md:p-10">
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                      <div className="lg:col-span-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h3 className="type-title text-carbon">
                            {batch.batch}
                          </h3>
                          <VerifiedBadge verified={batch.verified} />
                        </div>
                        <PurityMeter
                          purity={batch.purity}
                          className="mt-8"
                        />
                        <SpecList
                          className="mt-8"
                          items={[
                            { label: "Content", value: batch.content },
                            { label: "Laboratory", value: batch.laboratory },
                            { label: "Accession", value: batch.accession },
                            {
                              label: "Released",
                              value: formatDate(batch.released),
                            },
                          ]}
                        />
                        {batch.certificateUrl &&
                        hasAsset(batch.certificateUrl) ? (
                          <a
                            href={asset(batch.certificateUrl)}
                            download
                            className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
                          >
                            Download certificate
                            <span aria-hidden>&#8595;</span>
                          </a>
                        ) : (
                          <p className="type-label mt-8 text-carbon/45">
                            Signed PDF on request
                          </p>
                        )}
                      </div>

                      <div className="lg:col-span-6 lg:col-start-7">
                        <div className="border border-carbon/10 bg-mist/40 p-6">
                          <Chromatogram peaks={batch.chromatogram} />
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CallToAction
        eyebrow="Documentation"
        title={"Confirm it at\nthe source."}
        body={`Ask the desk to arrange confirmation of any ${product.name} certificate directly with the issuing laboratory, or to retrieve an archived batch record.`}
        product={product.name}
        secondary={{ label: "All lab results", href: "/lab-results" }}
      />
    </>
  );
}
