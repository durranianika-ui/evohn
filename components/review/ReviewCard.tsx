import Link from "next/link";
import { VerifiedBadge } from "@/components/lab/VerifiedBadge";
import { productBySlug } from "@/data/products";
import type { Review } from "@/data/reviews";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Rating rendered as filled and unfilled marks, with the value in text. */
function Rating({ value, tone }: { value: number; tone: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <p
      className={cn(
        "type-label flex items-center gap-1.5",
        dark ? "text-soft/70" : "text-carbon/70",
      )}
    >
      <span aria-hidden className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "block size-1.5 rounded-full",
              i < value
                ? dark
                  ? "bg-soft"
                  : "bg-carbon"
                : dark
                  ? "bg-soft/20"
                  : "bg-carbon/20",
            )}
          />
        ))}
      </span>
      <span className="sr-only">Rated {value} out of 5</span>
      <span aria-hidden className="ml-1.5 tabular-nums">
        {value}.0
      </span>
    </p>
  );
}

/**
 * Testimonial card.
 *
 * Large, editorial and deliberately unadorned: no avatar, no star graphics,
 * no company logos. The verification mark is the only badge, and it is only
 * ever set where the submission has been matched to a confirmed record.
 */
export function ReviewCard({
  review,
  tone = "light",
  feature = false,
  className,
}: {
  review: Review;
  tone?: "light" | "dark";
  feature?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  const product = review.product ? productBySlug.get(review.product) : undefined;

  return (
    <article
      className={cn(
        "flex h-full flex-col border p-8 md:p-10",
        dark ? "border-soft/12" : "border-carbon/12",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <Rating value={review.rating} tone={tone} />
        <VerifiedBadge verified={review.verified} tone={tone} />
      </div>

      <h3
        className={cn(
          "mt-8",
          feature ? "type-display-s max-w-[20ch]" : "type-title max-w-[24ch]",
          dark ? "text-soft" : "text-carbon",
        )}
      >
        {review.headline}
      </h3>

      <blockquote
        className={cn(
          "type-body mt-6 flex-1",
          feature ? "max-w-[54ch]" : "max-w-[48ch]",
          dark ? "text-soft/62" : "text-carbon/68",
        )}
      >
        {review.body}
      </blockquote>

      <footer
        className={cn(
          "mt-10 border-t pt-6",
          dark ? "border-soft/10" : "border-carbon/10",
        )}
      >
        <p
          className={cn(
            "type-title-s",
            dark ? "text-soft" : "text-carbon",
          )}
        >
          {review.author}
        </p>
        <p
          className={cn(
            "type-body-s mt-1.5",
            dark ? "text-soft/45" : "text-carbon/55",
          )}
        >
          {review.role}
        </p>
        <div
          className={cn(
            "type-label mt-5 flex flex-wrap items-center gap-x-4 gap-y-2",
            dark ? "text-soft/40" : "text-carbon/45",
          )}
        >
          <span>{review.location}</span>
          <span aria-hidden>·</span>
          <time dateTime={review.date}>{formatDateShort(review.date)}</time>
          {product ? (
            <>
              <span aria-hidden>·</span>
              <Link
                href={`/catalogue/${product.slug}`}
                className={cn(
                  "transition-colors duration-400 ease-brand",
                  dark ? "hover:text-soft" : "hover:text-carbon",
                )}
              >
                {product.name}
              </Link>
            </>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
