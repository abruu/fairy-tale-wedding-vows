/**
 * The invitation frame: a hairline champagne-gold rectangle set slightly inside
 * the viewport, with a slow shimmer travelling around it and four *different*
 * corner ornaments. Purely decorative and pointer-transparent, so it can never
 * intercept a tap or cause overflow.
 */

/** Top-left — a botanical branch reaching inward. */
const CornerBranch = () => (
  <svg viewBox="0 0 160 160" className="cs-frame__corner cs-frame__corner--tl" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M6 6c22 10 40 27 53 48 13 21 21 46 24 72" />
      <path d="M24 22c12 1 22 8 28 19M19 30c-2 12 3 23 12 30" />
      <path d="M46 54c13 2 23 10 29 21M41 63c-2 13 4 24 13 31" />
      <path d="M69 98c12 3 21 12 26 23M64 108c-1 12 5 22 14 29" />
      <path d="M88 138c9 3 16 9 20 18" />
    </g>
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <circle cx="31" cy="10" r="5" />
      <path d="M31 5c2.6 1.7 3.8 5.2 2.6 8.2M31 15c-2.6-1.7-3.8-5.2-2.6-8.2" />
      <circle cx="10" cy="40" r="3.6" />
    </g>
  </svg>
);

/** Top-right — a small floral spray. */
const CornerFloral = () => (
  <svg viewBox="0 0 160 160" className="cs-frame__corner cs-frame__corner--tr" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M154 8c-26 6-48 20-64 40-16 20-26 44-30 70" />
      <path d="M132 30c-11 4-19 13-22 25M140 40c1 12-4 22-13 29" />
      <path d="M104 66c-11 5-18 14-20 26M112 76c1 12-4 21-13 27" />
    </g>
    <g fill="none" stroke="currentColor" strokeWidth="0.85">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="132"
          cy="14"
          rx="4"
          ry="9"
          transform={`rotate(${deg} 132 14)`}
        />
      ))}
      <circle cx="132" cy="14" r="2" />
      <circle cx="150" cy="46" r="3.4" />
      <circle cx="86" cy="112" r="2.6" />
    </g>
  </svg>
);

/** Bottom-left — delicate line-art leaves. */
const CornerLeaves = () => (
  <svg viewBox="0 0 160 160" className="cs-frame__corner cs-frame__corner--bl" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M8 152c24-6 44-19 60-38 16-19 26-42 31-67" />
      <path d="M30 132c9-9 12-21 9-33M22 122c12 3 23-1 31-9" />
      <path d="M62 104c8-10 10-22 6-34M53 95c12 4 23 1 31-7" />
      <path d="M92 66c6-10 7-21 3-31" />
    </g>
    <g fill="none" stroke="currentColor" strokeWidth="0.85">
      <path d="M14 146c6-3 9-9 8-16-7 2-11 8-8 16Z" />
      <path d="M44 118c6-3 9-9 8-16-7 2-11 8-8 16Z" />
      <circle cx="112" cy="30" r="3.2" />
    </g>
  </svg>
);

/** Bottom-right — a decorative flourish. */
const CornerFlourish = () => (
  <svg viewBox="0 0 160 160" className="cs-frame__corner cs-frame__corner--br" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M152 152c-28-4-52-16-70-36-18-20-28-45-30-72" />
      <path d="M146 134c-14 0-25-6-32-17 13-4 25-1 34 8" />
      <path d="M110 112c-13-2-22-9-27-21 13-2 24 3 31 13" />
      <path d="M84 74c-9-9-13-20-11-33 11 6 17 16 17 28" />
      <path d="M138 148c8-6 12-14 12-24-9 4-14 12-14 22" />
    </g>
    <g fill="none" stroke="currentColor" strokeWidth="0.85">
      <circle cx="52" cy="34" r="3.4" />
      <path d="M52 29c2.4 1.6 3.4 4.8 2.4 7.6M52 39c-2.4-1.6-3.4-4.8-2.4-7.6" />
    </g>
  </svg>
);

export const DecorativeFrame = () => (
  <div className="cs-frame" aria-hidden="true">
    <span className="cs-frame__shimmer" />
    <CornerBranch />
    <CornerFloral />
    <CornerLeaves />
    <CornerFlourish />
  </div>
);

export default DecorativeFrame;
