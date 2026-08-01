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
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { getCategory } from "@/data/categories";
import { products, productBySlug, relatedProducts } from "@/data/products";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { disclaimer, site } from "@/data/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${site.name}`,
      description: product.summary,
      url: `${site.url}/products/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${site.name}`,
      description: product.summary,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = relatedProducts(product);

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
            { name: "Catalogue", href: "/products" },
            { name: product.name, href: `/products/${product.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={product.subtitle}
        title={product.name}
        body={product.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Catalogue", href: "/products" },
          { name: product.name, href: `/products/${product.slug}` },
        ]}
        meta={[
          { label: "Category", value: category.name },
          { label: "Presentation", value: product.dosage },
          { label: "Purity", value: product.specs.purity },
          { label: "Form", value: product.specs.form },
        ]}
      />

      {/* Gallery + specification */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal duration={1}>
                <ProductGallery frames={frames} productName={product.name} />
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              {/* Sticky within the scroll of the gallery column. */}
              <div className="lg:sticky lg:top-32">
                <Reveal distance={12}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full ring-1 ring-carbon/15"
                      style={{ backgroundColor: category.token }}
                    />
                    <Link
                      href={`/categories/${category.slug}`}
                      className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                    >
                      {category.name}
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="type-display-s mt-8">Characterisation</h2>
                </Reveal>

                <Reveal delay={0.14}>
                  <p className="type-body mt-8 text-carbon/62">
                    {product.description}
                  </p>
                </Reveal>

                {/* Specification table */}
                <Reveal delay={0.2} className="mt-12">
                  <h3 className="type-label text-carbon/62">Specification</h3>
                  <dl className="mt-6 border-t border-carbon/12">
                    {[
                      ["CAS Number", product.specs.cas],
                      ["Molecular Formula", product.specs.formula],
                      ["Molar Mass", product.specs.molarMass],
                      ["Purity", product.specs.purity],
                      ["Physical Form", product.specs.form],
                      ["Presentation", product.dosage],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-wrap items-baseline justify-between gap-4 border-b border-carbon/12 py-4"
                      >
                        <dt className="type-label text-carbon/62">{label}</dt>
                        <dd className="type-body-s text-right text-carbon">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>

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

      {/* Research focus + applications */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="type-label text-soft/55">Research Focus</h2>
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

              <h3 className="type-label mt-16 text-soft/55">Applications</h3>
              <ul className="mt-6 flex flex-wrap gap-3">
                {product.applications.map((item) => (
                  <li
                    key={item}
                    className="type-label border border-soft/18 px-4 py-2.5 text-soft/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Handling */}
      <section className="section-y bg-mist text-carbon">
        <div className="container-content">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="type-label text-carbon/62">Storage &amp; Handling</h2>
              <p className="type-body mt-7 max-w-[48ch] text-carbon/65">
                {product.storage}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="type-label text-carbon/62">Packaging</h2>
              <p className="type-body mt-7 max-w-[48ch] text-carbon/65">
                {product.packaging}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="mt-20 border-t border-carbon/12 pt-8">
            <p className="type-body-s max-w-[92ch] text-carbon/62">
              {disclaimer.short}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      {related.length ? (
        <section className="section-y bg-soft text-carbon">
          <div className="container-content">
            <h2 className="type-label text-carbon/62">Related Compounds</h2>
            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.08}>
                  <ProductCard product={item} />
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
        secondary={{ label: "Full Catalogue", href: "/products" }}
      />

      {/* Persistent action, clear of the footer's own CTA on small screens. */}
      <StickyEnquiryBar product={product.name} />
    </>
  );
}
