import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { categories } from "@/data/categories";
import { products, productsByCategory } from "@/data/products";
import { stacks } from "@/data/stacks";
import { strips } from "@/data/strips";
import { labSummary } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Research",
  description:
    "The EVOHN reference compound library spans eight research domains. Every compound is HPLC-verified and supplied for laboratory research use only.",
  alternates: { canonical: "/research" },
};

/** Format groupings shown alongside the eight compound domains. */
const FORMATS = [
  {
    name: "Research Stacks",
    href: "/stacks",
    count: stacks.length,
    unit: "protocols",
    body: "Curated multi-compound protocols combining mechanistically complementary compounds for targeted research applications.",
  },
  {
    name: "Pocket Strips",
    href: "/strips",
    count: strips.length,
    unit: "formats",
    body: "Pharmaceutical-grade oral dissolvable films — sublingual delivery without reconstitution or cold chain.",
  },
  {
    name: "Lab Results",
    href: "/lab-results",
    count: labSummary.certificates,
    unit: "certificates",
    body: "Published certificates of analysis for every released batch, current and superseded, with the trace behind each figure.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Research", href: "/research" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Research"
        title={"Research\ncategories"}
        body={`The EVOHN reference compound library spans ${categories.length} research domains. Every compound is verified by HPLC with identity confirmed by mass spectrometry, and supplied for laboratory research use only — not for human consumption.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Research", href: "/research" },
        ]}
        meta={[
          {
            label: "Domains",
            value: String(categories.length).padStart(2, "0"),
          },
          { label: "Compounds", value: String(products.length).padStart(2, "0") },
          { label: "Verification", value: "HPLC + MS" },
          { label: "Mean purity", value: `${labSummary.meanPurity}%` },
        ]}
      />

      {/* Read our research */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between">
          <p className="type-editorial max-w-[46ch] text-carbon/72">
            In-depth articles, compound guides and literature reviews from the
            research desk.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="type-label inline-flex min-h-12 items-center gap-3 bg-carbon px-8 py-4 text-soft"
            >
              Read our research
              <span aria-hidden>&#8594;</span>
            </Link>
            <Link
              href="/peptide-pedia"
              className="type-label inline-flex min-h-12 items-center gap-3 border border-carbon/25 px-8 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
            >
              Peptide Pedia
            </Link>
          </div>
        </div>
      </section>

      {/* Domain grid */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="sr-only">Research domains</h2>

          <ul className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, i) => {
              const count = productsByCategory(category.slug).length;
              return (
                <Reveal key={category.slug} delay={(i % 3) * 0.06} as="li">
                  <Link
                    href={`/catalogue?domain=${category.slug}`}
                    className="group/dom flex h-full flex-col border border-carbon/12 p-8 transition-colors duration-500 ease-brand hover:border-carbon/30"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="size-2.5 rounded-full ring-1 ring-carbon/15"
                        style={{ backgroundColor: category.token }}
                      />
                      <h3 className="type-title text-carbon">
                        <span className="relative inline">
                          {category.name}
                          <span
                            aria-hidden
                            className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/dom:w-full motion-reduce:transition-none"
                          />
                        </span>
                      </h3>
                    </div>

                    <p className="type-label mt-4 tabular-nums text-carbon/45">
                      {count} compound{count === 1 ? "" : "s"} ·{" "}
                      {category.tagline}
                    </p>

                    <p className="type-body-s mt-6 flex-1 text-carbon/68">
                      {category.description}
                    </p>

                    <span
                      aria-hidden
                      className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
                    >
                      View compounds
                      <span className="transition-transform duration-500 ease-brand group-hover/dom:translate-x-1 motion-reduce:transition-none">
                        &#8594;
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}

            {FORMATS.map((format, i) => (
              <Reveal key={format.href} delay={(i % 3) * 0.06} as="li">
                <Link
                  href={format.href}
                  className="group/fmt flex h-full flex-col border border-carbon/12 bg-mist/45 p-8 transition-colors duration-500 ease-brand hover:border-carbon/30"
                >
                  <h3 className="type-title text-carbon">
                    <span className="relative inline">
                      {format.name}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/fmt:w-full motion-reduce:transition-none"
                      />
                    </span>
                  </h3>
                  <p className="type-label mt-4 tabular-nums text-carbon/45">
                    {format.count} {format.unit}
                  </p>
                  <p className="type-body-s mt-6 flex-1 text-carbon/68">
                    {format.body}
                  </p>
                  <span
                    aria-hidden
                    className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
                  >
                    Open
                    <span className="transition-transform duration-500 ease-brand group-hover/fmt:translate-x-1 motion-reduce:transition-none">
                      &#8594;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Scoping a\nstudy?"}
        body="Describe the endpoint you are measuring and the desk will say which domain the literature would point you at — including when the answer is a single compound rather than a set."
        secondary={{ label: "Read the blog", href: "/blog" }}
      />
    </>
  );
}
