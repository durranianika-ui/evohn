import { cn } from "@/lib/utils";

/**
 * The navigation hover mark.
 *
 * A registration-mark frame around the item plus a small dot before the label
 * — the crop-mark language the rest of the identity already uses (see
 * `components/common/Figure.tsx`).
 *
 * ## Mechanics
 *
 * Each corner is two 1px bars meeting at a right angle, scaled to zero along
 * their own length and grown to full on hover from a `transform-origin` at
 * that corner. Scaling a bar rather than animating its width keeps the whole
 * thing on the compositor: four corners is eight bars, and eight simultaneous
 * width animations would be eight layout passes per frame.
 *
 * The dot is a 10px rounded square, not a circle — at this size a 3px radius
 * reads as a machined component where a full radius reads as a bullet point.
 *
 * ## State
 *
 * `active` pins the mark on for the current route, so the bar shows where you
 * are as well as what you are pointing at. Everything collapses to a plain
 * opacity change under `prefers-reduced-motion`.
 */
export function NavMark({
  active = false,
  tone,
}: {
  active?: boolean;
  /** The surface the bar is currently sitting on. */
  tone: "dark" | "light";
}) {
  const bar = cn(
    "absolute block bg-current",
    "transition-transform duration-500 ease-brand motion-reduce:transition-none",
  );

  /** Shown when the item is hovered, focused within, or is the current route. */
  const shown = active
    ? "scale-100"
    : "scale-0 group-hover/nav:scale-100 group-focus-visible/nav:scale-100";

  // 1px bars, 9px long, inset far enough from the label that the frame reads
  // as a mark around it rather than a box drawn on it.
  const h = cn(bar, "h-px w-[9px]", shown);
  const v = cn(bar, "h-[9px] w-px", shown);

  return (
    <span
      aria-hidden
      className={cn(
        // Insets chosen so the frame clears the cap height with air on every
        // side: 28px tall inside the 40px row, 12px proud of the label at
        // each end. Any tighter and it reads as a box drawn on the text.
        "pointer-events-none absolute -inset-x-3 top-1.5 bottom-1.5",
        "transition-opacity duration-500 ease-brand",
        active ? "opacity-100" : "opacity-0 group-hover/nav:opacity-100",
        tone === "dark" ? "text-soft/70" : "text-carbon/45",
      )}
    >
      {/* Top-left */}
      <span className={cn(h, "top-0 left-0 origin-left")} />
      <span className={cn(v, "top-0 left-0 origin-top")} />
      {/* Top-right */}
      <span className={cn(h, "top-0 right-0 origin-right")} />
      <span className={cn(v, "top-0 right-0 origin-top")} />
      {/* Bottom-left */}
      <span className={cn(h, "bottom-0 left-0 origin-left")} />
      <span className={cn(v, "bottom-0 left-0 origin-bottom")} />
      {/* Bottom-right */}
      <span className={cn(h, "right-0 bottom-0 origin-right")} />
      <span className={cn(v, "right-0 bottom-0 origin-bottom")} />
    </span>
  );
}

/**
 * The dot that precedes the label on hover.
 *
 * Sand — the brand board's own warm tone — rather than a neutral, so the mark
 * has one point of colour against an otherwise monochrome bar.
 */
export function NavDot({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block size-2.5 shrink-0 rounded-[3px] bg-cat-growth",
        "transition-[opacity,transform] duration-400 ease-brand",
        "motion-reduce:transition-none",
        active
          ? "scale-100 opacity-100"
          : "scale-50 opacity-0 group-hover/nav:scale-100 group-hover/nav:opacity-100 group-focus-visible/nav:scale-100 group-focus-visible/nav:opacity-100",
      )}
    />
  );
}
