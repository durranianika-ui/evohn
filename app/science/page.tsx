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
import { sciencePillars } from "@/data/science";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Science",
  description:
    "How EVOHN establishes what a compound is: the specification, the instruments, the independent verification, and the four research tools built on top of them.",
  alternates: { canonical: "/science" },
};

/**
 * The four destinations the Science menu points at.
 *
 * Declared here rather than read from `nav`, because the menu's one-line
 * descriptions are written for a 400px panel and this page has room for a
 * paragraph. The addresses are asserted equal in the navigation test suite.
 */
const RESEARCH_TOOLS = [
  {
    name: "Calculator",
    href: "/calculator",
    body: "Reconstitution, mixing and blend arithmetic with the working shown at every step. Runs entirely in your browser; the figures you type are never transmitted.",
  },
  {
    name: "Peptide Pedia",
    href: "/peptide-pedia",
    body: "The reference library. Every compound in the catalogue, searchable by name or alternative designation, with the research areas and the evidence level stated rather than implied.",
  },
  {
    name: "Reconstitution Guide",
    href: "/reconstitution-guide",
    body: "Bringing lyophilised material into solution without degrading it: diluent choice, technique, the mistakes that cost potency, and why each one matters chemically.",
  },
  {
    name: "Storage & Handling Guide",
    href: "/storage-handling",
    body: "Temperature, light, freeze-thaw cycling and solution intervals — with the degradation chemistry behind each rule rather than a list of instructions to take on trust.",
  },
] as const;

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

export default function SciencePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Science", href: "/science" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Science"
        title={"The\nstandard"}
        body={`Four positions govern every batch EVOHN releases, and four tools are built on top of them. Beneath both sits the reference library itself — ${products.length} compounds across ${categories.length} research domains, verified by HPLC with identity confirmed by mass spectrometry, and supplied for laboratory research only.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
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

      {/* The four positions. Dark, so the hub reads as an argument before it
          becomes a directory. */}
      <section className="section-y bg-ink text-soft">
        <div className="container-content">
          <Reveal>
            <h2 className="type-label text-soft/45">What we hold to</h2>
          </Reveal>

          <ol className="mt-16 border-t border-soft/12">
            {sciencePillars.map((pillar, i) => (
              <Reveal key={pillar.index} delay={i * 0.05} as="li">
                <div className="grid gap-6 border-b border-soft/12 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                  <span className="type-label tabular-nums text-soft/35 md:col-span-1">
                    {pillar.index}
                  </span>

                  <h3 className="type-title max-w-[22ch] text-soft md:col-span-5">
                    {pillar.title}
                  </h3>

                  <div className="md:col-span-6">
                    <p className="type-body max-w-[62ch] text-soft/58">
                      {pillar.body}
                    </p>
                    <Link
                      href={pillar.href}
                      className="type-label group/pil mt-7 inline-flex min-h-11 items-center gap-3 text-soft/75 transition-colors duration-400 ease-brand hover:text-soft"
                    >
                      {pillar.linkLabel}
                      <span
                        aria-hidden
                        className="transition-transform duration-500 ease-brand group-hover/pil:translate-x-1.5 motion-reduce:transition-none"
                      >
                        &#8594;
                      </span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* The four tools — the destinations the Science menu points at. */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <Reveal>
            <h2 className="type-display-s max-w-[16ch] text-carbon">
              Research tools
            </h2>
            <p className="type-body mt-8 max-w-[56ch] text-carbon/58">
              Four instruments built on the positions above. They convert,
              reference and describe. None of them recommends a quantity, a
              schedule or a compound — those belong to a study design, not to a
              website.
            </p>
          </Reveal>

          <ul className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2">
            {RESEARCH_TOOLS.map((tool, i) => (
              <Reveal key={tool.href} delay={(i % 2) * 0.06} as="li">
                <Link
                  href={tool.href}
                  className="group/tool flex h-full flex-col border border-carbon/12 p-8 transition-colors duration-500 ease-brand hover:border-carbon/30 md:p-10"
                >
                  <span
                    aria-hidden
                    className="type-label tabular-nums text-carbon/30"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="type-title mt-6 text-carbon">
                    <span className="relative inline">
                      {tool.name}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/tool:w-full motion-reduce:transition-none"
                      />
                    </span>
                  </h3>

                  <p className="type-body-s mt-6 flex-1 text-carbon/68">
                    {tool.body}
                  </p>

                  <span
                    aria-hidden
                    className="type-label mt-9 inline-flex items-center gap-3 text-carbon"
                  >
                    Open
                    <span className="transition-transform duration-500 ease-brand group-hover/tool:translate-x-1 motion-reduce:transition-none">
                      &#8594;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
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
        secondary={{ label: "Read the journal", href: "/journal" }}
      />
    </>
  );
}
