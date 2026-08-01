import { comingSoonConfig } from "../config";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { CoupleNames } from "./CoupleNames";
import { WeddingCountdown } from "./WeddingCountdown";

const { groom, bride, displayDate, dateLabel, copy, seo } = comingSoonConfig;

/**
 * The hero IS the page: eyebrow → names → tagline → date → countdown →
 * closing lines → game CTA, all composed inside a single viewport.
 * Entrance delays are staged for a short cinematic reveal.
 */
export const WeddingHero = ({ onOpenGame }: { onOpenGame: () => void }) => {
  const reduced = useReducedMotion();
  const { light } = useDeviceProfile();

  const rise = (d: number) =>
    reduced
      ? { className: "", style: undefined }
      : {
          className: "cs-reveal",
          style: { "--d": `${d}s` } as React.CSSProperties,
        };

  const namesDelay = reduced ? 0 : 0.45;
  const nameEnd = namesDelay + (groom.length + bride.length) * 0.055 + 0.5;

  return (
    <main className="cs-hero">
      <p className={`cs-eyebrow ${rise(0.15).className}`} style={rise(0.15).style}>
        {dateLabel}
      </p>

      <CoupleNames
        groom={groom}
        bride={bride}
        reduced={reduced}
        light={light}
        delay={namesDelay}
      />

      <p className={`cs-tagline ${rise(nameEnd).className}`} style={rise(nameEnd).style}>
        {copy.tagline}
      </p>

      <p
        className={`cs-date ${rise(nameEnd + 0.2).className}`}
        style={rise(nameEnd + 0.2).style}
      >
        <time className="cs-date__value" dateTime={seo.isoDate}>
          {displayDate}
        </time>
      </p>

      <div {...rise(nameEnd + 0.42)}>
        <WeddingCountdown />
      </div>

      <div className="cs-closing">
        <h2
          className={`cs-closing__main ${rise(nameEnd + 0.62).className}`}
          style={rise(nameEnd + 0.62).style}
        >
          {copy.comingSoon}
        </h2>
        <p
          className={`cs-closing__sub ${rise(nameEnd + 0.74).className}`}
          style={rise(nameEnd + 0.74).style}
        >
          {copy.supporting}
        </p>
      </div>

      {/* Reveal sits on the wrapper so the button keeps its hover transform */}
      <span
        className={`cs-cta-slot ${rise(nameEnd + 0.9).className}`}
        style={rise(nameEnd + 0.9).style}
      >
        <button type="button" className="cs-cta" onClick={onOpenGame}>
          <span className="cs-cta__heart" aria-hidden="true">
            ♡
          </span>
          {copy.gameCta}
        </button>
      </span>
    </main>
  );
};

export default WeddingHero;
