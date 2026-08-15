import Image from "next/image";
import { getPresentation, type Product } from "@/data/products";
import { stackComponents, type Stack } from "@/data/stacks";
import { asset } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Stack plate.
 *
 * A stack is two or three separately certified compounds, and the plate says
 * so literally: one panel per component, each showing that compound's own
 * catalogue render, butted together into a single frame.
 *
 * This works because `scripts/prepare-product-renders.mjs` puts every vial at
 * the same scale and the same height in its 4:5 canvas. Cropping each render
 * to a narrow vertical slice around its bottle therefore lands the caps on one
 * line and the bases on another straight across the panels, so the panels read
 * as one photograph of a group rather than three pictures pushed together.
 * `objectPosition` is set to the prepared horizontal centre so the slice is
 * taken around the bottle rather than the middle of the frame.
 *
 * It also replaces what was here before: a single generic vial standing in for
 * a multi-compound grouping, which showed the wrong number of compounds and
 * the wrong compounds at that.
 */

/** Where the prepared renders place the bottle horizontally. */
const PRODUCT_CX = "51%";

export function StackMedia({
  stack,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  stack: Stack;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const components = stackComponents(stack);

  // Each panel carries a fraction of the frame, so the `sizes` hint has to be
  // divided down or every browser fetches a full-width image per component.
  const panelSizes = `calc((${sizes.split(",").pop()?.trim() ?? "100vw"}) / ${components.length})`;

  return (
    <div
      className={cn(
        "relative isolate flex overflow-hidden",
        "bg-[radial-gradient(120%_90%_at_50%_16%,#2a2a2c_0%,#161618_62%,#0d0d0e_100%)]",
        className,
      )}
    >
      {components.map(({ product }, i) => (
        <div
          key={product.slug}
          className={cn(
            "relative h-full flex-1",
            // A hairline between panels, so the join reads as a considered
            // triptych rather than a seam nobody noticed.
            i > 0 && "border-l border-soft/10",
          )}
        >
          <Image
            src={asset(vialRender(product))}
            alt={`EVOHN ${product.name}`}
            fill
            sizes={panelSizes}
            priority={priority && i === 0}
            className="object-cover"
            style={{ objectPosition: `${PRODUCT_CX} 50%` }}
          />
        </div>
      ))}
    </div>
  );
}

/** The vial render, which is the presentation the stack plates are built from. */
function vialRender(product: Product) {
  return getPresentation(product, "vial")?.image ?? product.image;
}
