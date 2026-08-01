import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { CatalogueGrid } from "@/components/product/CatalogueGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/common/JsonLd";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { breadcrumbSchema, catalogueSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "The complete EVOHN catalogue of precision research compounds across eight domains — each analytically verified, independently confirmed and batch traceable.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  // Cards are rendered here, on the server, then handed to the client grid.
  const entries = products.map((product, i) => ({
    slug: product.slug,
    category: product.category,
    card: <ProductCard product={product} index={i} priority={i < 3} />,
  }));

  return (
    <>
      <JsonLd
        data={[
          catalogueSchema(),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Catalogue", href: "/products" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="The Catalogue"
        title={"Twelve compounds.\nOne standard."}
        body="A presentation catalogue, not a store. Each entry describes a compound as characterised in published literature, with its presentation, handling requirements and analytical documentation. Enquiries are handled directly by a specialist."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Catalogue", href: "/products" },
        ]}
        meta={[
          { label: "Compounds", value: String(products.length).padStart(2, "0") },
          { label: "Domains", value: String(categories.length).padStart(2, "0") },
          { label: "Verification", value: "HPLC + MS" },
          { label: "Documentation", value: "Per batch" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          {/* Names the grid for assistive technology and keeps the heading
              order unbroken between the page h1 and the card h3s. */}
          <h2 className="sr-only">All compounds</h2>
          <CatalogueGrid entries={entries} categories={categories} />
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Speak to someone\nwho knows the batch."}
        secondary={{ label: "Our Science", href: "/science" }}
      />
    </>
  );
}
