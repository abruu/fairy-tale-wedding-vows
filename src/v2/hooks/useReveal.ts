import { useEffect, useRef, useState } from "react";

type RevealType = "up" | "scale" | "left" | "right" | "blur" | "clip";

interface UseRevealOptions {
  type?: RevealType;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
}

/**
 * Intersection Observer-based scroll reveal hook.
 * Returns a ref to attach and a boolean for whether it's revealed.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const {
    type = "up",
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once = true,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setRevealed(true), delay);
          } else {
            setRevealed(true);
          }
          if (once) observer.unobserve(el);
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay]);

  const className = getRevealClass(type);

  return { ref, revealed, className };
}

function getRevealClass(type: RevealType): string {
  switch (type) {
    case "scale":
      return "v2-reveal-scale";
    case "left":
      return "v2-reveal-left";
    case "right":
      return "v2-reveal-right";
    case "blur":
      return "v2-reveal-blur";
    case "clip":
      return "v2-reveal-clip";
    case "up":
    default:
      return "v2-reveal";
  }
}
