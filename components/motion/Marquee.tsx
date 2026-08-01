"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  /** Times the phrase is repeated inside one half of the track. */
  repeat?: number;
  className?: string;
  /** Seconds for one full pass. */
  speed?: number;
}

/**
 * Infinite horizontal band. The track holds two identical halves and
 * translates by exactly -50%, so the loop is seamless at any width.
 *
 * The phrase is announced once to assistive technology, not `repeat` times.
 */
export function Marquee({ text, repeat = 6, className, speed = 46 }: MarqueeProps) {
  // One half of the track. Built as an element rather than a nested
  // component so it is not redefined on every render.
  const half = (
    <span className="flex shrink-0" aria-hidden>
      {Array.from({ length: repeat }, (_, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="px-[0.4em]">{text}</span>
          <span
            className="h-[0.32em] w-[0.32em] shrink-0 rounded-full bg-current opacity-40"
            aria-hidden
          />
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      role="marquee"
      aria-label={text}
    >
      <div
        className="flex w-max animate-[marquee_var(--marquee-speed)_linear_infinite] motion-reduce:animate-none"
        style={{ ["--marquee-speed" as string]: `${speed}s` }}
      >
        {half}
        {half}
      </div>
    </div>
  );
}
