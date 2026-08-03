import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductCard } from "@/components/product/ProductCard";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { StickyEnquiryBar } from "@/components/common/StickyEnquiryBar";
import { SpecList } from "@/components/common/DataTable";
import { Chromatogram } from "@/components/lab/Chromatogram";
import { PurityMeter } from "@/components/lab/PurityMeter";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { getCategory } from "@/data/categories";
import {
  products,
  productBySlug,
  relatedProducts,
  compatibleProducts,
} from "@/data/products";
import { stacksContaining } from "@/data/stacks";
import { currentBatch, batchesForProduct } from "@/data/lab-results";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { formatDateShort } from "@/lib/format";
import { disclaimer, site } from "@/data/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/catalogue/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/catalogue/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${site.name}`,
      description: product.summary,
      url: `${site.url}/catalogue/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${site.name}`,
      description: product.summary,
    },
  };
}

export default async function ProductPage(
  props: PageProps<"/catalogue/[slug]">,
) {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = relatedProducts(product);
  const compatible = compatibleProducts(product);
  const inStacks = stacksContaining(product.slug);
  const batch = currentBatch(product.slug);
  const batchCount = batchesForProduct(product.slug).length;

  const frames = product.gallery.map((_, i) => (
    <ProductMedia
      key={i}
      product={product}
      frame={i}
      priority={i === 0}
      sizes="(min-width: 1024px) 45vw, 100vw"
      className="h-full w-full"
    />
  ));

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Catalogue", href: "/catalogue" },
            { name: product.name, href: `/catalogue/${product.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={product.subtitle}
        title={product.name}
        body={product.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Catalogue", href: "/catalogue" },
          { name: product.name, href: `/catalogue/${product.slug}` },
        ]}
        meta={[
          { label: "Research domain", value: category.name },
          { label: "Presentation", value: product.dosage },
          {
            label: "Assayed purity",
            value: batch ? batch.purity : product.specs.purity,
          },
          { label: "Evidence base", value: product.evidence },
        ]}
      />

      {/* Gallery + quick facts */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal duration={1}>
                <ProductGallery frames={frames} productName={product.name} />
              </Reveal>

              {product.alsoKnownAs.length ? (
                <Reveal delay={0.1} className="mt-8">
                  <p className="type-body-s text-carbon/55">
                    <span className="type-label text-carbon/45">
                      Also designated
                    </span>
                    <span className="mt-2 block">
                      {product.alsoKnownAs.join(" · ")}
                    </span>
                  </p>
                </Reveal>
              ) : null}
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              {/* Sticky within the scroll of the gallery column. */}
              <div className="lg:sticky lg:top-32">
                <Reveal distance={12}>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="size-2.5 rounded-full ring-1 ring-carbon/15"
                        style={{ backgroundColor: category.token }}
                      />
                      <Link
                        href={`/catalogue?domain=${category.slug}`}
                        className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                      >
                        {category.name}
                      </Link>
                    </span>
                    {batch ? (
                      <VerifiedBadge verified={batch.verified} />
                    ) : null}
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="type-display-s mt-8">Quick facts</h2>
                </Reveal>

                <Reveal delay={0.14} className="mt-8">
                  <SpecList
                    items={[
                      {
                        label: "Purity specification",
                        value: product.specs.purity,
                      },
                      { label: "Physical form", value: product.specs.form },
                      { label: "Presentation", value: product.dosage },
                      { label: "Evidence base", value: product.evidence },
                      {
                        label: "Intended use",
                        value: "Laboratory research only",
                      },
                    ]}
                  />
                </Reveal>

                {batch ? (
                  <Reveal delay={0.2} className="mt-10">
                    <div className="border border-carbon/12 bg-mist/45 p-7">
                      <p className="type-label text-carbon/45">
                        Current batch · {batch.batch}
                      </p>
                      <PurityMeter purity={batch.purity} className="mt-6" />
                      <p className="type-body-s mt-6 text-carbon/62">
                        {batch.laboratory}, {formatDateShort(batch.tested)}.
                        Assayed content {batch.content}.
                      </p>
                      <Link
                        href={`/lab-results/${product.slug}`}
                        className="type-label mt-6 inline-flex items-center gap-3 text-carbon"
                      >
                        View certificate
                        <span aria-hidden>&#8594;</span>
                      </Link>
                    </div>
                  </Reveal>
                ) : null}

                <Reveal delay={0.26} className="mt-10 flex flex-wrap gap-4">
                  <WhatsAppCTA product={product.name} tone="light" />
                  <WhatsAppCTA
                    product={product.name}
                    intent="information"
                    variant="outline"
                    tone="light"
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research overview */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">Research overview</h2>
              <p className="type-display-s mt-8 max-w-[14ch]">
                How it is characterised
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <p className="type-body max-w-prose text-carbon/72">
                  {product.description}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-12">
                <h3 className="type-label text-carbon/45">Mechanism</h3>
                <p className="type-body mt-5 max-w-prose text-carbon/72">
                  {product.mechanism}
                </p>
              </Reveal>

              <Reveal delay={0.16} className="mt-12">
                <h3 className="type-label text-carbon/45">Applications</h3>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {product.applications.map((item) => (
                    <li
                      key={item}
                      className="type-label border border-carbon/18 px-4 py-2.5 text-carbon/62"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Research focus */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="type-label text-soft/55">Research focus</h2>
              <p className="type-display-s mt-8 text-soft">
                Areas of published investigation
              </p>
              <p className="type-body-s mt-8 max-w-[44ch] text-soft/55">
                The following describe where this compound has been examined in
                the scientific literature. They are not claims of effect, and
                nothing here should be read as a therapeutic indication.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Stagger>
                <ul className="border-t border-soft/12">
                  {product.researchFocus.map((item, i) => (
                    <StaggerItem key={item} distance={16}>
                      <li className="flex gap-8 border-b border-soft/12 py-6">
                        <span className="type-label shrink-0 tabular-nums text-soft/55">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="type-title-s text-soft/85">{item}</span>
                      </li>
                    </StaggerItem>
                  ))}
                </ul>
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* Research compatibility */}
      {compatible.length ? (
        <section className="section-y bg-soft text-carbon">
          <div className="container-content">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h2 className="type-label text-carbon/45">
                  Research compatibility
                </h2>
                <p className="type-display-s mt-8 max-w-[14ch]">
                  Frequently co-studied
                </p>
                <p className="type-body-s mt-8 max-w-[40ch] text-carbon/62">
                  Compounds that appear alongside {product.name} in the
                  published record, and the reason the literature examines them
                  together.
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <ul className="border-t border-carbon/12">
                  {compatible.map((entry, i) => (
                    <Reveal key={entry.product.slug} delay={i * 0.06} as="li">
                      <Link
                        href={`/catalogue/${entry.product.slug}`}
                        className="group/compat flex flex-col gap-3 border-b border-carbon/12 py-7 sm:flex-row sm:items-baseline sm:gap-10"
                      >
                        <span className="type-title-s w-full max-w-[16ch] shrink-0 text-carbon">
                          <span className="relative inline">
                            {entry.product.name}
                            <span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/compat:w-full motion-reduce:transition-none"
                            />
                          </span>
                        </span>
                        <span className="type-body-s text-carbon/62">
                          {entry.note}
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>

                {inStacks.length ? (
                  <Reveal delay={0.2} className="mt-12">
                    <h3 className="type-label text-carbon/45">
                      Included in research stacks
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-3">
                      {inStacks.map((stack) => (
                        <li key={stack.slug}>
                          <Link
                            href={`/stacks/${stack.slug}`}
                            className="type-label inline-flex border border-carbon/18 px-4 py-2.5 text-carbon/62 transition-colors duration-400 ease-brand hover:border-carbon/45 hover:text-carbon"
                          >
                            {stack.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Molecular and pharmacokinetic data */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">
                Molecular &amp; pharmacokinetic data
              </h2>
              <p className="type-display-s mt-8 max-w-[14ch]">
                The physical record
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-carbon/62">
                Verify every figure against the certificate of analysis for the
                batch you hold. Where the label and the assay disagree, the
                assay is the number to calculate from.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <SpecList
                  items={[
                    { label: "CAS number", value: product.specs.cas },
                    { label: "Molecular formula", value: product.specs.formula },
                    { label: "Molar mass", value: product.specs.molarMass },
                    ...(product.specs.sequence
                      ? [{ label: "Sequence", value: product.specs.sequence }]
                      : []),
                    ...(product.specs.halfLife
                      ? [
                          {
                            label: "Reported half-life",
                            value: product.specs.halfLife,
                          },
                        ]
                      : []),
                    ...(product.specs.solubility
                      ? [
                          {
                            label: "Solubility",
                            value: product.specs.solubility,
                          },
                        ]
                      : []),
                  ]}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Batch analysis */}
      {batch ? (
        <section className="section-y bg-carbon text-soft">
          <div className="container-content">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h2 className="type-label text-soft/55">Analytical record</h2>
                <p className="type-display-s mt-8 max-w-[14ch] text-soft">
                  Batch {batch.batch}
                </p>
                <p className="type-body-s mt-8 max-w-[40ch] text-soft/55">
                  Analysed by {batch.laboratory}, {batch.accreditation}, under
                  accession {batch.accession}. The certificate is retrievable
                  from the issuing laboratory independently of us.
                </p>
                <Link
                  href={`/lab-results/${product.slug}`}
                  className="type-label mt-10 inline-flex items-center gap-3 text-soft"
                >
                  {batchCount > 1
                    ? `All ${batchCount} batches`
                    : "Full certificate"}
                  <span aria-hidden>&#8594;</span>
                </Link>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <Reveal>
                  <Chromatogram peaks={batch.chromatogram} tone="dark" />
                </Reveal>
                <Reveal delay={0.1} className="mt-12">
                  <SpecList
                    tone="dark"
                    items={batch.assays.map((assay) => ({
                      label: assay.label,
                      value: assay.result,
                      note: `${assay.method} · spec ${assay.specification}`,
                    }))}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Handling */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
            <Reveal>
              <h2 className="type-label text-carbon/45">Storage</h2>
              <p className="type-body-s mt-7 text-carbon/68">
                {product.storage}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="type-label text-carbon/45">Handling</h2>
              <p className="type-body-s mt-7 text-carbon/68">
                {product.handling}
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <h2 className="type-label text-carbon/45">Packaging</h2>
              <p className="type-body-s mt-7 text-carbon/68">
                {product.packaging}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-14">
            <Link
              href="/reconstitution"
              className="type-label inline-flex items-center gap-3 border border-carbon/20 px-7 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
            >
              Reconstitution guide
              <span aria-hidden>&#8594;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Selected references */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">Selected references</h2>
              <p className="type-display-s mt-8 max-w-[14ch]">
                The published record
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-carbon/62">
                A starting point rather than a survey. Entries are listed for
                orientation and do not constitute endorsement of any
                interpretation drawn from them.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ol className="border-t border-carbon/12">
                {product.references.map((ref, i) => (
                  <Reveal key={ref.title} delay={i * 0.06} as="li">
                    <div className="flex gap-8 border-b border-carbon/12 py-6">
                      <span className="type-label shrink-0 tabular-nums text-carbon/45">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="type-title-s block text-carbon">
                          {ref.title}
                        </span>
                        <span className="type-body-s mt-1.5 block text-carbon/55">
                          {ref.source}, {ref.year}
                        </span>
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <Reveal delay={0.2} className="mt-10">
                <p className="type-body-s text-carbon/55">
                  {disclaimer.short}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length ? (
        <section className="section-y bg-soft text-carbon">
          <div className="container-content">
            <h2 className="type-label text-carbon/45">
              You may also be studying
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.08}>
                  <ProductCard
                    product={item}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CallToAction
        eyebrow="Enquiries"
        title={"Request the\nbatch documentation."}
        body={`Ask a specialist about ${product.name} — its current batch, analytical documentation, and what can be supplied to your territory.`}
        product={product.name}
        secondary={{ label: "Full catalogue", href: "/catalogue" }}
      />

      {/* Persistent action, clear of the footer's own CTA on small screens. */}
      <StickyEnquiryBar product={product.name} />
    </>
  );
}
