import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The EVOHN wordmark.
 *
 * Set in the primary display face with the wide tracking specified in
 * Brand Identity Kit §01. Rendered as live text rather than an image so it
 * stays sharp at every density, remains selectable, and is read correctly
 * by assistive technology.
 */
export function Wordmark({
  className,
  as: Tag = "span",
}: {
  className?: string;
  /** Use `h1` only where the wordmark is genuinely the page heading. */
  as?: "span" | "h1" | "div";
}) {
  return (
    <Tag className={cn("type-wordmark select-none", className)}>{site.name}</Tag>
  );
}

/**
 * Monogram used in tight spaces — the wordmark's first letter, framed.
 * Hidden from assistive technology wherever the full wordmark is adjacent.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center border border-current/25",
        className,
      )}
      aria-hidden
    >
      <span className="type-wordmark pl-[0.34em] text-[0.75rem]">
        {site.name.charAt(0)}
      </span>
    </span>
  );
}
