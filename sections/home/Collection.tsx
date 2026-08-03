import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";

/** One compound drawn from each of six domains. */
const FEATURED = [
  "semaglutide",
  "bpc-157",
  "nad-plus",
  "cjc-1295-ipamorelin",
  "ghk-cu",
  "mots-c",
];

export function Collection() {
  const featured = FEATURED.map(
    (slug) => products.find((p) => p.slug === slug)!,
  ).filter(Boolean);

  return (
    <section className="section-y bg-soft text-carbon">
      <div className="container-content">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The Collection"
            title={"Compounds that\nset the standard."}
            size="display"
            className="lg:max-w-3xl"
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/catalogue" tone="light" variant="outline">
              Browse the Catalogue
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={(i % 3) * 0.08}>
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
