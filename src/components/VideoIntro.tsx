import React, { useRef, useState, useCallback, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/config/dates';

// Format ISO date string as "DD · MM · YYYY"
const formatIntroDate = (iso: string): string => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd} · ${mm} · ${yyyy}`;
};

interface VideoIntroProps {
  onComplete: () => void;
  onStart?: () => void;
}

// idle → playing → fading → done
type Phase = 'idle' | 'playing' | 'fading' | 'done';

// Safety timeout: if video stalls in 'playing' for this long, skip it
const VIDEO_STALL_TIMEOUT_MS = 15000;
// How long the fade-out transition lasts
const FADE_DURATION_MS = 1200;

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete, onStart }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [videoReady, setVideoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);

  // ── Fade out and complete ──
  const triggerFadeOut = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    setPhase('fading');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, FADE_DURATION_MS);
  }, [onComplete]);

  // ── Seek to first frame so it appears as a poster ──
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0.001;
    }
  }, []);

  // ── Mark the video as ready to play ──
  const handleCanPlay = useCallback(() => {
    setVideoReady(true);
  }, []);

  // ── Video error (unsupported format, 404, etc.) → skip to content ──
  const handleVideoError = useCallback(() => {
    triggerFadeOut();
  }, [triggerFadeOut]);

  // ── User clicks → play the video ──
  const handlePlay = useCallback(() => {
    if (phase !== 'idle' || isLoading) return;
    const vid = videoRef.current;
    if (!vid) { triggerFadeOut(); return; }

    setIsLoading(true);
    onStart?.(); // start music immediately

    vid.play().then(() => {
      setIsLoading(false);
      setPhase('playing');
      // Safety: if video stalls, skip after timeout
      stallTimerRef.current = setTimeout(triggerFadeOut, VIDEO_STALL_TIMEOUT_MS);
    }).catch(() => {
      setIsLoading(false);
      triggerFadeOut();
    });
  }, [phase, isLoading, onStart, triggerFadeOut]);

  // ── Cleanup stall timer on unmount ──
  useEffect(() => {
    return () => {
      if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    };
  }, []);

  if (phase === 'done') return null;

  const isFading = phase === 'fading';
  const isIdle = phase === 'idle';

  return (
    <div
      onClick={isIdle && !isLoading ? handlePlay : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: '#0a0505',
        overflow: 'hidden',
        opacity: isFading ? 0 : 1,
        transition: `opacity ${FADE_DURATION_MS}ms ease`,
        cursor: isIdle && !isLoading ? 'pointer' : 'default',
      }}
    >
      {/* ── Video (shows first frame immediately) ── */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onEnded={triggerFadeOut}
        onError={handleVideoError}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/video/openVideo.mp4" type="video/mp4" />
        <source src="/video/openVideo.mov" type="video/quicktime" />
      </video>

      {/* ── Loading spinner (after tap, while video buffers) ── */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10,5,5,0.7)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '3px solid rgba(168,201,230,0.15)',
              borderTopColor: 'rgba(168,201,230,0.8)',
              animation: 'vi-spin 0.8s linear infinite',
            }}
          />
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(168,201,230,0.5)',
              marginTop: '1rem',
            }}
          >
            Loading…
          </p>
        </div>
      )}

      {/* ── Play overlay (visible only when idle, before user clicks) ── */}
      {isIdle && !isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, rgba(10,5,5,0.3) 0%, rgba(10,5,5,0.6) 60%, rgba(10,5,5,0.8) 100%)',
          }}
        >
          {/* ── Top flourish ── */}
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.72rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(168,201,230,0.6)',
              marginBottom: '0.6rem',
              animation: 'vi-slide-down 1s ease-out 0.2s both',
            }}
          >
            {WEDDING_CONFIG.videoIntro.topFlourish}
          </p>

          {/* ── Decorative line ── */}
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(168,201,230,0.5), transparent)',
              marginBottom: '1.4rem',
              animation: 'vi-expand 1.2s ease-out 0.4s both',
            }}
          />

          {/* ── "The Wedding of" ── */}
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(74,127,193,0.8)',
              marginBottom: '0.5rem',
              animation: 'vi-slide-up 0.9s ease-out 0.5s both',
            }}
          >
            {WEDDING_CONFIG.videoIntro.weddingOfLabel}
          </p>

          {/* ── Names ── */}
          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 10vw, 6rem)',
              color: '#A8C9E6',
              textShadow: '0 4px 40px rgba(0,0,0,0.5), 0 0 80px rgba(168,201,230,0.15)',
              margin: 0,
              lineHeight: 1.05,
              animation: 'vi-slide-up 1s ease-out 0.6s both',
              maxWidth: '90vw',
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {WEDDING_CONFIG.couple.name1}
          </h1>

          {/* ── Ampersand ── */}
          <p
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              color: 'rgba(74,127,193,0.7)',
              margin: '0.15rem 0',
              animation: 'vi-slide-up 1s ease-out 0.75s both, heartbeat 2.5s ease-in-out 2s infinite',
            }}
          >
            &amp;
          </p>

          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 10vw, 6rem)',
              color: '#A8C9E6',
              textShadow: '0 4px 40px rgba(0,0,0,0.5), 0 0 80px rgba(168,201,230,0.15)',
              margin: 0,
              lineHeight: 1.05,
              animation: 'vi-slide-up 1s ease-out 0.85s both',
              maxWidth: '90vw',
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {WEDDING_CONFIG.couple.name2}
          </h1>

          {/* ── Date line ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginTop: '1.2rem',
              animation: 'vi-slide-up 0.9s ease-out 1s both',
            }}
          >
            <div style={{ width: 30, height: 1, background: 'rgba(168,201,230,0.35)' }} />
            <p
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {formatIntroDate(WEDDING_CONFIG.dates.wedding)}
            </p>
            <div style={{ width: 30, height: 1, background: 'rgba(168,201,230,0.35)' }} />
          </div>

          {/* ── Venue ── */}
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '0.4rem',
              animation: 'vi-slide-up 0.9s ease-out 1.1s both',
            }}
          >
            {WEDDING_CONFIG.videoIntro.venue}
          </p>

          {/* ── Decorative line ── */}
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(168,201,230,0.5), transparent)',
              marginTop: '1.4rem',
              animation: 'vi-expand 1.2s ease-out 1.2s both',
            }}
          />

          {/* ── Play button with pulsing ring ── */}
          <div
            style={{
              position: 'relative',
              marginTop: '1.8rem',
              animation: 'vi-slide-up 0.8s ease-out 1.4s both',
            }}
          >
            {/* Pulsing ring */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: '1px solid rgba(168,201,230,0.25)',
                animation: 'vi-pulse-ring 2.5s ease-out 2s infinite',
              }}
            />
            <button
              aria-label="Play intro video"
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                border: '1.5px solid rgba(168,201,230,0.5)',
                background: 'rgba(168,201,230,0.08)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.35s ease, background 0.35s ease, box-shadow 0.35s ease',
                boxShadow: '0 0 30px rgba(168,201,230,0.08)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.12)';
                e.currentTarget.style.background = 'rgba(168,201,230,0.16)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(168,201,230,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(168,201,230,0.08)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(168,201,230,0.08)';
              }}
              onClick={e => { e.stopPropagation(); handlePlay(); }}
            >
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                <path d="M3 1.5L22 14L3 26.5V1.5Z" fill="#A8C9E6" fillOpacity="0.8" />
              </svg>
            </button>
          </div>

          {/* ── CTA text ── */}
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.58rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(168,201,230,0.45)',
              marginTop: '1rem',
              animation: 'vi-slide-up 0.8s ease-out 1.6s both, vi-gentle-pulse 3s ease-in-out 2.5s infinite',
            }}
          >
            {WEDDING_CONFIG.videoIntro.ctaText}
          </p>

          {/* ── Bottom flourish hearts ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 'clamp(1.5rem, 5vh, 3rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              animation: 'vi-slide-up 0.8s ease-out 1.8s both',
            }}
          >
            <span style={{ color: 'rgba(74,127,193,0.3)', fontSize: '0.5rem' }}>✦</span>
            <span style={{ color: 'rgba(74,127,193,0.4)', fontSize: '0.7rem', animation: 'heartbeat 2s ease-in-out 2.2s infinite' }}>♥</span>
            <span style={{ color: 'rgba(74,127,193,0.3)', fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>
      )}

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
