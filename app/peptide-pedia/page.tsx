import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { categories } from "@/data/categories";
import { products, productsByCategory, productsAlphabetical } from "@/data/products";
import { currentBatch } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Peptide Pedia",
  description:
    "The EVOHN reference library — compound profiles, mechanisms and research summaries across every domain in the catalogue. For laboratory research use only.",
  alternates: { canonical: "/peptide-pedia" },
};

export default function PeptidePediaPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Peptide Pedia", href: "/peptide-pedia" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Peptide Pedia"
        title={"The reference\nlibrary"}
        body="Compound profiles, mechanisms and research summaries across every domain in the catalogue. Written to be looked something up in rather than browsed — each entry states what the published literature establishes, and stops there."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Peptide Pedia", href: "/peptide-pedia" },
        ]}
        meta={[
          { label: "Entries", value: String(products.length).padStart(2, "0") },
          {
            label: "Domains",
            value: String(categories.length).padStart(2, "0"),
          },
          { label: "Includes", value: "CAS · formula · mass" },
          { label: "Framing", value: "Research only" },
        ]}
      />

      {/* Domain rail */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content py-10">
          <h2 className="type-label text-carbon/45">Jump to a domain</h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <a
                  href={`#${category.slug}`}
                  className="type-label inline-flex min-h-11 items-center gap-2.5 border border-carbon/15 px-5 py-3 text-carbon/62 transition-colors duration-400 ease-brand hover:border-carbon/45 hover:text-carbon"
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full ring-1 ring-carbon/15"
                    style={{ backgroundColor: category.token }}
                  />
                  {category.name}
                  <span className="tabular-nums text-carbon/35">
                    {productsByCategory(category.slug).length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Entries grouped by domain */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          {categories.map((category) => {
            const entries = productsByCategory(category.slug);
            if (entries.length === 0) return null;

            return (
              <div key={category.slug} className="mt-24 first:mt-0">
                <div
                  id={category.slug}
                  className="scroll-mt-28 border-b border-carbon/20 pb-7"
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full ring-1 ring-carbon/15"
                      style={{ backgroundColor: category.token }}
                    />
                    <h2 className="type-display-s">{category.name}</h2>
                  </div>
                  <p className="type-body mt-6 max-w-[62ch] text-carbon/62">
                    {category.description}
                  </p>
                </div>

                <ul>
                  {entries.map((product, i) => {
                    const batch = currentBatch(product.slug);
                    return (
                      <Reveal key={product.slug} delay={i * 0.05} as="li">
                        <Link
                          href={`/catalogue/${product.slug}`}
                          className="group/e grid gap-5 border-b border-carbon/12 py-9 lg:grid-cols-12 lg:gap-8"
                        >
                          <div className="lg:col-span-4">
                            <h3 className="type-title text-carbon">
                              <span className="relative inline">
                                {product.name}
                                <span
                                  aria-hidden
                                  className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/e:w-full motion-reduce:transition-none"
                                />
                              </span>
                            </h3>
                            <p className="type-body-s mt-3 text-carbon/55">
                              {product.alsoKnownAs.join(" · ")}
                            </p>
                            <p className="type-label mt-4 text-carbon/45">
                              {product.evidence}
                            </p>
                          </div>

                          <div className="lg:col-span-5">
                            <p className="type-body-s text-carbon/72">
                              {product.mechanism}
                            </p>
                          </div>

                          <dl className="type-body-s lg:col-span-2">
                            {[
                              ["CAS", product.specs.cas],
                              ["Mass", product.specs.molarMass],
                              ["Presentation", product.dosage],
                            ].map(([k, v]) => (
                              <div
                                key={k}
                                className="flex justify-between gap-4 py-0.5"
                              >
                                <dt className="type-label text-carbon/45">
                                  {k}
                                </dt>
                                <dd className="tabular-nums text-carbon/72">
                                  {v}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          <div className="lg:col-span-1 lg:text-right">
                            {batch ? (
                              <>
                                <span className="type-title-s block tabular-nums text-carbon">
                                  {batch.purity}
                                </span>
                                <VerifiedBadge
                                  verified={batch.verified}
                                  label="COA"
                                  className="mt-3"
                                />
                              </>
                            ) : (
                              <span className="type-label text-carbon/35">
                                No batch
                              </span>
                            )}
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* A–Z index */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <h2 className="type-display-s max-w-[16ch]">Alphabetical index</h2>
          <p className="type-body mt-8 max-w-[54ch] text-carbon/62">
            The same entries, ordered by name rather than by domain, for when
            you already know what you are looking for.
          </p>

          <ul className="mt-14 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {productsAlphabetical.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="group/a flex items-baseline justify-between gap-4 border-b border-carbon/12 py-3.5"
                >
                  <span className="type-title-s text-carbon">
                    <span className="relative inline">
                      {product.name}
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/a:w-full motion-reduce:transition-none"
                      />
                    </span>
                  </span>
                  <span className="type-label shrink-0 text-carbon/40">
                    {product.dosage}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Looking for something\nnot listed?"}
        body="The library reflects what is currently held to the EVOHN specification. If a compound is absent, the desk can say whether it can be sourced to the same standard."
        secondary={{ label: "Full catalogue", href: "/catalogue" }}
      />
    </>
  );
}
