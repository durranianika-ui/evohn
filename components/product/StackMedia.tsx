import Image from "next/image";
import { VialGlyph } from "./VialGlyph";
import { getCategory } from "@/data/categories";
import { stackComponents, type Stack } from "@/data/stacks";
import { asset, hasAsset } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Stack plate.
 *
 * Where a photograph exists it is used. Where one does not, the stack is
 * drawn as its own components: one vector vial per compound, arranged in a
 * shallow arc with the principal compound forward. It communicates the
 * grouping without pretending to be a photograph.
 */
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

  // Centre the arrangement: the middle vial sits forward and largest.
  const layout = components.map((entry, i) => {
    const offset = i - (components.length - 1) / 2;
    return {
      entry,
      // Horizontal spread narrows as the group grows so three still fit.
      x: offset * (components.length > 2 ? 26 : 22),
      // Outer vials sit lower and smaller — a shallow arc, not a fan.
      y: Math.abs(offset) * 4,
      scale: 1 - Math.abs(offset) * 0.12,
      z: components.length - Math.abs(offset),
    };
  });

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        "bg-[radial-gradient(120%_90%_at_50%_16%,var(--color-mist)_0%,var(--color-warm)_56%,#b1aaa2_100%)]",
        className,
      )}
    >
      {hasAsset(stack.image) ? (
        <Image
          src={asset(stack.image)}
          alt={`${stack.name} — ${stack.tagline}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {layout.map(({ entry, x, y, scale, z }) => {
            const category = getCategory(entry.product.category);
            return (
              <div
                key={entry.product.slug}
                className="absolute h-[68%]"
                style={{
                  transform: `translate(${x}%, ${y}%) scale(${scale})`,
                  zIndex: z,
                }}
              >
                <VialGlyph
                  labelColor={category.token}
                  labelIsLight={category.swatchIsLight}
                  caption={entry.product.name}
                  seed={entry.product.slug.length}
                  className="h-full w-auto drop-shadow-[0_28px_44px_rgba(60,52,46,0.32)]"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
