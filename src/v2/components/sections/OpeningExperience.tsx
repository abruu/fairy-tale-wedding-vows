import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, DoorOpen, Volume2 } from "lucide-react";
import { WEDDING_CONFIG, asset } from "@/config/dates";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate } from "../../lib/format";
import { fadeRise, staggerGroup } from "../../lib/motion";

interface OpeningExperienceProps {
  onComplete: () => void;
  /** Starts the background song. Must be called synchronously in the tap handler. */
  onStart: () => void;
}

type Phase = "start" | "playing" | "revealing";

/** The video never started playing within this long after the tap → go straight in. */
const START_FALLBACK_MS = 3500;
const SKIP_DELAY_MS = 1000;
/**
 * Absolute upper bound from the tap, cleared only by the reveal itself.
 * Playback can start and then stall (slow network re-buffering, a
 * backgrounded tab) with no further timeupdate/ended event ever arriving;
 * without this a visitor could be stuck on the doors forever.
 */
const HARD_CEILING_MS = (WEDDING_CONFIG.intro.revealAtSeconds + 3) * 1000;

/** Gentle floating jasmine petals — purely decorative, CSS-driven (no scroll link). */
const PETALS = [
  { top: "10%", left: "12%", size: 22, delay: "-1s", duration: "11s" },
  { top: "18%", left: "82%", size: 16, delay: "-4s", duration: "9s" },
  { top: "62%", left: "6%", size: 18, delay: "-7s", duration: "13s" },
  { top: "70%", left: "90%", size: 24, delay: "-2.5s", duration: "10s" },
  { top: "40%", left: "94%", size: 14, delay: "-6s", duration: "12s" },
  { top: "85%", left: "40%", size: 18, delay: "-3.5s", duration: "8.5s" },
];

/**
 * Opening screen: the temple-door video's first frame with the couple's names
 * and a "Tap to open" button. The tap plays the (muted) video and starts the
 * background song in the same gesture (`onStart`), so both begin together.
 * At `intro.revealAtSeconds` a warm glow blooms and the overlay fades away to
 * uncover the hero, which is already mounted underneath.
 *
 * The reveal has exactly one owner — `reveal()`, guarded by `revealedRef` — so
 * whichever cause arrives first (the cue time, the video ending, an error, the
 * start fallback, the hard ceiling or Skip) wins and the rest no-op.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete, onStart }) => {
  const [phase, setPhase] = useState<Phase>("start");
  const [showSkip, setShowSkip] = useState(false);
  const phaseRef = useRef<Phase>("start");
  const revealedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const startFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (startFallbackRef.current) clearTimeout(startFallbackRef.current);
  }, []);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    phaseRef.current = "revealing";
    clearTimers();
    videoRef.current?.pause();
    setPhase("revealing");
  }, [clearTimers]);

  const handleStart = useCallback(() => {
    if (phaseRef.current !== "start") return;
    phaseRef.current = "playing";
    const vid = videoRef.current;

    // The song is started synchronously here — no await, no state flush in
    // between — so the browser still credits this to the user gesture and
    // allows it to play with sound. The video itself is muted, so its own
    // play() carries no gesture requirement of its own.
    onStart();

    if (!vid) {
      reveal();
      return;
    }
    setPhase("playing");
    timersRef.current.push(setTimeout(() => setShowSkip(true), SKIP_DELAY_MS));
    timersRef.current.push(setTimeout(reveal, HARD_CEILING_MS));
    startFallbackRef.current = setTimeout(reveal, START_FALLBACK_MS);
    vid.play().catch(reveal);
  }, [onStart, reveal]);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (vid && vid.currentTime >= WEDDING_CONFIG.intro.revealAtSeconds) reveal();
  }, [reveal]);

  // (Reduced-motion visitors never mount this — see WeddingV2.)
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
    return clearTimers;
  }, [clearTimers]);

  // The page underneath must not scroll while the doors are closed.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const revealing = phase === "revealing";
  const onStartScreen = phase === "start";

  return (
    <motion.div
      className={`v2-intro ${onStartScreen ? "is-start" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${first.nameEn} & ${second.nameEn}`}
      // Lenis must ignore wheel/touch over the overlay, or it scrolls the page behind
      data-lenis-prevent
      onClick={onStartScreen ? handleStart : undefined}
      initial={{ opacity: 1 }}
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: 0.9, delay: revealing ? 0.45 : 0, ease: [0.65, 0.05, 0.36, 1] }}
      onAnimationComplete={() => {
        if (revealedRef.current) onComplete();
      }}
    >
      {/* `muted`: the clip has no soundtrack of its own — Ullam-Paadum plays alongside it.
          nudging currentTime paints the first frame while paused */}
      <video
        ref={videoRef}
        className="v2-intro-video"
        src={WEDDING_CONFIG.intro.video}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 0.01;
        }}
        onPlaying={() => startFallbackRef.current && clearTimeout(startFallbackRef.current)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={reveal}
        onError={reveal}
      />
      <div className="v2-intro-shade" aria-hidden="true" />
      <div className="v2-intro-vignette" aria-hidden="true" />

      {/* Ambient jasmine petals drifting behind the text — pure CSS, no scroll link */}
      {PETALS.map((p, i) => (
        <img
          key={i}
          className="v2-intro-petal"
          src={asset("jasmine-petals")}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Warm light blooming out of the open doors at the reveal */}
      <motion.div
        className="v2-intro-glow"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.2 }}
        animate={revealing ? { opacity: [0, 1, 0], scale: [0.2, 1.3, 1.6] } : { opacity: 0, scale: 0.2 }}
        transition={{ duration: 1.3, times: [0, 0.45, 1], ease: "easeOut" }}
      />

      <motion.div
        className="v2-intro-content"
        variants={staggerGroup(0.12, 0.2)}
        initial="hidden"
        animate={onStartScreen ? "show" : "exit"}
      >
        <div className="v2-intro-top">
          <motion.p variants={fadeRise} className="v2-intro-invocation" lang="ml">
            ഓം ഗണപതയേ നമഃ
          </motion.p>

          <motion.div variants={fadeRise} className="v2-intro-ornament" aria-hidden="true">
            <span />
            <svg width="12" height="18" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.94 3.68 2 6.5 2c1.87 0 3.715.99 4.925 2.525A6.05 6.05 0 0 1 16.5 2C19.32 2 22 3.94 22 7.191c0 4.105-5.37 8.863-11 14.402z" fill="currentColor" />
            </svg>
            <span />
          </motion.div>

          <motion.p variants={fadeRise} className="v2-intro-eyebrow">
            <T k="intro.eyebrow" />
          </motion.p>

          <motion.h1 variants={fadeRise} className="v2-intro-names">
            <span lang="ml">
              {first.nameMl} <span className="v2-amp">&amp;</span> {second.nameMl}
            </span>
            <span lang="en">
              {first.nameEn} <span className="v2-amp">&amp;</span> {second.nameEn}
            </span>
          </motion.h1>

          <motion.p variants={fadeRise} className="v2-intro-date" lang={lang}>
            {formatDate(WEDDING_CONFIG.weddingDate, lang)}
          </motion.p>
        </div>

        <motion.div variants={fadeRise} className="v2-intro-bottom">
          <button
            ref={buttonRef}
            type="button"
            className="v2-btn v2-btn--gold v2-intro-cta"
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
          >
            <DoorOpen size={19} aria-hidden="true" />
            <T k="intro.open" />
          </button>

          <p className="v2-intro-soundnote">
            <Volume2 size={14} aria-hidden="true" />
            <T k="intro.soundNote" />
          </p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showSkip && !revealing && (
          <motion.button
            type="button"
            className="v2-intro-skip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              reveal();
            }}
          >
            <T k="intro.skip" />
            <ChevronRight size={15} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
