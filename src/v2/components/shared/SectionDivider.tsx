import React from "react";

/**
 * Thin champagne rule with a small diamond at its centre, placed between
 * sections. Inline SVG, so it needs no asset file.
 */
export const SectionDivider: React.FC = () => (
  <div className="v2-divider" aria-hidden="true">
    <span />
    <svg width="11" height="11" viewBox="0 0 11 11">
      <path d="M5.5 0.5 10.5 5.5 5.5 10.5 0.5 5.5Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M5.5 3.4 7.6 5.5 5.5 7.6 3.4 5.5Z" fill="currentColor" />
    </svg>
    <span />
  </div>
);
