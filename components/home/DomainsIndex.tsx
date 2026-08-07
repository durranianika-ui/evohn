"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Category } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * The interactive domain index, matched to the reference's live DOM.
 *
 * Mechanics reproduced from measurement:
 *
 * - A single centred column of oversized names (clamp(2.25rem, 7vw, 6rem),
 *   0.95 leading), every row a CSS grid whose second track animates
 *   `grid-template-rows` 0fr -> 1fr over 500ms, so the description and
 *   "View Products →" unfold inside the flow and neighbours slide apart
 *   rather than jumping.
 * - Each name is doubled: the resting copy rolls up and out and an identical
 *   copy rolls in as the row activates — the reference's rolling swap — while
 *   letter-spacing eases from the display's -0.03em to +0.04em.
 * - One floating frame of four corner ticks glides to the active row,
 *   animating left/top/width/height on the same 500ms curve. It is measured
 *   from the DOM after the row's own unfold begins, so it lands on the
 *   expanded geometry.
 * - A sticky, full-viewport gradient mask (dark -> clear -> dark) rides the
 *   whole section on desktop, keeping neighbouring names half-dissolved above
 *   and below the focus — the "one continuous system" read.
 * - Desktop activation is scroll-driven: the row nearest the viewport's
 *   centre focuses itself, which is why the pointer cursor is reserved for
 *   the link. Click and keyboard focus activate a row directly on every
 *   device.
 */
export function DomainsIndex({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [frame, setFrame] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  /* Scroll-driven focus: the row whose centre is nearest the viewport
     centre wins. Cheap — one pass over eight rects, only while scrolling. */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const mid = window.innerHeight / 2;
        let best = -1;
        let bestDist = Infinity;
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const r = row.getBoundingClientRect();
          /* Ignore rows entirely off screen. */
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const d = Math.abs((r.top + r.bottom) / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best >= 0) setActive((a) => (a === best ? a : best));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The floating corner frame follows the active row. Measured against the
     list, twice: once as the unfold starts and once as it lands, so the
     ticks track the expanding geometry instead of freezing mid-flight. */
  const measure = useCallback(() => {
    const list = listRef.current;
    const row = rowRefs.current[active];
    if (!list || !row) return;
    const listRect = list.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    const inset = Math.min(40, rect.width * 0.04);
    setFrame({
      left: rect.left - listRect.left + inset,
      top: rect.top - listRect.top + 12,
      width: rect.width - inset * 2,
      height: rect.height - 24,
    });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const t1 = setTimeout(measure, 260);
    const t2 = setTimeout(measure, 560);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div className="relative">
      {/* The cinematic mask: dark at the fold edges, clear through the
          middle, pinned for the whole travel of the section.

          The sticky element lives inside an absolute wrapper spanning
          exactly this section, so its containment is the section itself.
          (An earlier build used a flow sticky with a -100dvh margin; sticky
          containment tracks the MARGIN box, so the zero-height margin box
          let the mask slide a full viewport past the section and lay its
          dark fade over the collection that follows.) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
      >
        <div
          className="sticky top-0 h-dvh w-full"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--color-onyx) 0%, transparent 28%, transparent 72%, var(--color-onyx) 100%)",
          }}
        />
      </div>

      <div className="container-home relative">
        <ul
          ref={listRef}
          className="relative isolate flex flex-col items-center py-[16vh] text-center"
        >
          {categories.map((category, i) => {
            const isActive = active === i;
            return (
              <li
                key={category.slug}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={cn(
                  "grid w-full px-4 text-center transition-[grid-template-rows,padding] duration-500 ease-[var(--ease-brand)] md:px-10",
                  isActive
                    ? "grid-rows-[auto_1fr] py-[clamp(2rem,6vh,3.75rem)]"
                    : "grid-rows-[auto_0fr] py-[clamp(0.4rem,1.2vh,0.75rem)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={isActive}
                  className="relative isolate w-full cursor-pointer overflow-hidden border-none bg-transparent p-0 md:cursor-default"
                >
                  {/* The rolling swap: resting copy out through the top,
                      active copy in from below. */}
                  <span
                    aria-hidden
                    className={cn(
                      "type-domain block transition-[transform,letter-spacing,opacity] duration-500 ease-[var(--ease-brand)]",
                      isActive
                        ? "-translate-y-full tracking-[0.04em] opacity-0"
                        : "translate-y-0 opacity-100",
                      "text-soft/35",
                    )}
                  >
                    {category.name}
                  </span>
                  <span
                    className={cn(
                      "type-domain absolute inset-0 block transition-[transform,letter-spacing,opacity] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none",
                      isActive
                        ? "translate-y-0 tracking-[0.04em] text-soft opacity-100"
                        : "translate-y-full opacity-0",
                    )}
                  >
                    {category.name}
                  </span>
                </button>

                {/* Unfolding support block. min-h-0 lets the 0fr track
                    actually collapse. */}
                <div className="flex min-h-0 flex-col items-center justify-center overflow-hidden">
                  <p
                    className={cn(
                      "max-w-[460px] pt-3 text-center transition-[opacity,transform] delay-100 duration-500 ease-[var(--ease-brand)]",
                      "type-body-s text-stone",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                    )}
                  >
                    {category.description}
                  </p>
                  <Link
                    href={`/catalogue?domain=${category.slug}`}
                    tabIndex={isActive ? undefined : -1}
                    className={cn(
                      "group/vp type-label mt-4 inline-flex items-center gap-2 text-[var(--color-cat-growth)] transition-[opacity,color] delay-150 duration-400 hover:text-soft",
                      isActive ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                  >
                    View Products
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-500 ease-brand group-hover/vp:translate-x-1"
                    >
                      &#8594;
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}

          {/* The floating corner frame. */}
          {frame ? (
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 hidden transition-[left,top,width,height] duration-500 ease-[var(--ease-brand)] md:block"
              style={{
                left: frame.left,
                top: frame.top,
                width: frame.width,
                height: frame.height,
              }}
            >
              {(["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
                (pos) => (
                  <span
                    key={pos}
                    className={cn("absolute h-5 w-5 border-soft/40", pos)}
                  />
                ),
              )}
            </div>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
