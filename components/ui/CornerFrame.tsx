import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Corner markers.
 *
 * The reference frames its cards with four short right-angle ticks rather
 * than a continuous border — the corners are drawn, the edges are not. Built
 * from four absolutely positioned boxes each showing two borders, so the tick
 * length is one value to change and nothing depends on a background colour.
 */
export function CornerFrame({
  children,
  className,
  tone = "dark",
  length = 14,
}: {
  children: ReactNode;
  className?: string;
  /** Which ground this sits on — sets the marker colour. */
  tone?: "dark" | "light";
  /** Arm length of each corner tick, in pixels. */
  length?: number;
}) {
  const edge = tone === "dark" ? "border-soft/30" : "border-carbon/25";
  const size = { width: length, height: length };

  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden
        className={cn("absolute top-0 left-0 border-t border-l", edge)}
        style={size}
      />
      <span
        aria-hidden
        className={cn("absolute top-0 right-0 border-t border-r", edge)}
        style={size}
      />
      <span
        aria-hidden
        className={cn("absolute bottom-0 left-0 border-b border-l", edge)}
        style={size}
      />
      <span
        aria-hidden
        className={cn("absolute right-0 bottom-0 border-r border-b", edge)}
        style={size}
      />
      {children}
    </div>
  );
}
