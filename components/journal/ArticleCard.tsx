import Link from "next/link";
import { Figure } from "@/components/common/Figure";
import { topicBySlug, type Article } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Journal card.
 *
 * Two sizes share one component. `feature` gives the lead entry a wider plate
 * and the display face; the standard size is the grid unit beneath it.
 */
export function ArticleCard({
  article,
  feature = false,
  tone = "light",
  priority = false,
  sizes,
  className,
}: {
  article: Article;
  feature?: boolean;
  tone?: "light" | "dark";
  priority?: boolean;
  /** Overrides the default responsive hint for the plate. */
  sizes?: string;
  className?: string;
}) {
  const topic = topicBySlug.get(article.topic);
  const dark = tone === "dark";

  return (
    <article className={cn("group/article", className)}>
      <Link href={`/journal/${article.slug}`} className="block">
        <div className="overflow-hidden">
          <Figure
            src={article.image}
            alt=""
            placeholderLabel={topic?.name}
            tone={dark ? "dark" : "light"}
            priority={priority}
            sizes={
              sizes ??
              (feature
                ? "(min-width: 1024px) 60vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw")
            }
            className={cn(
              "w-full",
              feature ? "aspect-16/10" : "aspect-3/2",
              "transition-transform duration-[1.2s] ease-brand",
              "group-hover/article:scale-[1.045] motion-reduce:transition-none",
            )}
          />
        </div>

        <div className={feature ? "mt-8" : "mt-7"}>
          <div
            className={cn(
              "type-label flex flex-wrap items-center gap-x-4 gap-y-1",
              dark ? "text-soft/55" : "text-carbon/62",
            )}
          >
            <span>{topic?.name ?? "Journal"}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden>·</span>
            <span>{article.readMinutes} min read</span>
          </div>

          <h3
            className={cn(
              "mt-5",
              feature ? "type-display-s max-w-[20ch]" : "type-title max-w-[26ch]",
              dark ? "text-soft" : "text-carbon",
            )}
          >
            <span className="relative inline">
              {article.title}
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-0 bg-current",
                  "transition-[width] duration-700 ease-brand",
                  "group-hover/article:w-full motion-reduce:transition-none",
                )}
              />
            </span>
          </h3>

          <p
            className={cn(
              "type-body-s mt-5",
              feature ? "max-w-[58ch]" : "line-clamp-3 max-w-[46ch]",
              dark ? "text-soft/55" : "text-carbon/62",
            )}
          >
            {article.excerpt}
          </p>

          <span
            className={cn(
              "type-label mt-7 inline-flex items-center gap-3",
              dark ? "text-soft" : "text-carbon",
            )}
          >
            Read entry
            <span
              aria-hidden
              className="transition-transform duration-500 ease-brand group-hover/article:translate-x-1 motion-reduce:transition-none"
            >
              &#8594;
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
