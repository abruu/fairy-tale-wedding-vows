import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Consistent section header with eyebrow, title, and subtitle.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  variant = 'dark',
  className = '',
}) => {
  const textColor = variant === 'dark' ? 'var(--v2-charcoal)' : 'var(--v2-ivory)';
  const subColor = variant === 'dark' ? 'rgba(44,44,44,0.7)' : 'rgba(255,255,240,0.7)';

  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p className="v2-eyebrow mb-4" style={{ color: variant === 'dark' ? 'var(--v2-gold)' : 'var(--v2-gold-light)' }}>
          {eyebrow}
        </p>
      )}
      <h2 className="v2-heading-lg" style={{ color: textColor }}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3 mt-4 mb-4">
        <div style={{ height: 1, width: 50, background: variant === 'dark' ? 'linear-gradient(to right, transparent, var(--v2-gold))' : 'linear-gradient(to right, transparent, var(--v2-gold-light))' }} />
        <svg width="10" height="10" viewBox="0 0 24 24" fill={variant === 'dark' ? 'var(--v2-gold)' : 'var(--v2-gold-light)'} aria-hidden="true">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.94 3.68 2 6.5 2c1.87 0 3.715.99 4.925 2.525A6.05 6.05 0 0 1 16.5 2C19.32 2 22 3.94 22 7.191c0 4.105-5.37 8.863-11 14.402z" />
        </svg>
        <div style={{ height: 1, width: 50, background: variant === 'dark' ? 'linear-gradient(to right, var(--v2-gold), transparent)' : 'linear-gradient(to right, var(--v2-gold-light), transparent)' }} />
      </div>
      {subtitle && (
        <p className="v2-body-italic max-w-md mx-auto" style={{ color: subColor }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
