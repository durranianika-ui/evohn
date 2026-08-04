"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { cn } from "@/lib/utils";

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
 * The slot width is a CSS variable rather than a JS measurement so the track
 * reflows on resize without a re-render, and the transform is a `calc()`
 * driven by one motion value — no per-frame React state. The only state that
 * changes during a scroll is the active index, and only when it actually
 * crosses to a new card.
 *
 * Under reduced motion the pin is dropped entirely: the section collapses to
 * its natural height and the track becomes an ordinary scroll-snap rail that
 * works with a trackpad, a touch drag or the keyboard.
 */
export function CollectionTrack({ items }: { items: TrackItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
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

  const x = useMotionTemplate`calc(${progress} * -${last} * (var(--slot) + var(--slot-gap)))`;

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
    <Card key={item.slug} item={item} index={i} total={items.length} active={active === i} />
  ));

  if (reduced) {
    return (
      <div ref={sectionRef} className="relative">
        <div
          data-rail
          data-collection-rail
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured compounds"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory gap-[var(--slot-gap)] overflow-x-auto px-[max(1rem,calc((100vw-var(--slot))/2))] pb-8 [--slot-gap:3vw] [--slot:80vw] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft md:[--slot:52vw] xl:[--slot:44vw]"
        >
          {cards}
        </div>
      </div>
    );
  }

  return (
    /* 370vh, not 400: the reference's block measures 4.00vh in total, and the
       heading above this track accounts for roughly 0.3vh of that. Giving the
       track the full four viewports pushed the block to 4.31vh at every width.
       The pin itself is unaffected — only the scroll duration feeding it. */
    <div ref={sectionRef} className="relative h-[370vh]">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <motion.div
          data-rail
          data-collection-rail
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured compounds"
          tabIndex={0}
          onKeyDown={onKeyDown}
          style={{ x }}
          className="flex gap-[var(--slot-gap)] pl-[calc((100vw-var(--slot))/2)] will-change-transform [--slot-gap:3vw] [--slot:80vw] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft md:[--slot:52vw] xl:[--slot:44vw]"
        >
          {cards}
        </motion.div>
      </div>
    </div>
  );
}

function Card({
  item,
  index,
  total,
  active,
}: {
  item: TrackItem;
  index: number;
  total: number;
  active: boolean;
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
      className={cn(
        "relative w-[var(--slot)] shrink-0 transition-[opacity,transform] duration-700 ease-[var(--ease-brand)]",
        active ? "scale-100 opacity-100" : "scale-[0.92] opacity-45",
      )}
    >
      <CornerFrame className="p-5 md:p-7">
        <p className="type-label text-soft">{item.name}</p>

        <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden bg-onyx">
          <Image
            src={item.image}
            alt={`EVOHN ${item.name} vial`}
            fill
            sizes="(min-width: 1280px) 44vw, (min-width: 768px) 52vw, 80vw"
            /* Only the opening pair is worth fetching eagerly; the rest are
               several viewports of scrolling away. */
            loading={index < 2 ? "eager" : "lazy"}
            priority={false}
            className="object-cover"
          />
        </div>

        <p className="type-mono mt-5 line-clamp-3 text-soft/55">{item.summary}</p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            href={`/products/${item.slug}`}
            className="type-label text-soft underline-offset-8 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft"
          >
            View Product
          </Link>
          <span className="type-label tabular-nums text-soft/60">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </CornerFrame>
    </article>
  );
}
