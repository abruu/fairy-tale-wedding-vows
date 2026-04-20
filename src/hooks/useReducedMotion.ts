import { useState, useEffect } from 'react';

/**
 * Respects `prefers-reduced-motion` and also detects low-end devices
 * via navigator.hardwareConcurrency.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/**
 * Returns true when the device is "low-end" (≤ 4 logical cores).
 * Used to further reduce effects.
 */
export function useIsLowEnd(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4) {
      setLow(true);
    }
  }, []);
  return low;
}
