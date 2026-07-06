import React, { useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FloatingOrnamentsProps {
  count?: number;
  variant?: 'petals' | 'sparkles' | 'leaves';
  className?: string;
}

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
  emoji: string;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Floating decorative ornaments — petals, sparkles, or leaves.
 * Uses CSS animations, respects reduced motion.
 */
export const FloatingOrnaments: React.FC<FloatingOrnamentsProps> = ({
  count = 8,
  variant = 'petals',
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    if (prefersReduced) return [];

    const config = {
      petals: { emoji: '🌸', sizeRange: [10, 18] as [number, number], durationRange: [10, 18] as [number, number] },
      sparkles: { emoji: '✦', sizeRange: [8, 14] as [number, number], durationRange: [8, 14] as [number, number] },
      leaves: { emoji: '🍃', sizeRange: [12, 20] as [number, number], durationRange: [12, 22] as [number, number] },
    }[variant];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${rand(2, 96)}%`,
      size: rand(config.sizeRange[0], config.sizeRange[1]),
      duration: `${rand(config.durationRange[0], config.durationRange[1])}s`,
      delay: `${rand(0, 8)}s`,
      opacity: rand(0.2, 0.5),
      emoji: config.emoji,
    }));
  }, [count, variant, prefersReduced]);

  if (particles.length === 0) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="v2-ornament-particle"
          style={{
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
            color: '#C9A96E',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};
