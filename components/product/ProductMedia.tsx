import Image from "next/image";
import { VialGlyph } from "./VialGlyph";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { asset, hasAsset } from "@/lib/media";
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
 * Renders the photograph when one exists, and the vector vial on the brand's
 * stone-toned ground when it does not — so the catalogue is presentable at
 * every stage of the photography schedule.
 */
export function ProductMedia({
  product,
  frame,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: ProductMediaProps) {
  const category = getCategory(product.category);
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
      {hasAsset(src) ? (
        <Image
          src={asset(src)}
          alt={`${product.name} — ${product.subtitle}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[12%]">
          <VialGlyph
            labelColor={category.token}
            labelIsLight={category.swatchIsLight}
            caption={product.name}
            seed={product.slug.length}
            className="h-full w-auto max-w-full drop-shadow-[0_28px_44px_rgba(60,52,46,0.34)]"
          />
        </div>
      )}
    </div>
  );
}
