import React, { useEffect, useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { isEngagementOver, ENGAGEMENT_START, WEDDING_CONFIG } from "@/config/dates";
import { useCountdown } from "../../hooks/useCountdown";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate, formatTime } from "../../lib/format";
import type { Lang, TranslationKey } from "../../lib/translations";
import { Monogram } from "../shared/Monogram";
import { Px } from "../shared/Px";

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: TranslationKey }[] = [
  { key: "days", label: "countdown.days" },
  { key: "hours", label: "countdown.hours" },
  { key: "minutes", label: "countdown.minutes" },
  { key: "seconds", label: "countdown.seconds" },
];

/**
 * One name that fades in letter by letter (English) or as a whole word
 * (Hindi — splitting its conjuncts would break the shaping). `play`
 * starts the animation; after it has run once the name is simply shown, so
 * switching language never replays it.
 */
const AnimatedName: React.FC<{ text: string; lang: Lang; play: boolean; start: number }> = ({ text, lang, play, start }) => {
  const parts = lang === "en" ? Array.from(text) : [text];
  return (
    <span className="v2-name" lang={lang}>
      {parts.map((ch, i) => (
        <span
          key={i}
          className="v2-ch"
          style={{ animationDelay: `${(start + i * (lang === "en" ? 0.09 : 0)).toFixed(2)}s` }}
          data-play={play}
        >
          {ch}
        </span>
      ))}
    </span>
  );
};

interface HeroSectionProps {
  /** True once the opening screen has gone — starts the names animating in */
  ready: boolean;
  onEnter: () => void;
}

/**
 * Burgundy hero: monogram, the couple's names, the date, the engagement time
 * and a live countdown. Once `ready`, everything enters in sequence (see the
 * "HERO ENTRANCE" block in v2.css) and then settles into gentle ambient motion. Once the engagement is behind us,
 * the countdown swaps for a "We're Engaged!" status instead.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ ready, onEnter }) => {
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);
  // useCountdown's interval keeps ticking every second even after isComplete,
  // so this stays fresh — no separate timer needed to catch the moment
  // isEngagementOver() itself flips over.
  const { timeLeft } = useCountdown(ENGAGEMENT_START);
  const engagementOver = timeLeft.isComplete && isEngagementOver();

  // Names animate once; afterwards they're static so a language switch doesn't replay it.
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setPlayed(true), 2600);
    return () => clearTimeout(id);
  }, [ready]);
  const play = ready && !played;

  const a = first.name;
  const b = second.name;
  const startB = lang === "en" ? 0.75 + (a.length + 2) * 0.09 : 1.3;

  return (
    <section id="home" className={`v2-section v2-hero ${ready ? "is-ready" : ""}`} aria-labelledby="hero-title">
      {/* Parallax layers, back to front */}
      <Px name="eucalyptus-branch-left" speed={0.15} eager className="v2-hero-branch v2-hero-branch--left" />
      <Px name="eucalyptus-branch-right" speed={0.25} eager className="v2-hero-branch v2-hero-branch--right" />
      <Px name="gold-dust" speed={0.4} eager className="v2-hero-dust" />
      <Px name="soft-petals" speed={0.55} rotate={0.04} eager className="v2-hero-petals" />

      <div className={`v2-container v2-hero-inner ${ready ? "is-ready" : ""} ${played ? "is-played" : ""}`}>
        <Monogram size={72} className="v2-hero-monogram" />
        <T k="hero.eyebrow" as="p" className="v2-hero-eyebrow" />

        <h1 id="hero-title" className="v2-hero-names" aria-label={`${a} & ${b}`}>
          <span aria-hidden="true" className={play || played ? "is-on" : ""}>
            <AnimatedName text={a} lang={lang} play={play} start={0.55} />
            <span className="v2-amp v2-ch" data-play={play} style={{ animationDelay: `${(startB - 0.35).toFixed(2)}s` }}>
              &amp;
            </span>
            <AnimatedName text={b} lang={lang} play={play} start={startB} />
          </span>
        </h1>

        <div className="v2-hero-line" aria-hidden="true" />

        <p className="v2-hero-date" lang={lang}>
          {formatDate(WEDDING_CONFIG.engagement.date, lang)}
        </p>
        <p className="v2-hero-engagement" lang={lang}>
          <T k="hero.engagement" /> <span className="v2-nowrap">{formatTime(WEDDING_CONFIG.engagement.time, lang)}</span>
        </p>

        <div className="v2-countdown" role="timer" aria-live="off">
          {engagementOver ? (
            <div className="v2-countdown-engaged">
              <Heart size={22} className="v2-engaged-icon" aria-hidden="true" />
              <T k="hero.engagedTitle" as="p" className="v2-engaged-title" />
              <T k="hero.engagedSubtitle" as="p" className="v2-engaged-subtitle" />
            </div>
          ) : timeLeft.isComplete ? (
            <T k="hero.countdownDone" as="p" className="v2-countdown-done" />
          ) : (
            <>
              <T k="hero.countdownLabel" as="p" className="v2-countdown-label" />
              <div className="v2-countdown-grid">
                {UNITS.map((u) => (
                  <div key={u.key} className="v2-countdown-cell">
                    {/* keyed by value so each change replays the tick animation */}
                    <span key={timeLeft[u.key]} className="v2-countdown-num">
                      {String(timeLeft[u.key]).padStart(2, "0")}
                    </span>
                    <T k={u.label} className="v2-countdown-unit" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button type="button" className="v2-scroll-cue" onClick={onEnter}>
          <T k="hero.scroll" />
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
