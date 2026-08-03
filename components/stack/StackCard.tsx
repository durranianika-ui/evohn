import Link from "next/link";
import { StackMedia } from "@/components/product/StackMedia";
import { getCategory } from "@/data/categories";
import { stackComponents, type Stack } from "@/data/stacks";
import { cn } from "@/lib/utils";

/**
 * Stack card.
 *
 * Reads as an editorial spread rather than a product tile: the plate takes
 * the left half at desktop, the constituent compounds are listed in full, and
 * the action is an enquiry rather than an add.
 */
export function StackCard({
  stack,
  index,
  reversed = false,
  priority = false,
}: {
  stack: Stack;
  index: number;
  /** Alternate the plate side down the page. */
  reversed?: boolean;
  priority?: boolean;
}) {
  const category = getCategory(stack.category);
  const components = stackComponents(stack);

  return (
    <article className="group/stack border-t border-carbon/10 pt-12">
      <div
        className={cn(
          "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
          reversed && "lg:[&>*:first-child]:order-2",
        )}
      >
        <Link
          href={`/stacks/${stack.slug}`}
          tabIndex={-1}
          aria-hidden
          className="block overflow-hidden"
        >
          <StackMedia
            stack={stack}
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn(
              "aspect-4/3 w-full",
              "transition-transform duration-[1.2s] ease-brand",
              "group-hover/stack:scale-[1.035] motion-reduce:transition-none",
            )}
          />
        </Link>

        <div>
          <div className="type-label flex items-center gap-4 text-carbon/62">
            <span
              aria-hidden
              className="size-2 rounded-full ring-1 ring-carbon/15"
              style={{ backgroundColor: category.token }}
            />
            <span>{stack.eyebrow}</span>
            <span aria-hidden className="h-px flex-1 bg-carbon/12" />
            <span className="tabular-nums">
              {String(components.length).padStart(2, "0")} compounds
            </span>
          </div>

          <h3 className="type-display-s mt-7">
            <Link href={`/stacks/${stack.slug}`} className="relative inline-block">
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

          <p className="type-body mt-6 max-w-[46ch] text-carbon/62">
            {stack.tagline}
          </p>

          <dl className="mt-10 border-t border-carbon/10">
            {components.map((entry) => (
              <div
                key={entry.product.slug}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-carbon/10 py-4"
              >
                <dt className="type-title-s text-carbon">
                  {entry.product.name}
                </dt>
                <dd className="type-body-s max-w-[38ch] text-carbon/55">
                  {entry.role}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href={`/stacks/${stack.slug}`}
            className="type-label mt-10 inline-flex items-center gap-3 text-carbon"
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

          <span className="type-label ml-6 tabular-nums text-carbon/35">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </article>
  );
}
