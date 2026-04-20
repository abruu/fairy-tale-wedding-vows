import { useEffect, useRef, useState, useCallback } from 'react';
import { ANIMATION_CONFIG } from '@/config/animations';

/**
 * Tracks a section's position relative to the viewport and
 * returns a normalised progress (0 → 1) as the section scrolls
 * through view.  Used for per-element parallax within a section.
 */
export function useSectionParallax() {
  const cfg = ANIMATION_CONFIG.parallax;
  const mobileCfg = ANIMATION_CONFIG.mobile;
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const rafId = useRef(0);
  const currentProgress = useRef(0);
  const targetProgress = useRef(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const disabled =
    !ANIMATION_CONFIG.enabled ||
    !cfg.enabled ||
    (isMobile && mobileCfg.disableParallax);

  const tick = useCallback(() => {
    currentProgress.current +=
      (targetProgress.current - currentProgress.current) * cfg.smoothing;
    setProgress(Math.round(currentProgress.current * 1000) / 1000);
    rafId.current = requestAnimationFrame(tick);
  }, [cfg.smoothing]);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top hits viewport bottom, 1 when top hits viewport top
      const raw = 1 - rect.top / vh;
      targetProgress.current = Math.max(0, Math.min(1, raw));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [disabled, tick]);

  /**
   * Returns transform style for an element within the section.
   * @param speed — multiplier (positive = moves up as user scrolls)
   */
  const layerStyle = useCallback(
    (speed: number): React.CSSProperties => {
      if (disabled) return {};
      const offset = (progress - 0.5) * speed * cfg.maxOffset;
      return {
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: 'transform',
      };
    },
    [disabled, progress, cfg.maxOffset],
  );

  return { ref, progress, layerStyle, disabled };
}
