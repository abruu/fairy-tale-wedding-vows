import React from 'react';

interface OrnamentProps {
  className?: string;
  variant?: 'gold' | 'rose-gold' | 'light';
  size?: number;
}

/**
 * Decorative ornament — a small SVG flourish with lines and a center dot.
 */
export const Ornament: React.FC<OrnamentProps> = ({
  className = '',
  variant = 'gold',
  size = 1,
}) => {
  const color =
    variant === 'gold' ? '#C6A15B'
    : variant === 'rose-gold' ? '#C98A7D'
    : 'rgba(255,255,255,0.6)';
  const lineColor =
    variant === 'gold' ? 'rgba(198,161,91,0.4)'
    : variant === 'rose-gold' ? 'rgba(201,138,125,0.4)'
    : 'rgba(255,255,255,0.3)';

  return (
    <div className={`v2-divider ${className}`} style={{ transform: `scale(${size})` }}>
      <div className="v2-divider-line" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <div className="v2-ornament-dot" style={{ background: color }} />
      <div className="v2-divider-line" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
    </div>
  );
};

/**
 * Simple horizontal divider with a center heart/dot.
 */
export const Divider: React.FC<{ className?: string; variant?: 'gold' | 'rose-gold' | 'light' }> = ({
  className = '',
  variant = 'gold',
}) => {
  const color =
    variant === 'gold' ? '#C6A15B'
    : variant === 'rose-gold' ? '#C98A7D'
    : 'rgba(255,255,255,0.5)';

  return (
    <div className={`v2-divider ${className}`}>
      <div className="v2-divider-line" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="12" height="12" viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.94 3.68 2 6.5 2c1.87 0 3.715.99 4.925 2.525A6.05 6.05 0 0 1 16.5 2C19.32 2 22 3.94 22 7.191c0 4.105-5.37 8.863-11 14.402z" />
      </svg>
      <div className="v2-divider-line" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
    </div>
  );
};

/**
 * Curved section divider — SVG wave between sections.
 */
export const SectionDivider: React.FC<{
  fill?: string;
  flip?: boolean;
  className?: string;
}> = ({ fill = '#0D0C0B', flip = false, className = '' }) => {
  return (
    <div className={`v2-curve-divider ${className}`} style={{ transform: flip ? 'rotate(180deg)' : undefined }}>
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,0 C300,50 900,50 1200,0 L1200,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

/**
 * Decorative corner flourish for cards.
 */
export const CornerFlourish: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }> = ({
  position,
  color = 'rgba(198,161,91,0.3)',
}) => {
  const pos = {
    tl: { top: '1rem', left: '1rem' },
    tr: { top: '1rem', right: '1rem' },
    bl: { bottom: '1rem', left: '1rem' },
    br: { bottom: '1rem', right: '1rem' },
  }[position];

  const rotate = {
    tl: 0,
    tr: 90,
    bl: 270,
    br: 180,
  }[position];

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ position: 'absolute', ...pos, transform: `rotate(${rotate}deg)`, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <path d="M2 2 Q2 12 12 12" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="2" cy="2" r="1.5" fill={color} />
    </svg>
  );
};
