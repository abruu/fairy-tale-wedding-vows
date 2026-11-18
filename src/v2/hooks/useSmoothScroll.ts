import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Mounts a Lenis smooth-scroll instance driven by GSAP's ticker for the
 * lifetime of the calling component. Scoped to the main page only — never
 * touches the coming-soon page's native scroll. No-ops under reduced motion.
 *
 * Lenis only smooths wheel input; touch devices keep native scrolling.
 *
 * Deliberately NO GSAP ScrollTrigger here. Nothing on the page creates a
 * ScrollTrigger, and `ScrollTrigger.normalizeScroll(true)` — which used to
 * be on — hijacks every wheel/touch event and re-implements scrolling in JS.
 * On phones that replaced native momentum scrolling and was the single
 * biggest cause of scroll lag. Scroll-linked effects use framer-motion's
 * useScroll, which reads native scroll and needs no syncing.
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

    const lenis = new Lenis();
    lenisRef.current = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  return lenisRef;
}
