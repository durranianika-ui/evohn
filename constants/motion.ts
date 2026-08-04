import type { Transition, Variants } from "framer-motion";

/**
 * The signature easing curve. Every transition on the site uses this or the
 * softer standard curve — a single motion language, applied consistently.
 */
export const EASE_BRAND = [0.62, 0.16, 0.13, 1.01] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.4,
  mid: 0.6,
  slow: 0.7,
  xslow: 1.2,
} as const;

export const transition = {
  fast: { duration: DURATION.fast, ease: EASE_BRAND },
  mid: { duration: DURATION.mid, ease: EASE_BRAND },
  slow: { duration: DURATION.slow, ease: EASE_BRAND },
  xslow: { duration: DURATION.xslow, ease: EASE_BRAND },
} satisfies Record<string, Transition>;

/** Distance elements travel on a rise-in. Small — the brand is restrained. */
export const RISE = 28;

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: { opacity: 1, y: 0 },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Masked line reveal — kept for the surfaces that still want a curtain. */
export const maskVariants: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/**
 * Headline reveal, measured off the reference: every character starts 8px low
 * and transparent and settles individually, a few milliseconds apart. Ours
 * used to lift a whole word out of a clipping box by 110% of its own height —
 * 69px at display size — which is a far heavier gesture than anything the
 * reference makes.
 */
export const CHAR_RISE = 8;
export const CHAR_STAGGER = 0.015;

/** Shared viewport config: fire once, slightly before the element is centred. */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
