
import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onLoaded?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const alreadySeen = sessionStorage.getItem('preloader-seen') === 'true';
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>(alreadySeen ? 'done' : 'loading');

  useEffect(() => {
    if (alreadySeen) {
      onLoaded?.();
      return;
    }
    const t1 = setTimeout(() => setPhase('reveal'), 400);
    const t2 = setTimeout(() => {
      sessionStorage.setItem('preloader-seen', 'true');
      setPhase('done');
      onLoaded?.();
    }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onLoaded, alreadySeen]);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F0F7FF 0%, #FFF0F4 50%, #FFE6EE 100%)',
        transition: 'opacity 0.6s ease',
        opacity: phase === 'reveal' ? 1 : 1,
      }}
    >
      {/* Decorative ring */}
      <div
        className="absolute rounded-full border border-rose-gold/20"
        style={{ width: 320, height: 320 }}
      />
      <div
        className="absolute rounded-full border border-champagne-gold/30 animate-spin"
        style={{ width: 260, height: 260, animationDuration: '12s' }}
      />

      {/* Heart icon */}
      <div
        style={{
          animation: 'heartbeat 2.2s ease-in-out infinite',
          marginBottom: '1.5rem',
        }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.94 3.68 2 6.5 2c1.87 0 3.715.99 4.925 2.525A6.05 6.05 0 0 1 16.5 2C19.32 2 22 3.94 22 7.191c0 4.105-5.37 8.863-11 14.402z"
            fill="url(#heartGrad)"
            opacity="0.9"
          />
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A7FC1" />
              <stop offset="100%" stopColor="#A8C9E6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Names */}
      <h1
        className="font-serif italic text-3xl md:text-4xl mb-2"
        style={{
          color: '#4A7FC1',
          opacity: phase === 'reveal' ? 1 : 0,
          transform: phase === 'reveal' ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}
      >
        Daril &amp; Sneha
      </h1>

      {/* Scripture */}
      <p
        className="font-serif italic text-sm md:text-base text-center max-w-xs px-4"
        style={{
          color: '#9D6E6E',
          opacity: phase === 'reveal' ? 1 : 0,
          transform: phase === 'reveal' ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
        }}
      >
        "God has made everything beautiful in its time"
      </p>
      <p
        className="text-xs mt-1"
        style={{
          color: '#C29A9A',
          opacity: phase === 'reveal' ? 0.8 : 0,
          transition: 'opacity 0.7s ease 0.4s',
        }}
      >
        Ecclesiastes 3:11
      </p>

      {/* Loading bar */}
      <div
        className="mt-8 rounded-full overflow-hidden"
        style={{
          width: 140,
          height: 2,
          background: 'rgba(74,127,193,0.15)',
          opacity: phase === 'loading' ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #4A7FC1, #A8C9E6)',
            animation: 'shimmer 1.4s ease-in-out infinite',
            backgroundSize: '200% auto',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default Preloader;
