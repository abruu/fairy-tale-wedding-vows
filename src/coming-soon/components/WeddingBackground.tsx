import { useMemo } from "react";
import { comingSoonConfig } from "../config";

const { photo } = comingSoonConfig;

interface Floater {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  peak: number;
  dust: boolean;
}

const buildFloaters = (count: number): Floater[] =>
  Array.from({ length: count }, (_, i) => {
    const dust = i % 3 === 2;
    return {
      id: i,
      left: Math.round(Math.random() * 100),
      size: dust ? 2 + Math.random() * 2.5 : 7 + Math.random() * 9,
      duration: 22 + Math.random() * 22,
      delay: -Math.random() * 30,
      drift: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 70),
      peak: dust ? 0.35 + Math.random() * 0.25 : 0.35 + Math.random() * 0.4,
      dust,
    };
  });

/** Large, soft botanical silhouette used as a depth layer behind everything. */
const Silhouette = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 220 220"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 4c26 14 46 36 60 62 14 26 22 55 24 86" />
    <path d="M28 26c14 2 26 10 33 22M22 34c-2 14 3 27 13 36" />
    <path d="M52 60c15 3 27 12 34 25M46 70c-2 15 4 28 15 37" />
    <path d="M74 100c15 4 26 14 32 27M68 111c-2 15 5 28 16 36" />
    <path d="M92 143c13 5 22 15 27 27M87 154c-1 13 5 24 15 31" />
    <g strokeWidth="1.2">
      <circle cx="36" cy="12" r="5.5" />
      <circle cx="14" cy="46" r="4.5" />
      <circle cx="104" cy="176" r="5" />
    </g>
  </svg>
);

interface WeddingBackgroundProps {
  /** Motion is calm and CSS-only when true (reduced motion / low-power) */
  calm: boolean;
  /** Phones get fewer particles and no foreground blur layer */
  light: boolean;
}

/**
 * Multi-layer cinematic backdrop.
 *
 *  1 base gradient · 2 moving light · 3 paper grain · 4 blurred botanical
 *  silhouettes · 5 dust · 6 petals · 7 blurred foreground leaves
 *
 * Each layer carries a `--depth`, which `useParallax` turns into mouse-driven
 * movement; without a fine pointer the same layers drift slowly on their own.
 */
export const WeddingBackground = ({ calm, light }: WeddingBackgroundProps) => {
  const floaters = useMemo(
    () =>
      calm
        ? []
        : buildFloaters(
            light
              ? comingSoonConfig.decor.petalsMobile
              : comingSoonConfig.decor.petalsDesktop,
          ),
    [calm, light],
  );

  const auto = calm ? "" : " cs-layer--auto";

  return (
    <div className="cs-bg" aria-hidden="true">
      {/* 1 — base wash */}
      <div className="cs-layer cs-bg__wash" style={{ "--depth": 6 } as React.CSSProperties} />

      {/* 1b — the couple, softly present behind everything */}
      <div className="cs-layer cs-bg__photo" style={{ "--depth": 9 } as React.CSSProperties}>
        <picture>
          <source
            srcSet={`${photo.webpSmall} 561w, ${photo.webp} 1122w`}
            sizes="100vw"
            type="image/webp"
          />
          <img
            src={photo.jpg}
            alt=""
            width={1122}
            height={1402}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <span className="cs-bg__veil" />
      </div>

      {/* 2 — travelling light */}
      <div className="cs-layer" style={{ "--depth": 12 } as React.CSSProperties}>
        <div className="cs-bg__glow" />
      </div>

      {/* 4 — blurred botanical silhouettes */}
      <div
        className={`cs-layer cs-bg__silhouettes${auto}`}
        style={{ "--depth": 22 } as React.CSSProperties}
      >
        <Silhouette className="cs-bg__sil cs-bg__sil--tl" />
        <Silhouette className="cs-bg__sil cs-bg__sil--br" />
      </div>

      {/* 5 + 6 — dust and petals */}
      <div
        className={`cs-layer${auto}`}
        style={{ "--depth": 34 } as React.CSSProperties}
      >
        {floaters.map((f) => (
          <span
            key={f.id}
            className={`cs-petal${f.dust ? " cs-petal--dust" : ""}`}
            style={
              {
                left: `${f.left}%`,
                "--size": `${f.size}px`,
                "--dur": `${f.duration}s`,
                "--delay": `${f.delay}s`,
                "--drift": `${f.drift}px`,
                "--peak": f.peak,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 7 — blurred foreground leaves for depth (skipped on phones) */}
      {!light && (
        <div
          className="cs-layer cs-bg__fore"
          style={{ "--depth": 52 } as React.CSSProperties}
        >
          <Silhouette className="cs-bg__leaf cs-bg__leaf--l" />
          <Silhouette className="cs-bg__leaf cs-bg__leaf--r" />
        </div>
      )}

      {/* 3 — paper grain, on top so the whole scene shares one texture */}
      <div className="cs-bg__grain" />
    </div>
  );
};

export default WeddingBackground;
