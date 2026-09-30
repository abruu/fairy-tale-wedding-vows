import React from "react";
import { T } from "../../lib/i18n";
import type { TranslationKey } from "../../lib/translations";

interface SectionHeaderProps {
  eyebrow?: TranslationKey;
  /** Omit for a lighter header: the eyebrow then becomes the section's <h2> */
  title?: TranslationKey;
  subtitle?: TranslationKey;
  /** 'light' = ivory/sandal background, 'dark' = maroon/green background */
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}

/**
 * Consistent section header: small eyebrow, serif title, gold lamp-flame
 * divider and an optional subtitle. `id` goes on the <h2> so the section can
 * reference it with aria-labelledby.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  id,
  className = "",
}) => (
  <header className={`v2-section-header v2-section-header--${tone} ${className}`}>
    {title ? (
      <>
        {eyebrow && <T k={eyebrow} as="p" className="v2-eyebrow" />}
        <h2 id={id} className="v2-heading">
          <T k={title} />
        </h2>
      </>
    ) : (
      eyebrow && (
        <h2 id={id} className="v2-eyebrow v2-eyebrow--heading">
          <T k={eyebrow} />
        </h2>
      )
    )}
    <div className="v2-flame-divider" aria-hidden="true">
      <span />
      <svg width="14" height="20" viewBox="0 0 14 20">
        <path d="M7 0C9 5 13 8 13 13a6 6 0 0 1-12 0C1 8 5 5 7 0z" fill="currentColor" />
      </svg>
      <span />
    </div>
    {subtitle && <T k={subtitle} as="p" className="v2-subtitle" />}
  </header>
);
