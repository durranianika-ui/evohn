"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export interface TrackItem {
  slug: string;
  name: string;
  summary: string;
  image: string;
}

/**
 * The pinned horizontal collection.
 *
 * Measured off the reference: the section occupies exactly four viewport
 * heights at every audit width — 4320px at 1080, 3600px at 900, 3200px at
 * 800, and the same ratio down to 360x800 — with a `sticky top-0 h-dvh`
 * stage inside it. Scrolling those four viewports walks the track sideways;
 * the page itself never stops moving, which is why this uses scroll progress
 * rather than a wheel hijack.
 *
 * Cards are not a uniform width. Measured off the reference at 1440: the
 * active card is 605px and the ones either side are 216px — 42vw against
 * 15vw — and the inactive ones sit at 0.4 opacity with their supporting text
 * collapsed to nothing. Reaching a card *opens* it; leaving it closes it
 * again. That expansion, and the way the row reshuffles around it, is the
 * movement the whole section is built on.
 *
 * All of it is one discrete state — the active index — expressed as a CSS
 * variable. Widths, opacities and the track offset are then pure `calc()` on
 * that one number, each carrying the same 700ms brand-eased transition, so
 * the shuffle runs on the compositor with no per-frame React state and no
 * JS measurement to invalidate on resize. Every card before the active one is
 * idle width, which is what makes the offset a closed form rather than a sum.
 *
 * Under reduced motion the pin is dropped entirely: the section collapses to
 * its natural height and the track becomes an ordinary scroll-snap rail of
 * equal cards that works with a trackpad, a touch drag or the keyboard.
 */
export function CollectionTrack({ items }: { items: TrackItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const last = Math.max(items.length - 1, 1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Hold the first and last card still briefly at either end, so the track
     is not already sliding the instant the stage pins. */
  const progress = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], {
    clamp: true,
  });

  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.round(p * last);
    setActive((current) => (current === next ? current : next));
  });

  /** Move the window to the scroll offset that centres a given card. */
  const goTo = useCallback(
    (index: number) => {
      const el = sectionRef.current;
      if (!el) return;
      const clamped = Math.min(Math.max(index, 0), last);
      if (reduced) {
        const rail = el.querySelector<HTMLElement>("[data-rail]");
        const card = rail?.children[clamped] as HTMLElement | undefined;
        card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        setActive(clamped);
        return;
      }
      const { top, height } = el.getBoundingClientRect();
      const start = top + window.scrollY;
      const travel = height - window.innerHeight;
      /* Invert the 0.06-0.94 hold so the card lands centred. */
      const fraction = 0.06 + (clamped / last) * 0.88;
      window.scrollTo({ top: start + travel * fraction, behavior: "smooth" });
    },
    [last, reduced],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(active + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(last);
      }
    },
    [active, goTo, last],
  );

  const cards = items.map((item, i) => (
    <Card
      key={item.slug}
      item={item}
      index={i}
      total={items.length}
      active={active === i}
      open={reduced || active === i}
    />
  ));

  return (
    /* One tree for both modes, differing only in class and style.
       Two returns meant the pinned stage and the rail were different elements:
       React tore one down and built the other the moment the media query
       resolved, and anything already holding the rail — a test locator, a
       focused card, a scroll-into-view in flight — was left pointing at a
       detached node.

       370vh, not 400: the reference's block measures 4.00vh in total, and the
       heading above this track accounts for roughly 0.3vh of that. Giving the
       track the full four viewports pushed the block to 4.31vh at every width.
       The pin itself is unaffected — only the scroll duration feeding it. */
    <div ref={sectionRef} className={cn("relative", !reduced && "h-[370vh]")}>
      <div
        className={cn(
          !reduced && "sticky top-0 flex h-dvh flex-col justify-center overflow-hidden",
        )}
      >
        <div
          data-rail
          data-collection-rail
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured compounds"
          tabIndex={0}
          onKeyDown={onKeyDown}
          style={
            reduced
              ? undefined
              : ({
                  "--active": active,
                  /* Every card left of the active one is idle width, so
                     centring the active card is a closed form rather than a
                     running sum: half the viewport, less the idle cards
                     behind it, less half of the open card itself. Written
                     here rather than as an arbitrary utility because calc
                     needs real whitespace around its operators and this reads
                     as arithmetic. */
                  transform:
                    "translateX(calc(50vw - var(--active) * (var(--slot-idle) + var(--slot-gap)) - var(--slot-active) / 2))",
                } as React.CSSProperties)
          }
          className={cn(
            SLOTS,
            /* items-center, not the default stretch: a closed card should be
               its own height — the reference's are 342px against the open
               card's 612 — and stretching held every one of them at full
               height, which erased half the difference between open and
               closed. */
            "flex items-center gap-[var(--slot-gap)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft",
            reduced
              ? /* Equal cards on the rail: shrinking whatever is not centred
                   would be its own animation, which is the thing being opted
                   out of. */
                "snap-x snap-mandatory overflow-x-auto px-[max(1rem,calc((100vw-var(--slot-active))/2))] pb-8 [--slot-idle:var(--slot-active)]"
              : "will-change-transform transition-transform duration-700 ease-[var(--ease-brand)]",
          )}
        >
          {cards}
        </div>
      </div>
    </div>
  );
}

/**
 * Slot geometry. The xl pair is the reference's own — 42vw open, 15vw closed;
 * the narrower stops keep the open card readable on a phone, where 42vw would
 * be 164px.
 */
const SLOTS =
  "[--slot-gap:3vw] [--slot-active:80vw] [--slot-idle:32vw] md:[--slot-active:52vw] md:[--slot-idle:20vw] xl:[--slot-active:42vw] xl:[--slot-idle:15vw]";

function Card({
  item,
  index,
  total,
  active,
  open,
}: {
  item: TrackItem;
  index: number;
  total: number;
  active: boolean;
  /** Active, or forced open because the rail shows every card in full. */
  open: boolean;
}) {
  return (
    <article
      /* Explicit role="group": `aria-roledescription` is prohibited on roles
         that do not support it, and axe reads the implicit article role as
         one of them. Group carries the same grouping semantics and permits
         both the description and the label. */
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${item.name}`}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative shrink-0 transition-[width,opacity] duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none",
        open
          ? "w-[var(--slot-active)] opacity-100"
          : "w-[var(--slot-idle)] opacity-40",
      )}
    >
      <CornerFrame className="p-5 md:p-7">
        <p className="type-label truncate text-soft">{item.name}</p>

        {/* Landscape when open, portrait when closed. The reference's closed
            card is 216x342 — a vertical sliver — and holding a 4:3 crop there
            gave 216x214, which read as a shrunken copy of the open card
            rather than a different state of it. */}
        <div
          className={cn(
            "relative mt-5 w-full overflow-hidden bg-onyx transition-[aspect-ratio] duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none",
            open ? "aspect-[4/3]" : "aspect-[3/4]",
          )}
        >
          <Image
            src={item.image}
            alt={`EVOHN ${item.name} vial`}
            fill
            sizes="(min-width: 1280px) 42vw, (min-width: 768px) 52vw, 80vw"
            /* Only the opening pair is worth fetching eagerly; the rest are
               several viewports of scrolling away. */
            loading={index < 2 ? "eager" : "lazy"}
            priority={false}
            className="object-cover"
          />
        </div>

        {/* The supporting text belongs to the open card only. Collapsing it
            on max-height rather than unmounting it keeps the link in the tab
            order at its natural place — `inert` and `aria-hidden` would drop
            it out — and keeps the transition symmetrical in both directions.
            The closed height is 0 with the overflow clipped, so nothing of it
            shows on a 15vw card. */}
        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none",
            open ? "mt-5 max-h-52 opacity-100" : "mt-0 max-h-0 opacity-0",
          )}
        >
          <p className="type-mono line-clamp-3 text-soft/55">{item.summary}</p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              href={`/products/${item.slug}`}
              className="group/view type-label inline-flex items-center gap-3 text-soft underline-offset-8 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft"
              tabIndex={open ? undefined : -1}
            >
              View Product
              <span
                aria-hidden
                className="inline-block -translate-x-6 opacity-0 transition-[transform,opacity] duration-500 ease-[var(--ease-brand)] group-hover/view:translate-x-0 group-hover/view:opacity-100 motion-reduce:transition-none"
              >
                &rarr;
              </span>
            </Link>
            <span className="type-label tabular-nums text-soft/60">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </CornerFrame>
    </article>
  );
}
