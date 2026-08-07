import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/Parallax";
import { LineMask } from "@/components/motion/LineMask";
import { asset, hasAsset } from "@/lib/media";

/**
 * Built by researchers — the reference's two-stage composition, verbatim in
 * structure: the statement and its supporting copy on the light ground
 * following the standard band, dissolving into a near-black stage where the
 * facility photography stands in a three-tile editorial row, each tile
 * captioned in the mono technical layer and settling into place as it
 * arrives (the reference's image-scale treatment).
 *
 * Photography is EVOHN's own facility set; captions come from the same
 * capability language the About page uses.
 */
const TILES = [
  {
    image: "/facilities/analysis.jpg",
    label: "QC Lab",
    caption: "Quality Control",
  },
  {
    image: "/facilities/synthesis.jpg",
    label: "Synthesis",
    caption: "Precision Formulation",
  },
  {
    image: "/facilities/cold-storage.jpg",
    label: "Cold Chain",
    caption: "Controlled Environment",
  },
];

export function Facilities() {
  return (
    <>
      {/* The statement, on the light ground the standard band established. */}
      <section className="section-blend-to-ink relative bg-soft pb-[clamp(10rem,26vh,16rem)] pt-[clamp(4rem,10vh,7rem)] text-carbon">
        <div className="container-home">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <LineMask
                as="h2"
                lines={[
                  { text: "Built by researchers." },
                  { text: "For researchers." },
                ]}
                className="type-display text-carbon"
              />
            </div>
            <div className="flex items-end lg:col-span-5">
              <Reveal delay={0.2}>
                <p className="type-body-s max-w-[52ch] text-carbon/62">
                  Our facility houses dedicated cleanrooms, analytical
                  laboratories and precision formulation suites &mdash; staffed
                  by scientists who understand the demands of rigorous
                  research. Every compound is synthesised, verified and
                  shipped under strict protocols.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* The facility row, on the void. */}
      <section className="bg-ink pb-[clamp(6rem,14vh,10rem)] pt-[clamp(4rem,10vh,7rem)] text-soft">
        <div className="container-home">
          <Stagger className="grid gap-4 md:grid-cols-3 md:gap-5" gap={0.1}>
            {TILES.filter((tile) => hasAsset(tile.image)).map((tile, i) => (
              <StaggerItem key={tile.image}>
                <figure className="group/tile">
                  <ParallaxImage
                    className="relative aspect-[4/5] w-full bg-onyx"
                    from={1.14}
                  >
                    {/* next/image wants a *positioned* parent; the motion
                        wrapper above is static until a transform lands. */}
                    <div className="relative h-full w-full">
                    <Image
                      src={asset(tile.image)}
                      alt={`${tile.label} — ${tile.caption}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      loading={i === 0 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-brand)] group-hover/tile:scale-[1.045] motion-reduce:transition-none"
                    />
                    </div>
                  </ParallaxImage>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="type-label text-soft">{tile.label}</span>
                    <span className="type-label text-soft/45">{tile.caption}</span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
