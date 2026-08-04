import { cn } from "@/lib/utils";

/**
 * The panel dot graphic.
 *
 * Drawn as a CSS radial-gradient tile rather than an asset — it scales to any
 * panel width, costs no request, and inherits its colour from the ground it
 * sits on. Original work; the reference's own graphic is not used.
 */
export function DotField({
  className,
  tone = "light",
}: {
  className?: string;
  /** `light` for dots on a dark ground, `dark` for dots on a light one. */
  tone?: "light" | "dark";
}) {
  const dot =
    tone === "light" ? "rgba(245,244,240,0.34)" : "rgba(17,17,17,0.26)";

  return (
    <div
      aria-hidden
      className={cn("h-20 w-full", className)}
      style={{
        backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
        backgroundSize: "9px 9px",
        /* Fades the field out toward its edges so it reads as texture rather
           than a bounded rectangle sitting inside the panel. */
        maskImage:
          "radial-gradient(72% 100% at 50% 50%, #000 25%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(72% 100% at 50% 50%, #000 25%, transparent 100%)",
      }}
    />
  );
}
