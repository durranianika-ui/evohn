import Image from "next/image";
import {
  getPresentation,
  type PresentationKind,
  type Product,
} from "@/data/products";
import { asset } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ProductMediaProps {
  product: Product;
  /** Index into `product.gallery`; omit for the primary image. */
  frame?: number;
  /**
   * Show a named presentation instead of the primary image. Preferred over
   * `frame` where the caller means "the pen", because it says so.
   */
  presentation?: PresentationKind;
  className?: string;
  /** `sizes` hint for the responsive image. */
  sizes?: string;
  priority?: boolean;
}

/**
 * Product plate.
 *
 * Renders the finalized product photography for every compound. The vector
 * fallback is gone by request: the supplied assets are authoritative, every
 * catalogue entry has one, and nothing may quietly stand in for them.
 *
 * Both presentations are prepared to one 4:5 canvas by
 * `scripts/prepare-product-renders.mjs`, which recrops each render so the
 * product occupies the same fraction of the frame at the same position. The
 * frame here is therefore the image's own ratio, and `object-cover` neither
 * crops nor letterboxes anything — it is the guard that keeps a future
 * off-ratio asset filling the plate instead of floating in it.
 *
 * The ground behind the loading image is keyed per family to the
 * photography's own backdrop, so nothing flashes while the file decodes: the
 * 2026-08 vial shoot stands on a light warm stone scene (centre ~#ada59f
 * falling to near-black crevice walls at the edges), while the pen shoot
 * remains lit against near-black. One shared gradient cannot serve both — a
 * dark plate behind a light photograph reads as a hard flash on every
 * navigation, which is exactly the defect this used to prevent.
 */
const GROUND: Record<PresentationKind, string> = {
  vial: "bg-[radial-gradient(120%_90%_at_50%_45%,#ada59f_0%,#7d7873_58%,#3a3733_100%)]",
  pen: "bg-[radial-gradient(120%_90%_at_50%_18%,#2a2a2c_0%,#161618_62%,#0d0d0e_100%)]",
};
export function ProductMedia({
  product,
  frame,
  presentation,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: ProductMediaProps) {
  const named = presentation
    ? getPresentation(product, presentation)?.image
    : undefined;
  const src =
    named ??
    (frame === undefined
      ? product.image
      : (product.gallery[frame] ?? product.image));

  // Which family's backdrop to stand behind the loading image. The source
  // path is authoritative — a gallery frame is a pen render even when no
  // `presentation` was asked for by name.
  const kind: PresentationKind = src.includes("/pen-") ? "pen" : "vial";

  return (
    <div
      className={cn("relative isolate overflow-hidden", GROUND[kind], className)}
    >
      <Image
        src={asset(src)}
        alt={
          presentation
            ? `EVOHN ${product.name} ${presentation} — ${product.subtitle}`
            : `${product.name} — ${product.subtitle}`
        }
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
      />
    </div>
  );
}
