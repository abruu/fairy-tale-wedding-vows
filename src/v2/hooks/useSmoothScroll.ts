import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Mounts a Lenis smooth-scroll instance for the lifetime of the calling
 * component. No-ops under reduced motion. Touch scrolling stays native
 * (Lenis' default), so mobile keeps its own momentum.
 *
 * Lenis drives the real window scroll position, so the passive `scroll`
 * listener in lib/parallax.ts keeps working unchanged underneath it.
 *
 * Returns a ref to the live Lenis instance (null when not mounted) so callers
 * can drive programmatic scrolling (nav clicks, back-to-top) through Lenis
 * instead of the native scrollIntoView/scrollTo — calling those directly
 * while Lenis owns the scroll loop fights it and the page won't land on
 * target.
 */
export function useSmoothScroll() {
  const prefersReduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({ autoRaf: true });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  return lenisRef;
}
