import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { productsAlphabetical } from "@/data/products";
import { getCategory } from "@/data/categories";
import { currentBatch } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Compound Index",
  description:
    "The complete EVOHN catalogue as a reference library — every compound alphabetically, with designation, research domain, molecular data and current analytical record.",
  alternates: { canonical: "/science/compound-index" },
};

export default function CompoundIndexPage() {
  // Group alphabetically so the index reads as a reference library rather
  // than an undifferentiated list.
  const groups = productsAlphabetical.reduce<
    Map<string, typeof productsAlphabetical>
  >((map, product) => {
    const letter = product.name.charAt(0).toUpperCase();
    const bucket = map.get(letter) ?? [];
    bucket.push(product);
    map.set(letter, bucket);
    return map;
  }, new Map());

  const letters = Array.from(groups.keys());

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Science", href: "/science" },
            { name: "Compound Index", href: "/science/compound-index" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Reference"
        title={"Compound\nindex"}
        body="The catalogue as a reference library: every compound alphabetically, with its designations, molecular data and the batch currently in supply. Built for looking something up rather than for browsing."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
          { name: "Compound Index", href: "/science/compound-index" },
        ]}
        meta={[
          {
            label: "Entries",
            value: String(productsAlphabetical.length).padStart(2, "0"),
          },
          { label: "Ordered", value: "Alphabetically" },
          { label: "Includes", value: "CAS · formula · mass" },
          { label: "Batch state", value: "Current" },
        ]}
      />

      {/* Jump rail */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content py-8">
          <nav aria-label="Jump to letter">
            <ul className="flex flex-wrap gap-2">
              {letters.map((letter) => (
                <li key={letter}>
                  <a
                    href={`#letter-${letter}`}
                    className="type-label inline-flex size-11 items-center justify-center border border-carbon/15 text-carbon/62 transition-colors duration-400 ease-brand hover:border-carbon/45 hover:text-carbon"
                  >
                    {letter}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          {letters.map((letter) => (
            <div key={letter} className="mt-20 first:mt-0">
              <h2
                id={`letter-${letter}`}
                className="type-display-s scroll-mt-32 border-b border-carbon/20 pb-6"
              >
                {letter}
              </h2>

              <ul>
                {(groups.get(letter) ?? []).map((product, i) => {
                  const category = getCategory(product.category);
                  const batch = currentBatch(product.slug);
                  return (
                    <Reveal key={product.slug} delay={i * 0.05} as="li">
                      <Link
                        href={`/catalogue/${product.slug}`}
                        className="group/idx grid gap-5 border-b border-carbon/12 py-8 lg:grid-cols-12 lg:gap-8"
                      >
                        <div className="lg:col-span-4">
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden
                              className="size-2 shrink-0 rounded-full ring-1 ring-carbon/15"
                              style={{ backgroundColor: category.token }}
                            />
                            <h3 className="type-title text-carbon">
                              <span className="relative inline">
                                {product.name}
                                <span
                                  aria-hidden
                                  className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/idx:w-full motion-reduce:transition-none"
                                />
                              </span>
                            </h3>
                          </div>
                          <p className="type-body-s mt-3 text-carbon/55">
                            {product.alsoKnownAs.join(" · ")}
                          </p>
                        </div>

                        <div className="lg:col-span-4">
                          <p className="type-body-s text-carbon/72">
                            {product.summary}
                          </p>
                          <p className="type-label mt-3 text-carbon/45">
                            {category.name} · {product.evidence}
                          </p>
                        </div>

                        <dl className="type-body-s lg:col-span-3">
                          <div className="flex justify-between gap-4">
                            <dt className="type-label text-carbon/45">CAS</dt>
                            <dd className="tabular-nums text-carbon/72">
                              {product.specs.cas}
                            </dd>
                          </div>
                          <div className="mt-2 flex justify-between gap-4">
                            <dt className="type-label text-carbon/45">Mass</dt>
                            <dd className="tabular-nums text-carbon/72">
                              {product.specs.molarMass}
                            </dd>
                          </div>
                          <div className="mt-2 flex justify-between gap-4">
                            <dt className="type-label text-carbon/45">
                              Presentation
                            </dt>
                            <dd className="tabular-nums text-carbon/72">
                              {product.dosage}
                            </dd>
                          </div>
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
          ))}
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Looking for something\nnot listed?"}
        body="The index reflects what is currently held to the EVOHN specification. If a compound is absent, the desk can say whether it can be sourced to the same standard."
        secondary={{ label: "Full catalogue", href: "/catalogue" }}
      />
    </>
  );
}
