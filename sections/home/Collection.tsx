import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CollectionTrack, type TrackItem } from "@/components/home/CollectionTrack";
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

/**
 * The collection.
 *
 * The reference pins this section for four viewport heights and walks a
 * horizontal track through it — the tallest block on its homepage by a wide
 * margin, and the one the page is built around. The previous three-column
 * grid resolved in a single screen and carried none of that pacing.
 *
 * Only the heading and the browse link live here; the track itself is a
 * client component because it reads scroll position. Product data is narrowed
 * to the four fields the card renders so the whole catalogue is not shipped
 * across the boundary.
 */
export function Collection() {
  const items: TrackItem[] = FEATURED.map((slug) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return null;
    return {
      slug: product.slug,
      name: product.name,
      summary: product.summary,
      image: `/products/${product.slug}.jpg`,
    };
  }).filter((item): item is TrackItem => item !== null);

  return (
    <section className="relative bg-ink text-soft">
      <div className="container-content pt-[clamp(5rem,12vh,10rem)]">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The Collection"
            title={"Compounds that\nset the standard."}
            size="display"
            className="lg:max-w-3xl"
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/catalogue" tone="dark" variant="outline">
              Browse the Catalogue
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      <CollectionTrack items={items} />
    </section>
  );
}
