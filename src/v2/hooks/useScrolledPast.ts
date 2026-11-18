import { useEffect, useState } from "react";

/**
 * True once the page is scrolled past `threshold` px (a function is
 * re-evaluated on each check, e.g. `() => innerHeight * 0.85`).
 *
 * Only re-renders the caller when the answer flips — never per scroll
 * frame. Scroll-position state held high in the tree re-rendered the whole
 * page ~60×/s while scrolling, which was the main source of scroll lag.
 */
export function useScrolledPast(threshold: number | (() => number)): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const limit = typeof threshold === "function" ? threshold() : threshold;
      setPast(window.scrollY > limit); // same value → React bails out
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // A threshold function is expected to be stable in behaviour; re-binding
    // on every render would defeat the point of this hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return past;
}
