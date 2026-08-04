import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { JsonLd } from "@/components/common/JsonLd";
import { categories } from "@/data/categories";
import { products, productsAlphabetical } from "@/data/products";
import { PediaBrowser } from "@/components/science/PediaBrowser";
import { currentBatch } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Peptide Pedia",
  description:
    "The EVOHN reference library — compound profiles, mechanisms and research summaries across every domain in the catalogue. For laboratory research use only.",
  alternates: { canonical: "/peptide-pedia" },
};

export default function PeptidePediaPage() {
  // Rows are rendered here rather than inside the browser: the batch lookup
  // reads server-only data, and passing the finished node keeps the client
  // component to filtering and nothing else.
  const entries = products.map((product, i) => {
    const batch = currentBatch(product.slug);
    const category = categories.find((c) => c.slug === product.category);

    return {
      slug: product.slug,
      name: product.name,
      category: product.category,
      evidence: product.evidence,
      order: i,
      search: [
        product.name,
        product.subtitle,
        product.summary,
        product.mechanism,
        product.specs.cas,
        category?.name ?? "",
        product.evidence,
        ...product.alsoKnownAs,
      ]
        .join(" ")
        .toLowerCase(),
      row: (
        <Link
          href={`/products/${product.slug}`}
          className="group/e grid gap-5 border-b border-carbon/12 py-9 lg:grid-cols-12 lg:gap-8"
        >
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              {category ? (
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-dot ring-1 ring-carbon/15"
                  style={{ backgroundColor: category.token }}
                />
              ) : null}
              <h3 className="type-title text-carbon">
                <span className="relative inline">
                  {product.name}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/e:w-full motion-reduce:transition-none"
                  />
                </span>
              </h3>
            </div>
            <p className="type-body-s mt-3 text-carbon/55">
              {product.alsoKnownAs.join(" · ")}
            </p>
            <p className="type-label mt-4 text-carbon/45">
              {category?.name} · {product.evidence}
            </p>
          </div>

          <div className="lg:col-span-5">
            <p className="type-body-s text-carbon/72">{product.mechanism}</p>
          </div>

          <dl className="type-body-s lg:col-span-2">
            {[
              ["CAS", product.specs.cas],
              ["Mass", product.specs.molarMass],
              ["Presentation", product.dosage],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-0.5">
                <dt className="type-label text-carbon/45">{k}</dt>
                <dd className="tabular-nums text-carbon/72">{v}</dd>
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
              <span className="type-label text-carbon/35">No batch</span>
            )}
          </div>
        </Link>
      ),
    };
  });

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

      {/* The library proper. A reference is looked something up in, so it
          takes the same search, domain filter and sort as the catalogue —
          over the same pure rules in lib/catalogue.ts. */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="sr-only">Compound entries</h2>
          <PediaBrowser entries={entries} categories={categories} />
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
                  href={`/products/${product.slug}`}
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
