/**
 * Subtle scientific field artwork for panel cards — the reference's
 * treatment: low-contrast dotted and linear structures embedded in the card
 * itself, moving with it, never competing with the copy.
 *
 * Pure SVG in `currentColor`, so each card's own text colour sets the ink
 * and the parent's opacity sets the volume. Values are rounded to fixed
 * precision so server and client serialise identically (raw doubles hydrate
 * as a mismatch).
 *
 * Variants:
 *   dots   — an analytical lattice thinning toward one corner
 *   wave   — a waveform of dotted columns, data in motion
 *   rings  — concentric molecular rings around a hollow centre
 *   grid   — a fine ruled structure with node points
 */
export type SciencePatternVariant = "dots" | "wave" | "rings" | "grid";

export function SciencePattern({
  variant,
  className,
}: {
  variant: SciencePatternVariant;
  className?: string;
}) {
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number; o: number }[] = [];

  if (variant === "wave") {
    for (let c = 0; c < 16; c++) {
      for (let r = 0; r < 10; r++) {
        const phase = (c / 16) * Math.PI * 2;
        dots.push({
          x: 16 + c * 18,
          y: 40 + r * 22 + Math.sin(phase + r * 0.5) * 9,
          r: 2,
          o: 0.3 + 0.5 * Math.abs(Math.sin(phase + r * 0.5)),
        });
      }
    }
  } else if (variant === "rings") {
    for (let ring = 1; ring <= 6; ring++) {
      const n = 10 + ring * 5;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        dots.push({
          x: 150 + Math.cos(a) * ring * 20,
          y: 140 + Math.sin(a) * ring * 20,
          r: 2 - ring * 0.16,
          o: 1 - ring * 0.13,
        });
      }
    }
  } else if (variant === "grid") {
    for (let c = 0; c <= 7; c++) {
      lines.push({ x1: 20 + c * 38, y1: 20, x2: 20 + c * 38, y2: 260, o: 0.3 });
    }
    for (let r = 0; r <= 6; r++) {
      lines.push({ x1: 20, y1: 20 + r * 40, x2: 286, y2: 20 + r * 40, o: 0.3 });
    }
    for (let c = 0; c <= 7; c++) {
      for (let r = 0; r <= 6; r++) {
        if ((c * 5 + r * 3) % 7 > 3) continue;
        dots.push({ x: 20 + c * 38, y: 20 + r * 40, r: 2.4, o: 0.75 });
      }
    }
  } else {
    for (let c = 0; c < 14; c++) {
      for (let r = 0; r < 12; r++) {
        const t = (c / 14 + r / 12) / 2;
        if ((c * 7 + r * 5) % 9 < t * 8) continue;
        dots.push({
          x: 20 + c * 20,
          y: 24 + r * 21,
          r: 2.2 * (1 - t * 0.55),
          o: 0.85 - t * 0.55,
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 300 280"
      aria-hidden
      className={className}
      fill="none"
    >
      {lines.map((l, i) => (
        <line
          key={`l${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          strokeWidth="0.75"
          opacity={l.o.toFixed(3)}
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={`d${i}`}
          cx={d.x.toFixed(2)}
          cy={d.y.toFixed(2)}
          r={Math.max(d.r, 0.5).toFixed(2)}
          fill="currentColor"
          opacity={Math.min(Math.max(d.o, 0), 1).toFixed(3)}
        />
      ))}
    </svg>
  );
}
