"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export interface TrackItem {
  slug: string;
  name: string;
  summary: string;
  image: string;
  /** Domain line shown above the name. */
  category: string;
  /** Where "View Product" goes — not always a product page. */
  href: string;
}

/**
 * The pinned horizontal collection.
 *
 * Measured off the reference: the section occupies four-plus viewport heights
 * with a `sticky top-0 h-dvh` stage inside it; scrolling walks the track
 * sideways. The active card is 42vw against 15vw for its neighbours.
 *
 * ## Continuous, not stepped
 *
 * The rail's translation is a CONTINUOUS function of scroll progress passed
 * through a spring — the track is always moving while the page moves, with
 * momentum that settles when the scroll rests, which is the reference's
 * fluidity. The earlier build stepped the offset per card index through a
 * 700ms transition, and every threshold crossing read as a lurch. Only the
 * card widths remain discrete (the active card opens, neighbours close),
 * riding their own 700ms ease over the gliding rail.
 *
 * Slot geometry lives in CSS custom properties per breakpoint; they are read
 * back and converted to pixels so the offset can be computed continuously.
 * A shallow velocity lean (±2deg) keeps the shuffle energy.
 *
 * Under reduced motion the pin is dropped: natural height, scroll-snap rail.
 */
export function CollectionTrack({ items }: { items: TrackItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const last = Math.max(items.length - 1, 1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Hold the first and last card still briefly at either end. */
  const progress = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], {
    clamp: true,
  });

  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.round(p * last);
    setActive((current) => (current === next ? current : next));
  });

  /* Slot geometry in pixels, read back from the rail's CSS custom
     properties so the continuous offset and the class-driven widths can
     never disagree. Re-read on resize (which also covers breakpoint
     changes — the vars themselves are vw-based). */
  const [slots, setSlots] = useState({ active: 0, idle: 0, gap: 0, vw: 0 });
  useEffect(() => {
    if (reduced) return;
    const read = () => {
      const el = railRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const vwPx = window.innerWidth / 100;
      const toPx = (name: string) => parseFloat(cs.getPropertyValue(name)) * vwPx;
      setSlots({
        active: toPx("--slot-active"),
        idle: toPx("--slot-idle"),
        gap: toPx("--slot-gap"),
        vw: window.innerWidth,
      });
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [reduced]);

  /* The continuous offset: centre the (fractional) position. Springed so
     the rail carries momentum and settles without a snap. */
  const xTarget = useTransform(progress, (p) => {
    if (!slots.vw) return 0;
    return slots.vw / 2 - p * last * (slots.idle + slots.gap) - slots.active / 2;
  });
  const x = useSpring(xTarget, { stiffness: 100, damping: 28, mass: 0.6 });

  /* First measurement arrives after mount; jump the spring there rather
     than animating in from 0. */
  const measuredOnce = useRef(false);
  useEffect(() => {
    if (slots.vw && !measuredOnce.current) {
      measuredOnce.current = true;
      x.jump(xTarget.get());
    }
  }, [slots, x, xTarget]);

  /* The lean: scroll velocity, softened, becomes a shallow skew that always
     settles back to rest. */
  const velocity = useVelocity(scrollYProgress);
  const lean = useSpring(useTransform(velocity, [-0.8, 0.8], [2, -2]), {
    stiffness: 180,
    damping: 30,
    mass: 0.6,
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
    <div ref={sectionRef} className={cn("relative", !reduced && "h-[430vh]")}>
      <div
        className={cn(
          !reduced && "sticky top-0 flex h-dvh flex-col justify-center overflow-hidden",
        )}
      >
        {/* Travel bar — fills as the section is walked. */}
        {!reduced ? (
          <motion.div
            aria-hidden
            className="absolute left-0 top-0 z-20 h-[3px] w-full origin-left bg-[var(--color-cat-growth)]"
            style={{ scaleX: scrollYProgress }}
          />
        ) : null}

        <motion.div
          style={reduced ? undefined : { skewY: lean }}
          className={cn(!reduced && "will-change-transform")}
        >
          <motion.div
            ref={railRef}
            data-rail
            data-collection-rail
            role="group"
            aria-roledescription="carousel"
            aria-label="The collection"
            tabIndex={0}
            onKeyDown={onKeyDown}
            style={reduced ? undefined : { x }}
            className={cn(
              SLOTS,
              "flex items-center gap-[var(--slot-gap)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft",
              reduced
                ? "snap-x snap-mandatory overflow-x-auto px-[max(1rem,calc((100vw-var(--slot-active))/2))] pb-8 [--slot-idle:var(--slot-active)]"
                : "will-change-transform",
            )}
          >
            {cards}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Slot geometry — the reference's own 42vw / 15vw pair at xl; the narrower
 * stops keep the open card readable on a phone.
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
  open: boolean;
}) {
  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${item.name}`}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative shrink-0 transition-[width,opacity] duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none",
        open
          ? "w-[var(--slot-active)] opacity-100"
          : "w-[var(--slot-idle)] opacity-55",
      )}
    >
      {/* The reference's plate: a 20px-rounded card with its own ground. */}
      <div className="flex flex-col overflow-hidden rounded-[20px] bg-onyx p-5 shadow-[0_4px_16px_rgba(0,0,0,0.25)] md:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <p className="type-label truncate text-soft/50">{item.category}</p>
          <span className="type-label shrink-0 tabular-nums text-soft/40">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <p className="type-title-s mt-2 truncate uppercase text-soft">
          {item.name}
        </p>

        {/* The photograph sits WHOLE on a light plate — `object-contain`, so
            caps and bases are never cropped and no dark edge of the source
            framing swallows the vial. The plate is the catalogue's own warm
            radial ground, and there is deliberately NO overlay above the
            image: the bottle keeps its brightness. Landscape frame when
            open, portrait when closed. */}
        <div
          className={cn(
            "group/img relative mt-5 w-full overflow-hidden rounded-[12px]",
            "bg-[radial-gradient(120%_90%_at_50%_18%,var(--color-mist)_0%,var(--color-warm)_58%,#b3aca4_100%)]",
            "transition-[aspect-ratio] duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none",
            open ? "aspect-[4/3]" : "aspect-[3/4]",
          )}
        >
          <Image
            src={item.image}
            alt={`EVOHN ${item.name} vial`}
            fill
            sizes="(min-width: 1280px) 42vw, (min-width: 768px) 52vw, 80vw"
            loading={index < 2 ? "eager" : "lazy"}
            priority={false}
            className={cn(
              "object-contain transition-transform duration-[1.2s] ease-[var(--ease-brand)]",
              "group-hover/img:scale-[1.04] motion-reduce:transition-none",
            )}
          />
        </div>

        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none",
            open ? "mt-5 max-h-56 opacity-100" : "mt-0 max-h-0 opacity-0",
          )}
        >
          <p className="type-mono line-clamp-3 text-soft/55">{item.summary}</p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              href={item.href}
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
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-cat-growth)] opacity-70"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
