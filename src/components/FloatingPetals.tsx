import React from 'react';

interface Petal {
  left: string;
  duration: string;
  delay: string;
  size: number;
  opacity: number;
  color: string;
}

const PETALS: Petal[] = [
  { left: '8%',  duration: '12s', delay: '0s',   size: 10, opacity: 0.55, color: '#C5E0FF' },
  { left: '18%', duration: '16s', delay: '2.5s', size: 8,  opacity: 0.45, color: '#A8C9E6' },
  { left: '28%', duration: '11s', delay: '1s',   size: 12, opacity: 0.5,  color: '#FFD6C9' },
  { left: '40%', duration: '14s', delay: '3.5s', size: 8,  opacity: 0.4,  color: '#C5E0FF' },
  { left: '52%', duration: '13s', delay: '0.8s', size: 11, opacity: 0.5,  color: '#A8C9E6' },
  { left: '62%', duration: '10s', delay: '4s',   size: 9,  opacity: 0.45, color: '#FFD6C9' },
  { left: '72%', duration: '15s', delay: '1.8s', size: 10, opacity: 0.55, color: '#C5E0FF' },
  { left: '82%', duration: '12s', delay: '3s',   size: 8,  opacity: 0.4,  color: '#A8C9E6' },
  { left: '90%', duration: '11s', delay: '2s',   size: 12, opacity: 0.5,  color: '#FFD6C9' },
  { left: '4%',  duration: '17s', delay: '5s',   size: 7,  opacity: 0.35, color: '#C5E0FF' },
  { left: '35%', duration: '13s', delay: '6s',   size: 9,  opacity: 0.45, color: '#4A7FC1' },
  { left: '58%', duration: '14s', delay: '0.3s', size: 8,  opacity: 0.35, color: '#A8C9E6' },
  { left: '76%', duration: '16s', delay: '4.5s', size: 11, opacity: 0.5,  color: '#FFD6C9' },
  { left: '94%', duration: '12s', delay: '2.8s', size: 9,  opacity: 0.4,  color: '#C5E0FF' },
];

/** Heart SVG petal */
const HeartPetal: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: 'block' }}
  >
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.94 3.68 2 6.5 2c1.87 0 3.715.99 4.925 2.525A6.05 6.05 0 0 1 16.5 2C19.32 2 22 3.94 22 7.191c0 4.105-5.37 8.863-11 14.402z" />
  </svg>
);

interface FloatingPetalsProps {
  /** Limit petals on low-end devices */
  count?: number;
}

const FloatingPetals: React.FC<FloatingPetalsProps> = ({ count }) => {
  const petals = count ? PETALS.slice(0, count) : PETALS;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal-particle"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        >
          <HeartPetal size={p.size} color={p.color} />
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
