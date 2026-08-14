import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/common/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CollectionTrack, type TrackItem } from "@/components/home/CollectionTrack";
import { products } from "@/data/products";
import { getCategory } from "@/data/categories";
import { asset, imageAspect } from "@/lib/media";

/**
 * The collection — the whole approved catalogue, in catalogue order.
 *
 * This used to be a hand-written list of nine entries, two of which existed
 * only here and carried copy written for this component. That is exactly how a
 * card ends up describing a product the catalogue does not list. It now reads
 * `data/products` directly, so the homepage and the catalogue cannot disagree
 * about what EVOHN sells, what a compound is called, or which photograph
 * belongs to it.
 *
 * Every entry carries both presentations, so the card names the pen alongside
 * the vial it shows.
 *
 * No prices: the catalogue is a presentation catalogue and carries none.
 */
export function Collection() {
  const items: TrackItem[] = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    summary: product.summary,
    category: getCategory(product.category).name,
    presentation: product.presentations.map((p) => p.name).join(" · "),
    image: asset(product.image),
    aspect: imageAspect(product.image) ?? undefined,
    href: `/products/${product.slug}`,
  }));

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
          <Reveal delay={0.14} className="mt-5">
            <p className="type-body-s max-w-[52ch] text-soft/55">
              Twelve entries, each supplied as a lyophilised vial or a
              pre-filled pen carrying the identical certified material.
            </p>
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
