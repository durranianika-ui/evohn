import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { categories, categoryBySlug, type CategorySlug } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/data/site";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = categoryBySlug.get(slug as CategorySlug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${site.name}`,
      description: category.description,
      url: `${site.url}/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const category = categoryBySlug.get(slug as CategorySlug);
  if (!category) notFound();

  const items = productsByCategory(category.slug);
  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Catalogue", href: "/products" },
          { name: category.name, href: `/categories/${category.slug}` },
        ])}
      />

      <PageHero
        eyebrow={category.tagline}
        title={category.name}
        body={category.description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Catalogue", href: "/products" },
          { name: category.name, href: `/categories/${category.slug}` },
        ]}
        meta={[
          { label: "Compounds", value: String(items.length).padStart(2, "0") },
          { label: "Label Colour", value: category.swatch },
          { label: "Purity", value: "≥ 99% by HPLC" },
          { label: "Documentation", value: "Per batch" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="sr-only">{category.name} compounds</h2>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                <ProductCard product={product} index={i} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sibling domains */}
      <section className="section-y bg-mist text-carbon">
        <div className="container-content">
          <h2 className="type-label text-carbon/62">Other Domains</h2>
          <ul className="mt-10 flex flex-wrap gap-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/categories/${other.slug}`}
                  className="type-label inline-flex items-center gap-2.5 border border-carbon/15 px-5 py-3 text-carbon/62 transition-colors duration-400 ease-brand hover:border-carbon/45 hover:text-carbon"
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full ring-1 ring-carbon/15"
                    style={{ backgroundColor: other.token }}
                  />
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={`Discuss ${category.name.toLowerCase()}\nwith a specialist.`}
        secondary={{ label: "Full Catalogue", href: "/products" }}
      />
    </>
  );
}
