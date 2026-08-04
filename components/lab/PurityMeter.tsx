import { purityValue } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Purity indicator.
 *
 * The scale deliberately starts at 98%, not zero. A bar running from zero
 * would render every credible result as a full bar and communicate nothing;
 * the meaningful question for research-grade material is where a batch sits
 * within the top two percent, and against the specification line at 99%.
 */
const FLOOR = 98;
const SPEC = 99;

export function PurityMeter({
  purity,
  tone = "light",
  className,
}: {
  purity: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const value = purityValue(purity);
  const dark = tone === "dark";

  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  const fill = clamp(((value - FLOOR) / (100 - FLOOR)) * 100);
  const spec = clamp(((SPEC - FLOOR) / (100 - FLOOR)) * 100);

  return (
    <div className={cn("w-full min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={cn(
            "type-label",
            dark ? "text-soft/55" : "text-carbon/62",
          )}
        >
          Assayed purity
        </span>
        <span
          className={cn(
            "type-title tabular-nums",
            dark ? "text-soft" : "text-carbon",
          )}
        >
          {purity}
        </span>
      </div>

      <div
        className={cn(
          "relative mt-4 h-1.5 w-full overflow-hidden",
          dark ? "bg-soft/12" : "bg-carbon/10",
        )}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={FLOOR}
        aria-valuemax={100}
        aria-label={`Assayed purity ${purity}, against a specification of at least ${SPEC} per cent`}
      >
        <span
          className={cn("absolute inset-y-0 left-0", dark ? "bg-soft" : "bg-carbon")}
          style={{ width: `${fill}%` }}
        />
        {/* Specification line at 99%. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 w-px",
            dark ? "bg-ink" : "bg-soft",
          )}
          style={{ left: `${spec}%` }}
        />
      </div>

      <div
        className={cn(
          "type-label mt-3 flex justify-between tabular-nums",
          dark ? "text-soft/40" : "text-carbon/40",
        )}
      >
        <span>{FLOOR}%</span>
        <span>Spec ≥ {SPEC}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
