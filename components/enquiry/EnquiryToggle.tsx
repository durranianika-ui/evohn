"use client";

import { useEnquiry, type EnquiryItem } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

/**
 * Add / remove one compound.
 *
 * The label is written from the compound's point of view, not the control's —
 * "Add BPC-157 to enquiry", not "Add" — so a screen-reader user tabbing a grid
 * of twelve cards hears twelve distinguishable buttons rather than twelve
 * identical ones.
 *
 * Nothing renders until the persisted list has been read. The static export
 * cannot know what is in the visitor's browser, so a button that guessed would
 * flash the wrong state and then contradict itself on hydration.
 */
export function EnquiryToggle({
  item,
  tone = "light",
  variant = "outline",
  className,
}: {
  item: EnquiryItem;
  tone?: "light" | "dark";
  variant?: "outline" | "solid";
  className?: string;
}) {
  const { has, toggle, ready } = useEnquiry();
  const dark = tone === "dark";

  if (!ready) {
    // Reserve the space so nothing shifts when the control appears.
    return (
      <span
        aria-hidden
        className={cn("block min-h-12", className)}
        data-print="hide"
      />
    );
  }

  const added = has(item.slug);

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-pressed={added}
      data-print="hide"
      className={cn(
        "type-label inline-flex min-h-12 items-center justify-center gap-3 px-8 py-4",
        "transition-colors duration-400 ease-brand",
        variant === "solid" && !added
          ? dark
            ? "bg-soft text-carbon hover:opacity-88"
            : "bg-carbon text-soft hover:opacity-88"
          : dark
            ? "border border-soft/25 text-soft hover:border-soft"
            : "border border-carbon/20 text-carbon hover:border-carbon",
        added && (dark ? "bg-soft/8" : "bg-mist/70"),
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "block size-1.5 rounded-dot transition-colors duration-400",
          added
            ? dark
              ? "bg-soft"
              : "bg-carbon"
            : dark
              ? "bg-soft/25"
              : "bg-carbon/25",
        )}
      />
      {added ? "In your enquiry" : "Add to enquiry"}
      <span className="sr-only">
        {added ? `— remove ${item.name}` : `— ${item.name}`}
      </span>
    </button>
  );
}
