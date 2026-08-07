"use client";

import { useState } from "react";
import { pillars } from "@/data/standards";
import { cn } from "@/lib/utils";

/**
 * The four-standard interactive row, matched to the reference's live DOM.
 *
 * Measured mechanics, reproduced one for one:
 *
 * - One flex row, `gap-0`, 560px tall from `md` up; every card `flex: 1` at
 *   rest and the active card `flex: 2.5`, so neighbours shrink as one card
 *   grows and the widths interpolate fluidly rather than snapping.
 * - Every geometric property rides `all 700ms cubic-bezier(0.16, 1, 0.3, 1)`
 *   — the reference's exact curve for this row, distinct from the site-wide
 *   brand curve.
 * - Only the row's outer corners are rounded (20px); interior seams are
 *   square, so the four cards read as one rounded object.
 * - Card grounds are translucent over the section's grain with
 *   `backdrop-blur`, alternating deep / sand / deep / light, and the active
 *   card carries the deeper shadow.
 * - Centre of each card is an abstract dotted SVG — grid, wave, burst,
 *   halftone — not an icon. The field drifts gently, and leans with the
 *   pointer on the active card.
 *
 * Pointer hover opens a card (the reference's desktop behaviour); click and
 * keyboard focus do the same, which is also what makes the row operable on
 * touch, where the stacked layout expands the active card's height instead
 * of its width.
 */
const EASE_CARDS = "cubic-bezier(0.16,1,0.3,1)";

const GROUNDS = [
  {
    text: "text-soft",
    card: "bg-[rgba(17,17,16,0.88)] text-soft",
    body: "text-soft/60",
    index: "text-soft/50",
    dot: "#f5f4f0",
    radius: "md:rounded-l-[20px] rounded-t-[20px] md:rounded-tr-none",
  },
  {
    text: "text-carbon",
    card: "bg-[rgba(214,200,180,0.92)] text-carbon",
    body: "text-carbon/65",
    index: "text-carbon/55",
    dot: "#111110",
    radius: "",
  },
  {
    text: "text-soft",
    card: "bg-[rgba(21,20,19,0.85)] text-soft",
    body: "text-soft/60",
    index: "text-soft/50",
    dot: "#f5f4f0",
    radius: "",
  },
  {
    text: "text-carbon",
    card: "bg-[rgba(237,234,227,0.92)] text-carbon",
    body: "text-carbon/65",
    index: "text-carbon/55",
    dot: "#111110",
    radius: "md:rounded-r-[20px] rounded-b-[20px] md:rounded-bl-none",
  },
] as const;

export function StandardsCards() {
  const [active, setActive] = useState(0);

  return (
    <div
      className="mt-16 flex flex-col md:mt-24 md:h-[560px] md:flex-row"
      role="list"
    >
      {pillars.map((pillar, i) => {
        const ground = GROUNDS[i] ?? GROUNDS[0];
        const isActive = active === i;

        return (
          <div
            key={pillar.title}
            role="listitem"
            className={cn(
              "relative min-h-[220px] cursor-pointer overflow-hidden md:min-h-0",
              ground.radius,
            )}
            style={{
              flex: isActive ? "2.5 1 0%" : "1 1 0%",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: isActive
                ? "0 8px 40px rgba(0,0,0,0.25), 0 2px 12px rgba(0,0,0,0.15)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: `all 700ms ${EASE_CARDS}`,
            }}
            onMouseEnter={() => setActive(i)}
          >
            {/* The ground is a separate layer so the blur has something to
                blur without tinting the content. */}
            <div aria-hidden className={cn("absolute inset-0", ground.card, ground.radius)} />

            <button
              type="button"
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-expanded={isActive}
              className={cn(
                "relative z-[1] flex h-full w-full flex-col p-6 text-left md:p-8",
                ground.text,
              )}
            >
              <h3 className="type-title-s whitespace-pre-line uppercase leading-tight tracking-tight">
                {pillar.title}
              </h3>

              {/* Dotted field — hidden on the collapsed mobile card so the
                  stack stays scannable. */}
              <div
                className={cn(
                  "flex flex-1 items-center justify-center py-6 transition-opacity duration-700",
                  isActive ? "opacity-100" : "opacity-60 max-md:opacity-0 max-md:hidden md:flex",
                )}
              >
                <DotGraphic
                  variant={i}
                  color={ground.dot}
                  active={isActive}
                />
              </div>

              <div className="mt-auto">
                <span className={cn("type-label tabular-nums", ground.index)}>
                  {String(i + 1).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                </span>
                <p
                  className={cn(
                    "type-mono mt-3 max-w-[34ch] transition-[opacity,max-height] duration-700",
                    ground.body,
                    /* Inactive bodies only exist where they have room: a
                       tablet's 1-of-4 slot is ~130px, which set the copy as
                       a one-word-per-line column. */
                    isActive
                      ? "max-h-40 opacity-100"
                      : "max-h-40 opacity-70 max-lg:max-h-0 max-lg:overflow-hidden max-lg:opacity-0",
                  )}
                >
                  {pillar.body}
                </p>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The dotted graphics.

   Four distinct fields on a 200x280 plate, all drawn from circles of the
   reference's own radius (2.2) so the row reads as one family:

     0  grid      — even lattice, the "measured" motif
     1  wave      — columns displaced by a sine, cold-chain's flow
     2  burst     — radial spokes around a ring, third-party's seal
     3  halftone  — density falling off along the diagonal, GMP's gradient

   The drift animation is a whole-group transform (compositor-only), gentle
   enough to read as breathing rather than movement.
   ------------------------------------------------------------------------- */

function DotGraphic({
  variant,
  color,
  active,
}: {
  variant: number;
  color: string;
  active: boolean;
}) {
  const dots: { cx: number; cy: number; r: number; o: number }[] = [];

  if (variant === 1) {
    /* Wave — 12 columns x 14 rows, each column displaced by a sine. */
    for (let c = 0; c < 12; c++) {
      for (let r = 0; r < 14; r++) {
        const phase = (c / 12) * Math.PI * 2;
        dots.push({
          cx: 24 + c * 14,
          cy: 30 + r * 16 + Math.sin(phase + r * 0.55) * 7,
          r: 2.2,
          o: 0.35 + 0.5 * Math.abs(Math.sin(phase + r * 0.55)),
        });
      }
    }
  } else if (variant === 2) {
    /* Burst — rings of spokes around a hollow centre. */
    for (let ring = 1; ring <= 7; ring++) {
      const n = 8 + ring * 4;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        dots.push({
          cx: 100 + Math.cos(a) * ring * 12.5,
          cy: 140 + Math.sin(a) * ring * 12.5,
          r: 2.2 - ring * 0.12,
          o: 1 - ring * 0.11,
        });
      }
    }
  } else if (variant === 3) {
    /* Halftone — density and size falling off along the diagonal. */
    for (let c = 0; c < 12; c++) {
      for (let r = 0; r < 16; r++) {
        const t = (c / 12 + r / 16) / 2;
        if ((c * 7 + r * 5) % 9 < t * 9) continue;
        dots.push({
          cx: 24 + c * 14,
          cy: 24 + r * 15,
          r: 2.2 * (1 - t * 0.65),
          o: 0.9 - t * 0.65,
        });
      }
    }
  } else {
    /* Grid — the reference's even lattice: 14px pitch, r 2.2. */
    for (let c = 0; c < 13; c++) {
      for (let r = 0; r < 16; r++) {
        const edge =
          Math.min(c, 12 - c) < 2 || Math.min(r, 15 - r) < 2 ? 0.35 : 0.8;
        dots.push({ cx: 18 + c * 14, cy: 22 + r * 15, r: 2.2, o: edge });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 200 280"
      aria-hidden
      className={cn(
        "h-full max-h-[280px] w-auto max-w-full cursor-crosshair transition-transform duration-700",
        active ? "scale-100" : "scale-90",
      )}
      style={{
        animation: "drift 9s var(--ease-soft) infinite",
        animationDelay: `${variant * 1.4}s`,
      }}
    >
      {dots.map((d, i) => (
        /* Values are rounded to fixed precision so the server and client
           serialise identically — raw doubles hydrate as a mismatch. */
        <circle
          key={i}
          cx={d.cx.toFixed(2)}
          cy={d.cy.toFixed(2)}
          r={Math.max(d.r, 0.6).toFixed(2)}
          fill={color}
          opacity={Math.min(Math.max(d.o, 0), 1).toFixed(3)}
        />
      ))}
    </svg>
  );
}
