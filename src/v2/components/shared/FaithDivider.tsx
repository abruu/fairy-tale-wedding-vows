import React from 'react';
import { motion } from 'framer-motion';
import { CrossMotif } from './CrossMotif';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Recurring section-transition beat: a gold hairline that draws in on
 * scroll with the cross motif centered — the site's faith touchpoint
 * repeated between major sections.
 */
export const FaithDivider: React.FC<{ className?: string; tone?: 'dark' | 'light' }> = ({
  className = '',
  tone = 'dark',
}) => {
  const prefersReduced = useReducedMotion();
  const lineColor = tone === 'dark' ? 'var(--v2-line)' : 'var(--v2-line-dark)';

  return (
    <div
      className={`v2-faith-divider ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2.5rem 0',
      }}
    >
      <motion.span
        style={{ height: 1, background: lineColor, flex: 1, maxWidth: 160, transformOrigin: 'right' }}
        initial={prefersReduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <CrossMotif size={18} opacity={0.85} />
      <motion.span
        style={{ height: 1, background: lineColor, flex: 1, maxWidth: 160, transformOrigin: 'left' }}
        initial={prefersReduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
};
