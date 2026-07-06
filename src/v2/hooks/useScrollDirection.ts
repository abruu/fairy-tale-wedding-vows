import { useState, useEffect } from 'react';

/**
 * Tracks scroll direction and whether the user has scrolled past a threshold.
 * Used for auto-hide navigation.
 */
export function useScrollDirection(threshold = 10) {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      if (Math.abs(diff) > threshold) {
        setScrollDir(diff > 0 ? 'down' : 'up');
        lastScrollY = currentScrollY;
      }

      setScrolled(currentScrollY > 100);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrollDir, scrolled };
}
