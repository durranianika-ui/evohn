import type { ChromatogramPeak } from "@/data/lab-results";
import { cn } from "@/lib/utils";

/**
 * Published chromatogram trace.
 *
 * The certificate PDF carries the instrument's own output; this is the
 * on-page rendering of the same peak table, drawn so the shape of the
 * separation is legible at a glance — principal peak, where the impurities
 * sit, and how well resolved they are from it.
 *
 * Peaks are reconstructed as Gaussians from retention time and relative
 * height. It is a faithful depiction of the reported peak table, not a
 * substitute for the raw data file.
 */

const W = 720;
const H = 220;
const PAD_X = 28;
const PAD_TOP = 26;
const BASE = H - 34;
/** Peak width in retention-time units. Narrow — these are sharp separations. */
const SIGMA = 0.22;
const SAMPLES = 480;

export function Chromatogram({
  peaks,
  className,
  tone = "light",
  /** Draw retention-time ticks and the axis label. */
  axis = true,
}: {
  peaks: ChromatogramPeak[];
  className?: string;
  tone?: "light" | "dark";
  axis?: boolean;
}) {
  if (peaks.length === 0) return null;

  const dark = tone === "dark";
  const ink = dark ? "#F6F5F2" : "#111111";
  const xMax = Math.max(...peaks.map((p) => p.rt)) * 1.18;
  const plotW = W - PAD_X * 2;
  const plotH = BASE - PAD_TOP;

  const toX = (rt: number) => PAD_X + (rt / xMax) * plotW;
  const toY = (h: number) => BASE - h * plotH;

  // Sum the Gaussians into a single continuous trace.
  const points: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const rt = (i / SAMPLES) * xMax;
    let h = 0;
    for (const peak of peaks) {
      const d = rt - peak.rt;
      h += peak.height * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
    }
    points.push(`${toX(rt).toFixed(2)},${toY(Math.min(h, 1)).toFixed(2)}`);
  }

  const line = `M ${points.join(" L ")}`;
  const area = `${line} L ${toX(xMax).toFixed(2)},${BASE} L ${PAD_X},${BASE} Z`;

  const ticks = Array.from({ length: 5 }, (_, i) =>
    Number(((xMax / 4) * i).toFixed(1)),
  );

  return (
    /* min-w-0: an SVG with a viewBox reports that viewBox width as its
       min-content size, which would widen the grid track holding it. */
    <figure className={cn("w-full min-w-0", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Chromatogram trace. Principal peak ${
          peaks.find((p) => p.label)?.label ?? ""
        } at ${peaks.find((p) => p.height === 1)?.rt ?? ""} minutes, with ${
          peaks.filter((p) => !p.label).length
        } minor peaks well separated from it.`}
      >
        <defs>
          <linearGradient id="chrom-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ink} stopOpacity={dark ? 0.22 : 0.14} />
            <stop offset="100%" stopColor={ink} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal guides at 25% intervals. */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={toY(f)}
            y2={toY(f)}
            stroke={ink}
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        ))}

        <path d={area} fill="url(#chrom-fill)" />
        <path
          d={line}
          fill="none"
          stroke={ink}
          strokeOpacity="0.85"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Baseline */}
        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={BASE}
          y2={BASE}
          stroke={ink}
          strokeOpacity="0.28"
          strokeWidth="1"
        />

        {/* Principal peak annotation */}
        {peaks
          .filter((p) => p.label)
          .map((p) => (
            <g key={p.label}>
              <line
                x1={toX(p.rt)}
                x2={toX(p.rt)}
                y1={toY(p.height) - 8}
                y2={PAD_TOP - 12}
                stroke={ink}
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text
                x={toX(p.rt)}
                y={PAD_TOP - 16}
                textAnchor="middle"
                fill={ink}
                fillOpacity="0.7"
                fontSize="11"
                fontFamily="var(--font-sans)"
                letterSpacing="1.4"
              >
                {p.label?.toUpperCase()}
              </text>
            </g>
          ))}

        {axis
          ? ticks.map((t) => (
              <g key={t}>
                <line
                  x1={toX(t)}
                  x2={toX(t)}
                  y1={BASE}
                  y2={BASE + 5}
                  stroke={ink}
                  strokeOpacity="0.28"
                  strokeWidth="1"
                />
                <text
                  x={toX(t)}
                  y={BASE + 20}
                  textAnchor="middle"
                  fill={ink}
                  fillOpacity="0.45"
                  fontSize="10"
                  fontFamily="var(--font-sans)"
                  letterSpacing="1"
                >
                  {t}
                </text>
              </g>
            ))
          : null}
      </svg>

      {axis ? (
        <figcaption
          className={cn(
            "type-label mt-4 flex flex-wrap items-center justify-between gap-3",
            dark ? "text-soft/45" : "text-carbon/45",
          )}
        >
          <span>Retention time (min)</span>
          <span>RP-HPLC · UV 214 nm</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
