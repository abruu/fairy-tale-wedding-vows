import React from 'react';

interface CrossMotifProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * A minimal line-art Orthodox cross — the site's recurring faith motif.
 * Used as a watermark (Opening/ThankYou), a scripture-band flourish
 * (Invitation), a nav logo mark, and a venue glyph (Wedding Details).
 */
export const CrossMotif: React.FC<CrossMotifProps> = ({
  className = '',
  size = 24,
  color = 'var(--v2-sacred-gold)',
  opacity = 1,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 36"
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <line x1="12" y1="1" x2="12" y2="35" stroke={color} strokeWidth="1.25" />
      <line x1="4" y1="9" x2="20" y2="9" stroke={color} strokeWidth="1.25" />
      <line x1="6.5" y1="26" x2="17.5" y2="29" stroke={color} strokeWidth="1.25" />
    </svg>
  );
};
