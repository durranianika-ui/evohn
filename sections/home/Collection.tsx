import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/common/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CollectionTrack, type TrackItem } from "@/components/home/CollectionTrack";
import { products } from "@/data/products";
import { getCategory } from "@/data/categories";
import { asset } from "@/lib/media";

/**
 * The collection — all nine supplied presentations, in the supplied order.
 *
 * Seven are catalogue compounds and carry their own data verbatim. Two are
 * presentations that exist as supplied assets but not as catalogue entries —
 * the TB-500 + BPC-157 co-study vial and bacteriostatic water — and their
 * lines below are the label copy from the supplied artwork, not invented
 * product data. The combination card resolves to the TB-500 entry, whose
 * page documents the co-study; the water resolves to the reconstitution
 * guide, which is where its handling is described.
 *
 * No prices: the catalogue is a presentation catalogue and carries none.
 */
const FEATURED: (string | TrackItem)[] = [
  {
    slug: "tb-500-bpc-157",
    name: "TB-500 + BPC-157",
    category: "Recovery",
    summary:
      "A dual-peptide formulation focused on accelerated repair pathways. Studied for synergistic effects in regenerative research.",
    image: "/products/tb-500-bpc-157.webp",
    href: "/products/tb-500",
  },
  "retatrutide",
  "mots-c",
  "ghk-cu",
  "cjc-1295-ipamorelin",
  "bpc-157",
  {
    slug: "bacteriostatic-water",
    name: "Bacteriostatic Water",
    category: "Preparation",
    summary:
      "Sterile water for injection, 10 mL. Keep refrigerated at 2–8°C. The reconstitution medium for the range.",
    image: "/products/bacteriostatic-water.webp",
    href: "/reconstitution-guide",
  },
  "selank",
  "nad-plus",
];

export function Collection() {
  const items: TrackItem[] = FEATURED.map((entry) => {
    if (typeof entry !== "string") {
      return { ...entry, image: asset(entry.image) };
    }
    const product = products.find((p) => p.slug === entry);
    if (!product) return null;
    return {
      slug: product.slug,
      name: product.name,
      summary: product.summary,
      category: getCategory(product.category).name,
      image: asset(product.image),
      href: `/products/${product.slug}`,
    };
  }).filter((item): item is TrackItem => item !== null);

  return (
    <section className="relative -mt-px bg-onyx text-soft">
      {/* Centred heading — the reference's composition for this stage. */}
      <div className="container-home pt-[clamp(4rem,10vh,8rem)]">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal distance={10}>
            <Eyebrow className="text-[var(--color-cat-growth)] opacity-100">
              Our Collection
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="type-display-s mt-4 text-soft">
              Precision compounds that set the standard.
            </h2>
          </Reveal>
          <Reveal delay={0.18} className="mt-8">
            <ButtonLink href="/catalogue" tone="dark" variant="outline">
              Browse All Products
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      <CollectionTrack items={items} />
    </section>
  );
}
