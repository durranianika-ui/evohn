"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero product film, presented the way the reference presents its own:
 * the element mounts at `scale(1.1)` and fully transparent, then settles to
 * rest over one second the moment the first frame is ready — a smooth
 * entrance rather than a hard cut to a playing video.
 *
 * Suppression rules are carried over from HeroVideo: no autoplaying film for
 * a visitor who asked for reduced motion, and none on a metered connection.
 * In both cases the poster stands in with the identical composition.
 *
 * The film is anchored to the TOP of its frame (`object-top`), not the
 * centre. This is a functional constraint, not a taste: the supplied footage
 * carries a mark in its upper-left corner that the hero CTA is positioned to
 * conceal, and top-anchoring means any cropping the responsive frame does is
 * taken from the bottom of the frame only — so the mark's position against
 * the frame is a pure function of viewport width, which is what the CTA's
 * vw-based geometry is sized against.
 */
export function HeroFilm({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    const cheap =
      connection?.saveData === true ||
      (connection?.effectiveType !== undefined &&
        /^(slow-)?2g$/.test(connection.effectiveType));

    const evaluate = () => setPlay(!calm.matches && !cheap);
    evaluate();

    calm.addEventListener("change", evaluate);
    return () => calm.removeEventListener("change", evaluate);
  }, []);

  useEffect(() => {
    if (!play) return;
    const started = ref.current?.play();
    void started?.catch(() => {});
  }, [play]);

  const frame = cn(
    "absolute inset-0 h-full w-full object-cover object-top",
    "transition-[opacity,transform] duration-1000 ease-[var(--ease-brand)]",
    "motion-reduce:transition-none",
    ready ? "scale-100 opacity-100" : "scale-110 opacity-0",
    className,
  );

  if (!play) {
    return poster ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden
        className={cn(frame, "scale-100 opacity-100")}
      />
    ) : null;
  }

  return (
    <video
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={poster}
      onCanPlay={() => setReady(true)}
      onLoadedData={() => setReady(true)}
      className={frame}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
