import { cn } from "@/lib/utils";

/**
 * Verification mark.
 *
 * Set only where the issuing laboratory has confirmed the record against its
 * own accession number. It is a statement about provenance, not a quality
 * grade — an unverified batch is not a failed one, it is one whose paperwork
 * has not yet been round-tripped.
 */
export function VerifiedBadge({
  verified,
  tone = "light",
  label = "Verified",
  className,
}: {
  verified: boolean;
  tone?: "light" | "dark";
  label?: string;
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <span
      className={cn(
        "type-label inline-flex shrink-0 items-center gap-2 border px-3 py-1.5",
        verified
          ? dark
            ? "border-soft/30 text-soft/80"
            : "border-carbon/25 text-carbon/80"
          : dark
            ? "border-soft/15 text-soft/45"
            : "border-carbon/12 text-carbon/45",
        className,
      )}
    >
      <span aria-hidden className="relative block size-3">
        <svg viewBox="0 0 12 12" className="size-3" fill="none">
          <circle
            cx="6"
            cy="6"
            r="5.25"
            stroke="currentColor"
            strokeOpacity={verified ? "0.55" : "0.3"}
            strokeWidth="1"
          />
          {verified ? (
            <path
              d="M3.6 6.2 5.2 7.8 8.5 4.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          ) : null}
        </svg>
      </span>
      {verified ? label : "Pending"}
    </span>
  );
}
