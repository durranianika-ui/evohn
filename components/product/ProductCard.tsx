import Link from "next/link";
import { ProductMedia } from "./ProductMedia";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { currentBatch } from "@/data/lab-results";
import { cn } from "@/lib/utils";

/**
 * Catalogue card.
 *
 * The whole card is a single link, so the affordance is one uninterrupted
 * target rather than a link nested inside a link. The "View compound" cue is
 * therefore styled text driven by the card's own hover group.
 *
 * The purity figure shown is the assayed result for the current batch, read
 * from the certificate — not the specification. Where no batch has been
 * released the badge is omitted rather than falling back to the target.
 */
export function ProductCard({
  product,
  index,
  tone = "light",
  className,
  priority = false,
  sizes,
}: {
  product: Product;
  index?: number;
  tone?: "light" | "dark";
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const category = getCategory(product.category);
  const batch = currentBatch(product.slug);
  const dark = tone === "dark";

  return (
    <Link
      href={`/catalogue/${product.slug}`}
      className={cn("group/card block", className)}
    >
      <div className="relative overflow-hidden">
        <ProductMedia
          product={product}
          priority={priority}
          sizes={sizes}
          className={cn(
            "aspect-4/5 w-full",
            "transition-transform duration-[1.2s] ease-brand",
            "group-hover/card:scale-[1.045] motion-reduce:transition-none",
          )}
        />

        {/* Category swatch — the kit's colour-coded range system. */}
        <span
          className="absolute top-5 left-5 size-2.5 rounded-full ring-1 ring-carbon/15"
          style={{ backgroundColor: category.token }}
          aria-hidden
        />

        {index !== undefined ? (
          <span className="type-label absolute top-5 right-5 tabular-nums text-carbon/62">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}

        {/* Verified band — slides up from the foot of the plate on hover. */}
        {batch ? (
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 flex items-center justify-between gap-4",
              "bg-soft/92 px-5 py-3.5 backdrop-blur-sm",
              "translate-y-full transition-transform duration-500 ease-brand",
              "group-hover/card:translate-y-0",
              "motion-reduce:translate-y-0 motion-reduce:transition-none",
            )}
          >
            <span className="type-label text-carbon/62">
              Batch {batch.batch}
            </span>
            <span className="type-label tabular-nums text-carbon">
              {batch.purity}
            </span>
          </span>
        ) : null}
      </div>

      <div className="mt-7">
        <div
          className={cn(
            "type-label flex items-center justify-between gap-4",
            dark ? "text-soft/55" : "text-carbon/62",
          )}
        >
          <span>{category.name}</span>
          <span className="tabular-nums">{product.dosage}</span>
        </div>

        <h3 className={cn("type-title mt-4", dark ? "text-soft" : "text-carbon")}>
          {product.name}
        </h3>

        <p
          className={cn(
            "type-body-s mt-3 line-clamp-3",
            dark ? "text-soft/55" : "text-carbon/62",
          )}
        >
          {product.summary}
        </p>

        <span
          className={cn(
            "type-label mt-7 inline-flex items-center gap-3",
            dark ? "text-soft" : "text-carbon",
          )}
        >
          <span className="relative">
            View compound
            <span
              aria-hidden
              className={cn(
                "absolute -bottom-1 left-0 h-px w-0 bg-current",
                "transition-[width] duration-500 ease-brand",
                "group-hover/card:w-full motion-reduce:transition-none",
              )}
            />
          </span>
          <span
            aria-hidden
            className={cn(
              "transition-transform duration-500 ease-brand",
              "group-hover/card:translate-x-1 motion-reduce:transition-none",
            )}
          >
            &#8594;
          </span>
        </span>
      </div>
    </Link>
  );
}
