import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts a Lenis smooth-scroll instance synced to GSAP's ticker/ScrollTrigger
 * for the lifetime of the calling component. Scoped to /main only — never
 * touches the coming-soon page's native scroll. No-ops under reduced motion.
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
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.normalizeScroll(true);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  return lenisRef;
}
