import Link from "next/link";
import { StackMedia } from "@/components/product/StackMedia";
import { getCategory } from "@/data/categories";
import { stackComponents, type Stack } from "@/data/stacks";
import { cn } from "@/lib/utils";

/**
 * Stack row.
 *
 * An editorial row rather than a product tile: a square plate on the left
 * carrying one panel per component, and a specification column on the right
 * that names every compound in the grouping and the part it plays. Rows are
 * separated by a hairline and the plate stays on the same side all the way
 * down, so the eye tracks one column of photography and one column of text
 * instead of zig-zagging.
 *
 * The column that would carry a price on a shop reads the research domain and
 * the compound count instead. There is no price, no bundle and no saving
 * anywhere in this catalogue, and a stack is a description of how compounds
 * are studied together — not a discounted set.
 */
export function StackCard({
  stack,
  index,
  priority = false,
}: {
  stack: Stack;
  index: number;
  priority?: boolean;
}) {
  const category = getCategory(stack.category);
  const components = stackComponents(stack);

  return (
    <article className="group/stack border-t border-carbon/12">
      <div
        className={cn(
          "grid gap-10 py-14 md:gap-12 md:py-20",
          "lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-start lg:gap-20",
        )}
      >
        {/* Plate. Not focusable — the title beneath is the accessible link,
            and two tab stops to the same place is noise for keyboard users. */}
        <Link
          href={`/stacks/${stack.slug}`}
          tabIndex={-1}
          aria-hidden
          className="block overflow-hidden"
        >
          <StackMedia
            stack={stack}
            priority={priority}
            sizes="(min-width: 1024px) 44vw, 100vw"
            className={cn(
              "aspect-square w-full",
              "transition-transform duration-[1.2s] ease-brand",
              "group-hover/stack:scale-[1.035] motion-reduce:transition-none",
            )}
          />
        </Link>

        <div className="lg:pt-2">
          <div className="type-label flex items-center gap-4 text-carbon/62">
            <span
              aria-hidden
              className="size-2 rounded-full ring-1 ring-carbon/15"
              style={{ backgroundColor: category.token }}
            />
            <span>{stack.eyebrow}</span>
            <span aria-hidden className="h-px flex-1 bg-carbon/12" />
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <p className="type-label mt-8 text-carbon/45">{category.name}</p>

          <h3 className="type-display-s mt-3">
            <Link
              href={`/stacks/${stack.slug}`}
              className="relative inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-carbon"
            >
              {stack.name}
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-0 bg-current",
                  "transition-[width] duration-700 ease-brand",
                  "group-hover/stack:w-full motion-reduce:transition-none",
                )}
              />
            </Link>
          </h3>

          <p className="type-body mt-6 max-w-[48ch] text-carbon/62">
            {stack.tagline}
          </p>

          <p className="type-label mt-12 border-t border-carbon/12 pt-6 text-carbon/45">
            What the grouping includes
          </p>

          <dl className="mt-1">
            {components.map((entry) => (
              <div
                key={entry.product.slug}
                className="grid gap-x-6 gap-y-1 border-b border-carbon/10 py-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
              >
                <dt className="type-title-s text-carbon">
                  {entry.product.name}
                </dt>
                {/* Capped, or the role runs to an eighty-character measure on
                    a wide desktop while every other block on the page holds
                    to a readable one. */}
                <dd className="type-body-s max-w-[54ch] text-carbon/55">
                  {entry.role}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            <Link
              href={`/stacks/${stack.slug}`}
              className="type-label inline-flex items-center gap-3 text-carbon focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-carbon"
            >
              <span className="relative">
                Examine the protocol
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-0 bg-current",
                    "transition-[width] duration-500 ease-brand",
                    "group-hover/stack:w-full motion-reduce:transition-none",
                  )}
                />
              </span>
              <span
                aria-hidden
                className="transition-transform duration-500 ease-brand group-hover/stack:translate-x-1 motion-reduce:transition-none"
              >
                &#8594;
              </span>
            </Link>

            <span className="type-label tabular-nums text-carbon/45">
              {String(components.length).padStart(2, "0")} compounds ·
              certified separately
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
