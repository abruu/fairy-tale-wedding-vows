import { useEffect, useRef, useState, useCallback } from 'react';
import { ANIMATION_CONFIG } from '@/config/animations';

/**
 * Hook that tracks scroll position and returns parallax Y-offsets
 * for background, midground, and foreground layers.
 *
 * Uses requestAnimationFrame + lerp for butter-smooth 60fps movement.
 * Automatically disabled on mobile when config says so.
 */
export function useParallax() {
  const cfg = ANIMATION_CONFIG.parallax;
  const mobileCfg = ANIMATION_CONFIG.mobile;
  const [offsets, setOffsets] = useState({ bg: 0, mid: 0, fg: 0 });
  const rafId = useRef(0);
  const currentY = useRef({ bg: 0, mid: 0, fg: 0 });
  const targetY = useRef({ bg: 0, mid: 0, fg: 0 });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const disabled =
    !ANIMATION_CONFIG.enabled ||
    !cfg.enabled ||
    (isMobile && mobileCfg.disableParallax);

  const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

  const tick = useCallback(() => {
    const s = cfg.smoothing;
    currentY.current.bg += (targetY.current.bg - currentY.current.bg) * s;
    currentY.current.mid += (targetY.current.mid - currentY.current.mid) * s;
    currentY.current.fg += (targetY.current.fg - currentY.current.fg) * s;

    setOffsets({
      bg: Math.round(currentY.current.bg * 100) / 100,
      mid: Math.round(currentY.current.mid * 100) / 100,
      fg: Math.round(currentY.current.fg * 100) / 100,
    });

    rafId.current = requestAnimationFrame(tick);
  }, [cfg.smoothing]);

  useEffect(() => {
    if (disabled) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      targetY.current.bg = clamp(scrollY * cfg.layers.background, cfg.maxOffset);
      targetY.current.mid = clamp(scrollY * cfg.layers.midground, cfg.maxOffset);
      targetY.current.fg = clamp(scrollY * cfg.layers.foreground, cfg.maxOffset);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [disabled, cfg, tick]);

  return { offsets, disabled };
}

/**
 * Returns parallax transform style for a specific layer.
 */
export function useParallaxStyle(layer: 'bg' | 'mid' | 'fg') {
  const { offsets, disabled } = useParallax();
  if (disabled) return {};
  const y = offsets[layer];
  return {
    transform: `translate3d(0, ${y}px, 0)`,
    willChange: 'transform' as const,
  };
}
