import type { Variants } from "framer-motion";

/**
 * The site's shared motion language. Defined once so every transition moves
 * on the same curve instead of each component inventing its own — and so
 * every enter has a matching exit.
 */

/** Gentle deceleration — the default for content arriving. */
export const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
/** Symmetric and slightly sharper — for things that both enter and leave. */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0.05, 0.36, 1];

export const DURATION = {
  fast: 0.35,
  base: 0.55,
  slow: 0.8,
} as const;

/**
 * Opacity paired with a small rise — never a flat opacity fade. Used for most
 * blocks that mount and unmount.
 */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

/** Opacity paired with a slight scale — for overlays and focal moments. */
export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

/**
 * Parent variants that stagger their children rather than fading a whole
 * group in as one block. Children should use `fadeRise`/`fadeScale`.
 */
export const staggerGroup = (stagger = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
  exit: {
    transition: { staggerChildren: stagger / 2, staggerDirection: -1 },
  },
});

/** Reduced-motion swap: keep a short opacity-only cross-fade, drop the movement. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** Pick the right variant set for the user's motion preference. */
export const motionVariants = (prefersReduced: boolean, variants: Variants): Variants =>
  prefersReduced ? reducedFade : variants;
