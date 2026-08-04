"use client";

/**
 * The three utility glyphs.
 *
 * Drawn here rather than pulled from an icon set so the stroke weight matches
 * the hairline the rest of the identity is built from — an imported icon at
 * 1.5px stroke reads as a different design language beside a 1px rule.
 */

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.15,
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <circle cx="8.75" cy="8.75" r="5.25" {...stroke} />
      <path d="M12.6 12.6L16.5 16.5" {...stroke} />
    </svg>
  );
}

/** A vial, not a shopping bag — the list holds compounds, not purchases. */
export function EnquiryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <path d="M7.5 2.5h5" {...stroke} />
      <path d="M8.25 2.5v3.6L5.9 15.1a1.7 1.7 0 0 0 1.65 2.15h4.9a1.7 1.7 0 0 0 1.65-2.15L11.75 6.1V2.5" {...stroke} />
      <path d="M6.55 12.4h6.9" {...stroke} />
    </svg>
  );
}

export function MenuIcon({
  className,
  open,
}: {
  className?: string;
  open?: boolean;
}) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <path
        d={open ? "M5 5l10 10" : "M3 7h14"}
        {...stroke}
        style={{ transition: "d 400ms cubic-bezier(0.62,0.16,0.13,1.01)" }}
      />
      <path
        d={open ? "M15 5L5 15" : "M3 13h14"}
        {...stroke}
        style={{ transition: "d 400ms cubic-bezier(0.62,0.16,0.13,1.01)" }}
      />
    </svg>
  );
}
