import React, { useRef, useState, useCallback, useEffect } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
}

// welcome → playing → fading → done
type Phase = 'welcome' | 'playing' | 'fading' | 'done';

// How long the welcome card stays visible before auto-playing the video
const WELCOME_DURATION_MS = 3000;

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>('welcome');
  // Drives the welcome overlay's own opacity so it can fade independently
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  // ── Seek to frame 1 so the first frame shows as a poster ──
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) videoRef.current.currentTime = 0.001;
  }, []);

  const triggerFadeOut = useCallback(() => {
    setPhase('fading');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1100);
  }, [onComplete]);

  // ── Auto-play sequence: fade welcome out, then start video ──
  useEffect(() => {
    if (phase !== 'welcome') return;

    // After WELCOME_DURATION_MS, start fading the welcome card out
    const fadeTimer = setTimeout(() => {
      setWelcomeVisible(false);
    }, WELCOME_DURATION_MS);

    // After the welcome fade-out finishes (~600 ms later), play the video
    const playTimer = setTimeout(() => {
      setPhase('playing');
      videoRef.current?.play().catch(() => triggerFadeOut());
    }, WELCOME_DURATION_MS + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(playTimer);
    };
  }, [phase, triggerFadeOut]);

  if (phase === 'done') return null;

  const isFading = phase === 'fading';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: '#0a0505',
        overflow: 'hidden',
        // Outer fade-out when the whole intro concludes
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1.1s ease',
      }}
    >
      {/* ── Video (always rendered, paused on first frame until phase=playing) ── */}
      <video
        ref={videoRef}
        src="/video/openVideo.mov"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={triggerFadeOut}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* ── Dark scrim so the welcome card reads well over the first frame ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,5,5,0.55) 0%, rgba(10,5,5,0.35) 50%, rgba(10,5,5,0.65) 100%)',
          opacity: welcomeVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── Welcome card ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          opacity: welcomeVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Top flourish */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(230,203,168,0.7)',
            animation: 'fade-in 0.9s ease-out both',
          }}
        >
          Welcome to our celebration
        </p>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(230,203,168,0.6), transparent)',
            animation: 'fade-in 1s ease-out 0.2s both',
          }}
        />

        {/* Names */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            color: '#E6CBA8',
            textShadow: '0 2px 30px rgba(0,0,0,0.7)',
            margin: 0,
            lineHeight: 1.1,
            animation: 'fade-in 1s ease-out 0.3s both',
          }}
        >
          Daril &amp; Sneha
        </h1>

        {/* Wedding date */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.55)',
            animation: 'fade-in 1s ease-out 0.5s both',
          }}
        >
          August 28, 2025
        </p>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(230,203,168,0.6), transparent)',
            animation: 'fade-in 1s ease-out 0.6s both',
          }}
        />

        {/* Hearts */}
        <p
          aria-hidden="true"
          style={{
            color: 'rgba(183,110,121,0.8)',
            fontSize: '1.1rem',
            letterSpacing: '0.4em',
            animation: 'fade-in 1s ease-out 0.7s both, heartbeat 1.6s ease-in-out 1.2s infinite',
          }}
        >
          ♥ ♥ ♥
        </p>
      </div>

      {/* ── Skip button (visible while video is playing) ── */}
      {phase === 'playing' && (
        <button
          onClick={triggerFadeOut}
          style={{
            position: 'absolute',
            bottom: '1.75rem',
            right: '1.75rem',
            zIndex: 3,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '9999px',
            padding: '0.4rem 1.1rem',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
          aria-label="Skip intro"
        >
          Skip
        </button>
      )}
    </div>
  );
};

export default VideoIntro;
