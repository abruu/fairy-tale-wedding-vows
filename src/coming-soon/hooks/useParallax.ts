import { useEffect, type RefObject } from "react";

/**
 * Writes normalised pointer position (-0.5 … 0.5) onto the given element as
 * `--mx` / `--my`. Background layers multiply those by their own `--depth`, so
 * a single rAF-throttled listener drives the whole multi-layer parallax.
 *
 * Pointer-driven on fine-pointer devices only. Touch devices and reduced-motion
 * visitors get the CSS auto-drift instead (see `.cs-layer--auto`), so nothing
 * here runs continuously on a phone.
 */
export const useParallax = (
  ref: RefObject<HTMLElement>,
  enabled: boolean,
): void => {
  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX / window.innerWidth - 0.5;
      y = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [ref, enabled]);
};

export default useParallax;
