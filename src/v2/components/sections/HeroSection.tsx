import React from "react";
import { ChevronDown, Heart } from "lucide-react";
import { isWeddingOver, MUHURTHAM_START, WEDDING_CONFIG } from "@/config/dates";
import { useCountdown } from "../../hooks/useCountdown";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate, formatTime } from "../../lib/format";
import type { TranslationKey } from "../../lib/translations";
import { Px } from "../shared/Px";

/** Jasmine petals scattered over the hero — position, size, speed, spin. */
const PETALS = [
  { top: "14%", left: "8%", w: 34, speed: 0.6, rotate: 0.05 },
  { top: "22%", left: "84%", w: 26, speed: 0.55, rotate: -0.05 },
  { top: "40%", left: "16%", w: 22, speed: 0.65, rotate: 0.05 },
  { top: "52%", left: "78%", w: 38, speed: 0.6, rotate: -0.05 },
  { top: "8%", left: "56%", w: 20, speed: 0.58, rotate: 0.05 },
  { top: "66%", left: "6%", w: 28, speed: 0.62, rotate: -0.05 },
  { top: "34%", left: "92%", w: 24, speed: 0.6, rotate: 0.05 },
];

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: TranslationKey }[] = [
  { key: "days", label: "countdown.days" },
  { key: "hours", label: "countdown.hours" },
  { key: "minutes", label: "countdown.minutes" },
  { key: "seconds", label: "countdown.seconds" },
];

interface HeroSectionProps {
  onEnter: () => void;
}

/**
 * Ivory → maroon hero: Ganapathi invocation, names in both scripts, the
 * Gregorian + Kollavarsham dates and a live countdown to the muhurtham.
 * Once every celebration (through the reception) is behind us, the
 * countdown card swaps for a "We're Married!" status instead.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onEnter }) => {
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);
  // useCountdown's interval keeps ticking every second even after isComplete,
  // so this stays fresh — no separate timer needed to catch the moment
  // isWeddingOver() itself flips over.
  const { timeLeft } = useCountdown(MUHURTHAM_START);
  const weddingOver = timeLeft.isComplete && isWeddingOver();

  return (
    <section id="home" className="v2-section v2-hero" aria-labelledby="hero-title">
      {/* Parallax layers, back to front */}
      <Px name="gopuram" speed={0.1} eager x="-50%" className="v2-hero-gopuram" />
      <Px name="nilavilakku" speed={0.25} eager className="v2-hero-lamp v2-hero-lamp--left" />
      <Px name="nilavilakku" speed={0.25} eager className="v2-hero-lamp v2-hero-lamp--right" />
      <Px name="marigold-garland" speed={0.4} eager x="-50%" className="v2-hero-garland" />
      <Px name="coconut-fronds" speed={0.5} eager className="v2-hero-fronds v2-hero-fronds--left" />
      <Px name="coconut-fronds" speed={0.5} eager flip="x" className="v2-hero-fronds v2-hero-fronds--right" />
      {PETALS.map((p, i) => (
        <Px
          key={i}
          name="jasmine-petals"
          speed={p.speed}
          rotate={p.rotate}
          eager
          className="v2-petal"
          style={{ top: p.top, left: p.left, width: p.w, animationDelay: `${i * -1.3}s` }}
        />
      ))}

      <div className="v2-container v2-hero-inner">
        <p className="v2-invocation" lang="ml">
          ഓം ഗണപതയേ നമഃ
        </p>
        <T k="hero.eyebrow" as="p" className="v2-hero-eyebrow" />

        <h1 id="hero-title" className="v2-hero-names">
          <span className="v2-hero-names-ml" lang="ml">
            {first.nameMl} <span className="v2-amp">&amp;</span> {second.nameMl}
          </span>
          <span className="v2-hero-names-en" lang="en">
            {first.nameEn} <span className="v2-amp">&amp;</span> {second.nameEn}
          </span>
        </h1>

        <div className="v2-hero-dates">
          <p lang={lang}>
            {formatDate(WEDDING_CONFIG.weddingDate, lang)} ·{" "}
            <span className="v2-nowrap">{formatTime(WEDDING_CONFIG.muhurthamTime, lang)}</span>
          </p>
          <p className="v2-hero-kollam" lang="ml">
            {WEDDING_CONFIG.malayalamDate_ml}
          </p>
          {lang === "en" && <p className="v2-hero-kollam-en">{WEDDING_CONFIG.malayalamDate_en}</p>}
        </div>

        <div className="v2-countdown" role="timer" aria-live="off">
          {weddingOver ? (
            <div className="v2-countdown-married">
              <Heart size={26} className="v2-married-icon" fill="currentColor" aria-hidden="true" />
              <T k="hero.marriedTitle" as="p" className="v2-married-title" />
              <T k="hero.marriedSubtitle" as="p" className="v2-married-subtitle" />
            </div>
          ) : timeLeft.isComplete ? (
            <T k="hero.countdownDone" as="p" className="v2-countdown-done" />
          ) : (
            <>
              <T k="hero.countdownLabel" as="p" className="v2-countdown-label" />
              <div className="v2-countdown-grid">
                {UNITS.map((u) => (
                  <div key={u.key} className="v2-countdown-cell">
                    <span className="v2-countdown-num">{String(timeLeft[u.key]).padStart(2, "0")}</span>
                    <T k={u.label} className="v2-countdown-unit" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button type="button" className="v2-scroll-cue" onClick={onEnter}>
          <T k="hero.scroll" />
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
