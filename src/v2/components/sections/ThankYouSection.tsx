import React from 'react';
import { WEDDING_CONFIG } from '@/config/dates';
import { useReveal } from '../../hooks/useReveal';
import { FloatingOrnaments } from '../shared/FloatingOrnaments';
import { CrossMotif } from '../shared/CrossMotif';

/**
 * Elegant closing section with thank you message and couple's names.
 */
export const ThankYouSection: React.FC = () => {
  const { ref, revealed, className } = useReveal<HTMLDivElement>({ type: 'blur' });

  return (
    <section
      id="thankyou"
      className="v2-bg-gradient-dark"
      style={{ position: 'relative', padding: '6rem 1.5rem 4rem', overflow: 'hidden', textAlign: 'center' }}
    >
      <FloatingOrnaments count={6} variant="sparkles" />

      {/* Watercolor glows */}
      <div className="v2-watercolor" style={{ width: 400, height: 400, top: '0%', left: '50%', transform: 'translateX(-50%)', background: 'var(--v2-gold)', opacity: 0.06 }} />

      <div
        ref={ref}
        className={`${className} ${revealed ? 'revealed' : ''}`}
        style={{ position: 'relative', zIndex: 2, maxWidth: '40rem', margin: '0 auto' }}
      >
        {/* Faith bookend — mirrors the Opening watermark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(to right, transparent, var(--v2-line))' }} />
          <CrossMotif size={20} />
          <div style={{ width: 50, height: 1, background: 'linear-gradient(to right, var(--v2-line), transparent)' }} />
        </div>

        <p
          className="v2-eyebrow"
          style={{ color: 'var(--v2-gold-light)', marginBottom: '1.5rem' }}
        >
          With Love & Gratitude
        </p>

        <h2
          style={{
            fontFamily: 'var(--v2-font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 500,
            color: 'var(--v2-ivory)',
            textShadow: '0 4px 40px rgba(198,161,91,0.15)',
            margin: 0,
          }}
        >
          Thank You
        </h2>

        <p
          style={{
            fontFamily: 'var(--v2-font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: 'rgba(255,255,240,0.5)',
            marginTop: '1.5rem',
            lineHeight: 1.7,
          }}
        >
          For being part of our story. Your presence and blessings make our journey complete.
        </p>

        {/* Names */}
        <div style={{ marginTop: '2.5rem' }}>
          <p
            style={{
              fontFamily: 'var(--v2-font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(198,161,91,0.5)',
              marginBottom: '0.75rem',
            }}
          >
            {WEDDING_CONFIG.couple.tagline}
          </p>
          <h3
            style={{
              fontFamily: 'var(--v2-font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 500,
              background: 'linear-gradient(135deg, var(--v2-gold-light) 0%, var(--v2-ivory) 50%, var(--v2-gold-light) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            {WEDDING_CONFIG.couple.displayNames}
          </h3>
        </div>

        {/* Best wishes credit */}
        {(() => {
          const lines = [WEDDING_CONFIG.couple.brideSharingHappiness, WEDDING_CONFIG.couple.sharingHappiness].filter(Boolean);
          if (lines.length === 0) return null;
          return (
            <div style={{ marginTop: '2.5rem' }}>
              <p className="v2-eyebrow" style={{ color: 'var(--v2-gold-light)', marginBottom: '0.75rem' }}>
                With Best Wishes
              </p>
              {lines.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--v2-font-display)',
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                    color: 'rgba(234,228,216,0.5)',
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          );
        })()}

        {/* Bottom flourish — the countdown lives in the Hero only */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '3rem' }}>
          <span style={{ color: 'rgba(198,161,91,0.2)', fontSize: '0.5rem' }}>✦</span>
          <span style={{ color: 'rgba(198,161,91,0.3)', fontSize: '0.7rem' }}>♥</span>
          <span style={{ color: 'rgba(198,161,91,0.2)', fontSize: '0.5rem' }}>✦</span>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--v2-font-sans)',
            fontSize: '0.6rem',
            color: 'rgba(255,255,240,0.2)',
            marginTop: '2rem',
            letterSpacing: '0.1em',
          }}
        >
          Made with love · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
};
