import { useEffect, useRef, useState, useCallback } from "react";
import { ANIMATION_CONFIG } from "@/config/animations";

type RevealAnimation =
  | "fade-up"
  | "fade-in"
  | "fade-left"
  | "fade-right"
  | "scale-in";

interface UseScrollRevealOptions {
  /** Override default animation */
  animation?: RevealAnimation;
  /** Override default duration (ms) */
  duration?: number;
  /** Extra delay on top of any stagger (ms) */
  delay?: number;
  /** Override threshold (0–1) */
  threshold?: number;
  /** Override once flag */
  once?: boolean;
}

/**
 * Scroll-reveal hook using IntersectionObserver.
 * Returns a ref to attach to the element and a `revealed` boolean.
 * CSS classes are applied via the returned className helper.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const cfg = ANIMATION_CONFIG.scrollReveal;
  const disabled = !ANIMATION_CONFIG.enabled || !cfg.enabled;

  const animation = options.animation ?? cfg.defaultAnimation;
  const duration = options.duration ?? cfg.duration;
  const delay = options.delay ?? 0;
  const threshold = options.threshold ?? cfg.threshold;
  const once = options.once ?? cfg.once;

  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(disabled);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setRevealed(false);
        }
      },
      {
        threshold,
        rootMargin: cfg.rootMargin,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, threshold, once, cfg.rootMargin]);

  const style: React.CSSProperties = disabled
    ? {}
    : {
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction:
          ANIMATION_CONFIG.sectionTransitions.fadeSlideUp.easing,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
        ...(revealed ? getRevealedStyle() : getHiddenStyle(animation)),
      };

  return { ref, revealed, style };
}

function getHiddenStyle(animation: RevealAnimation): React.CSSProperties {
  const dist = ANIMATION_CONFIG.sectionTransitions.fadeSlideUp.distance;
  const base: React.CSSProperties = { opacity: 0 };
  switch (animation) {
    case "fade-up":
      return { ...base, transform: `translateY(${dist}px)` };
    case "fade-left":
      return { ...base, transform: `translateX(-${dist}px)` };
    case "fade-right":
      return { ...base, transform: `translateX(${dist}px)` };
    case "scale-in":
      return { ...base, transform: "scale(0.88)" };
    case "fade-in":
    default:
      return base;
  }
}

function getRevealedStyle(): React.CSSProperties {
  return { opacity: 1, transform: "translate3d(0,0,0) scale(1)" };
}

/**
 * Convenience: returns staggered delay for the nth child.
 */
export function staggerDelay(index: number): number {
  return index * ANIMATION_CONFIG.scrollReveal.staggerDelay;
}
