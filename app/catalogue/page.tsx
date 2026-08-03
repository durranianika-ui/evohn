import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { CatalogueBrowser } from "@/components/product/CatalogueBrowser";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/common/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ArrowLink } from "@/components/ui/Button";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { stacks } from "@/data/stacks";
import { labSummary } from "@/data/lab-results";
import { breadcrumbSchema, catalogueSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "The complete EVOHN catalogue of precision research compounds across eight research domains — each analytically verified, independently confirmed and batch traceable.",
  alternates: { canonical: "/catalogue" },
};

export default function CataloguePage() {
  // Cards are rendered here, on the server, then handed to the client browser.
  // Only the server can decide between photography and the vector plate.
  const entries = products.map((product, i) => ({
    slug: product.slug,
    category: product.category,
    search: [
      product.name,
      product.subtitle,
      product.summary,
      product.specs.cas,
      ...product.alsoKnownAs,
    ]
      .join(" ")
      .toLowerCase(),
    card: (
      <ProductCard
        product={product}
        index={i}
        priority={i < 3}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
      />
    ),
  }));

  return (
    <>
      <JsonLd
        data={[
          catalogueSchema(),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Catalogue", href: "/catalogue" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="The Catalogue"
        title={"The complete\ncollection"}
        body="A presentation catalogue, not a store. Every entry describes a compound as the published literature characterises it — with its presentation, handling requirements and the analytical record that released the batch. Enquiries are handled directly by a specialist."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Catalogue", href: "/catalogue" },
        ]}
        meta={[
          {
            label: "Compounds",
            value: String(products.length).padStart(2, "0"),
          },
          {
            label: "Research domains",
            value: String(categories.length).padStart(2, "0"),
          },
          { label: "Mean assayed purity", value: `${labSummary.meanPurity}%` },
          { label: "Certificates published", value: String(labSummary.certificates) },
        ]}
      />

      {/* Domain rail — the same taxonomy as the mega panel, laid flat. */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content py-14">
          <h2 className="type-label text-carbon/45">Browse by research domain</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogue?domain=${category.slug}`}
                  className="group/domain flex items-baseline gap-3"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-2 shrink-0 rounded-full ring-1 ring-carbon/15"
                    style={{ backgroundColor: category.token }}
                  />
                  <span>
                    <span className="type-title-s relative inline-block text-carbon">
                      {category.name}
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/domain:w-full motion-reduce:transition-none"
                      />
                    </span>
                    <span className="type-body-s block text-carbon/55">
                      {category.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          {/* Names the grid for assistive technology and keeps the heading
              order unbroken between the page h1 and the card h3s. */}
          <h2 className="sr-only">All compounds</h2>
          <CatalogueBrowser entries={entries} categories={categories} />
        </div>
      </section>

      {/* Stacks cross-sell — the other way into the catalogue. */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="Research stacks"
            title={"Compounds studied\ntogether"}
            body="Where the literature examines several compounds as one system, the catalogue presents them as one grouping — separately certified, described as a protocol rather than a bundle."
            action={<ArrowLink href="/stacks">All stacks</ArrowLink>}
          />

          <ul className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack, i) => (
              <Reveal key={stack.slug} delay={i * 0.05} as="li">
                <Link
                  href={`/stacks/${stack.slug}`}
                  className="group/s block border-t border-carbon/15 pt-6"
                >
                  <p className="type-label text-carbon/45">{stack.eyebrow}</p>
                  <p className="type-title mt-4 text-carbon">
                    <span className="relative inline">
                      {stack.name}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/s:w-full motion-reduce:transition-none"
                      />
                    </span>
                  </p>
                  <p className="type-body-s mt-4 text-carbon/62">
                    {stack.tagline}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Speak to someone\nwho knows the batch."}
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
