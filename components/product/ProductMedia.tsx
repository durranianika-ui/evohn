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
 * The ground is the renders' own near-black rather than the warm plate this
 * used to paint. The photography carries its own lit background now, so a
 * light ground would only ever be seen as a pale seam at the frame's edge
 * while the image decodes.
 */
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

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        // Matches the ground the renders are lit against.
        "bg-[radial-gradient(120%_90%_at_50%_18%,#2a2a2c_0%,#161618_62%,#0d0d0e_100%)]",
        className,
      )}
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
