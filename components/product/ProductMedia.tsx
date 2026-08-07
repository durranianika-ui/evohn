import Image from "next/image";
import type { Product } from "@/data/products";
import { asset } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ProductMediaProps {
  product: Product;
  /** Index into `product.gallery`; omit for the primary image. */
  frame?: number;
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
 * The photograph keeps its own aspect ratio inside a standardized frame:
 * `object-cover` from the centre, so vials read at a consistent size across
 * cards even where source dimensions differ, without stretching the bottle.
 */
export function ProductMedia({
  product,
  frame,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: ProductMediaProps) {
  const src =
    frame === undefined ? product.image : (product.gallery[frame] ?? product.image);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        // The kit's photography direction: neutral warm ground, soft light.
        "bg-[radial-gradient(120%_90%_at_50%_18%,var(--color-mist)_0%,var(--color-warm)_58%,#b3aca4_100%)]",
        className,
      )}
    >
      <Image
        src={asset(src)}
        alt={`${product.name} — ${product.subtitle}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
      />
    </div>
  );
}
