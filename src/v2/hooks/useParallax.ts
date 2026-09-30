import { useEffect, type RefObject } from "react";
import { initParallax } from "../lib/parallax";

/**
 * Runs the PNG-layer parallax (see lib/parallax.ts) for every `.px` image
 * inside `rootRef` for the lifetime of the calling component.
 */
export function useParallax(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initParallax(root);
  }, [rootRef]);
}
