import React, { useMemo } from 'react';
import { ANIMATION_CONFIG } from '@/config/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Renders floating flowers 🌸, leaves 🍃, and sparkles ✨
 * scattered across the parent (which must be position: relative / overflow: hidden).
 *
 * All counts, sizes, speeds come from ANIMATION_CONFIG.floatingElements.
 */

interface FloatingDecorationsProps {
  /** Optionally restrict which types to show */
  types?: ('flowers' | 'leaves' | 'sparkles')[];
  /** Override total count cap (useful per-section) */
  maxCount?: number;
}

interface Particle {
  id: string;
  emoji: string;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  opacity: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateParticles(
  types: ('flowers' | 'leaves' | 'sparkles')[],
  maxCount: number,
  isMobile: boolean,
): Particle[] {
  const cfg = ANIMATION_CONFIG.floatingElements;
  if (!cfg.enabled) return [];

  const mobileMax = ANIMATION_CONFIG.mobile.maxFloatingElements;
  const cap = isMobile && ANIMATION_CONFIG.mobile.reduceFloatingElements ? mobileMax : maxCount;

  const particles: Particle[] = [];

  for (const type of types) {
    const tc = cfg[type];
    if (!tc.enabled) continue;
    const count = Math.min(tc.count, cap - particles.length);
    for (let i = 0; i < count; i++) {
      particles.push({
        id: `${type}-${i}`,
        emoji: tc.emoji,
        size: rand(tc.sizeRange[0], tc.sizeRange[1]),
        left: `${rand(2, 96)}%`,
        top: `${rand(5, 90)}%`,
        duration: rand(tc.durationRange[0], tc.durationRange[1]),
        delay: rand(0, 10),
        opacity: rand(tc.opacityRange[0], tc.opacityRange[1]),
      });
    }
    if (particles.length >= cap) break;
  }

  return particles;
}

const FloatingDecorations: React.FC<FloatingDecorationsProps> = ({
  types = ['flowers', 'leaves', 'sparkles'],
  maxCount = 15,
}) => {
  const prefersReduced = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const particles = useMemo(
    () => (prefersReduced ? [] : generateParticles(types, maxCount, isMobile)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prefersReduced, isMobile],
  );

  if (!ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.floatingElements.enabled || particles.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-decoration"
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            fontSize: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingDecorations;
