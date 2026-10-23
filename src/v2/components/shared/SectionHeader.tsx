import React from "react";
import { T } from "../../lib/i18n";
import type { TranslationKey } from "../../lib/translations";

interface SectionHeaderProps {
  eyebrow?: TranslationKey;
  /** Omit for a lighter header: the eyebrow then becomes the section's <h2> */
  title?: TranslationKey;
  subtitle?: TranslationKey;
  /** 'light' = ivory/blush/sage background, 'dark' = burgundy background */
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}

/**
 * Consistent section header: small-caps eyebrow, large serif title, a short
 * champagne rule and an optional subtitle. `id` goes on the <h2> so the
 * section can reference it with aria-labelledby.
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
    <div className="v2-rule" aria-hidden="true" />
    {subtitle && <T k={subtitle} as="p" className="v2-subtitle" />}
  </header>
);
