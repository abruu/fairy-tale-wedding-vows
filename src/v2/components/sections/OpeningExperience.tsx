import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate } from "../../lib/format";
import { OPENER_PHOTO } from "../../lib/gallery";

interface OpeningExperienceProps {
  /** Starts the background song. Called synchronously inside the tap, so the browser allows sound. */
  onStart: () => void;
  /** Called as the card starts lifting away (the hero begins animating in) */
  onOpening: () => void;
  /** Called once the overlay is fully out of the way */
  onComplete: () => void;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SWEEP: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Opening timeline, seconds after the tap */
const T_PART = 0.5; // doors start to part (copy has faded by now)
const D_PART = 1.25;

/** Deterministic 0–1 pseudo-random, so the effects lay out identically every render. */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const SPARKS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(rand(i, 1) * 100).toFixed(1)}%`,
  top: `${(rand(i, 2) * 100).toFixed(1)}%`,
  size: 2 + rand(i, 3) * 3,
  dur: 3.5 + rand(i, 4) * 4,
  delay: rand(i, 5) * 6,
}));
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(rand(i, 6) * 100).toFixed(1)}%`,
  size: 10 + rand(i, 7) * 12,
  dur: 11 + rand(i, 8) * 9,
  delay: -rand(i, 9) * 20, // negative: already mid-fall on first paint
  sway: 20 + rand(i, 10) * 50,
  tone: i % 3,
}));
/** 72 tick marks for the ring around the "&" medallion */
const TICKS = Array.from({ length: 72 }, (_, i) => i);

const rise = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE_OUT } },
});
const letters = (delayChildren: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren } },
});
const letter: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE_OUT } },
};

/**
 * One half of the couple's photo, for a door to carry. Both halves are the same
 * full-viewport image (see .v2-intro-photo), each clipped by its own door, so
 * together they read as a single photograph split down the seam. Fades in once
 * loaded, over the door's burgundy, so a slow connection never shows a blank.
 */
const DoorPhoto: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  // A cached image can finish before React attaches onLoad
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth) setLoaded(true);
  }, []);
  return (
    <div className="v2-intro-photo" aria-hidden="true">
      <img
        ref={ref}
        className={loaded ? "is-loaded" : ""}
        src={OPENER_PHOTO.src}
        srcSet={OPENER_PHOTO.srcSet}
        sizes="100vw"
        alt=""
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

/**
 * Opening screen — a split invitation. A photo of the couple fills the screen
 * beneath a burgundy wash, divided by a hairline seam into two doors: the
 * bride's name on the left, the groom's on the right, joined by an "&"
 * medallion on the seam. A rotating "Tap to open" seal sits beneath.
 *
 * On open the copy fades, then the doors part sideways (each name and its half
 * of the photo travelling with its door) to uncover the hero, already mounted
 * underneath. Reduced-motion visitors never mount this — see WeddingV2.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onStart, onOpening, onComplete }) => {
  const [opening, setOpening] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { lang, t } = useLang();
  const [first, second] = couplePeople(lang);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // The page underneath must not scroll while the opening screen is up.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const open = useCallback(() => {
    if (opening) return;
    // Must run synchronously in the tap handler (no await before it) or the
    // browser blocks audible playback.
    onStart();
    setOpening(true);
    window.setTimeout(onOpening, T_PART * 1000);
  }, [opening, onStart, onOpening]);

  // English names arrive letter by letter; Hindi as whole words, since
  // splitting its conjuncts would break the shaping.
  const split = (text: string) => (lang === "en" ? Array.from(text) : [text]);

  const [y, m, d] = WEDDING_CONFIG.engagement.date.split("-");
  const copyExit = { opacity: 0, y: -14, transition: { duration: 0.45, ease: EASE_OUT } };
  const part = { duration: D_PART, delay: T_PART, ease: EASE_SWEEP };

  const side = (person: typeof first, dir: -1 | 1) => (
    <motion.div
      className={`v2-intro-side ${dir < 0 ? "is-left" : "is-right"}`}
      animate={{ x: opening ? `${dir * 52}vw` : 0 }}
      transition={part}
    >
      <motion.span
        className="v2-intro-role"
        variants={rise(1.5)}
        animate={opening ? copyExit : "show"}
        initial="hidden"
      >
        <T k={`couple.${person.role}`} />
      </motion.span>
      <motion.span
        className="v2-intro-name"
        lang={lang}
        aria-hidden="true"
        initial="hidden"
        animate="show"
        variants={letters(dir < 0 ? 0.7 : 1.1)}
      >
        {split(person.name).map((c, i) => (
          <motion.span key={i} variants={letter}>
            {c}
          </motion.span>
        ))}
      </motion.span>
    </motion.div>
  );

  return (
    <motion.div
      className={`v2-intro ${opening ? "is-opening" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${first.nameEn} & ${second.nameEn}`}
      // Lenis must ignore wheel/touch over the overlay, or it scrolls the page behind
      data-lenis-prevent
      onClick={open}
    >
      {/* The two doors */}
      <motion.div
        className="v2-intro-door is-left"
        aria-hidden="true"
        animate={{ x: opening ? "-101%" : 0 }}
        transition={part}
        onAnimationComplete={() => {
          if (opening) onComplete();
        }}
      >
        <DoorPhoto />
      </motion.div>
      <motion.div className="v2-intro-door is-right" aria-hidden="true" animate={{ x: opening ? "101%" : 0 }} transition={part}>
        <DoorPhoto />
      </motion.div>

      {/* Ambient effects: a pulsing glow on the seam, twinkling gold dust, drifting petals */}
      <motion.div className="v2-intro-fx" aria-hidden="true" animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.5 }}>
        <span className="v2-intro-glow" />
        {SPARKS.map((p, i) => (
          <i
            key={i}
            className="v2-intro-spark"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          />
        ))}
        {PETALS.map((p, i) => (
          <i
            key={i}
            className={`v2-intro-petal tone-${p.tone}`}
            style={{ left: p.left, width: p.size, height: p.size * 1.5, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, ["--sway" as string]: `${p.sway}px` }}
          />
        ))}
      </motion.div>

      {/* Hairline seam where the doors meet, with a spark travelling along it */}
      <motion.span
        className="v2-intro-seam"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: opening ? 0 : 1, opacity: opening ? 0 : 1 }}
        transition={opening ? { duration: 0.4 } : { duration: 1.8, delay: 0.3, ease: EASE_OUT }}
      >
        <i className="v2-intro-seam-spark" />
      </motion.span>

      <div className="v2-intro-content">
        <motion.div className="v2-intro-corners" initial="hidden" animate={opening ? copyExit : "show"} variants={rise(0.4)}>
          <T k="intro.saveTheDate" className="v2-intro-corner" />
          <span className="v2-intro-corner" lang="en">
            {d} · {m} · {y}
          </span>
        </motion.div>

        <motion.p initial="hidden" animate={opening ? copyExit : "show"} variants={rise(0.6)} className="v2-intro-eyebrow">
          <T k="intro.eyebrow" />
        </motion.p>

        {/* Names + "&" medallion on one row; the names travel with their doors */}
        <div className="v2-intro-pair">
          {side(first, -1)}
          <motion.span
            className="v2-intro-amp"
            lang="en"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={opening ? { opacity: 0, scale: 1.3, transition: { duration: 0.4 } } : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.4, ease: EASE_OUT }}
          >
            {/* Slowly turning ring of tick marks, with a counter-turning dashed ring inside */}
            <svg className="v2-intro-amp-ring" viewBox="-50 -50 100 100">
              {TICKS.map((i) => (
                <line key={i} x1="0" y1={i % 6 === 0 ? -45 : -47} x2="0" y2="-49" transform={`rotate(${i * 5})`} />
              ))}
            </svg>
            <svg className="v2-intro-amp-ring is-inner" viewBox="-50 -50 100 100">
              <circle r="38" />
            </svg>
            <span>&amp;</span>
          </motion.span>
          {side(second, 1)}
        </div>

        <motion.p initial="hidden" animate={opening ? copyExit : "show"} variants={rise(2.05)} className="v2-intro-date" lang={lang}>
          {formatDate(WEDDING_CONFIG.engagement.date, lang)}
        </motion.p>

        {/* Seal-style button: rotating ring of text around an arrow */}
        <motion.div
          className="v2-intro-cta-wrap"
          initial="hidden"
          animate={opening ? { opacity: 0, transition: { duration: 0.3 } } : "show"}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 2.35, ease: EASE_OUT } },
          }}
        >
          <button
            ref={buttonRef}
            type="button"
            className="v2-intro-cta"
            aria-label={t("intro.open")}
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            <svg className="v2-intro-cta-ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="v2-intro-circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
              </defs>
              <text>
                <textPath href="#v2-intro-circle" textLength="250" lengthAdjust="spacing">
                  TAP TO OPEN ✦ TAP TO OPEN ✦
                </textPath>
              </text>
            </svg>
            <span className="v2-intro-cta-core" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
          </button>
          {lang === "hi" && <T k="intro.open" as="p" className="v2-intro-cta-caption" />}
        </motion.div>
      </div>
    </motion.div>
  );
};
