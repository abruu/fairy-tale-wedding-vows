import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { MailOpen } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/dates";
import { CrossMotif } from "../shared/CrossMotif";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface OpeningExperienceProps {
  onComplete: () => void;
  /** Starts the background song. Must be called synchronously in the tap handler. */
  onStart?: () => void;
  /** Fires as the reveal's light bloom peaks — the cue for the hero's entrance. */
  onReveal?: () => void;
}

type Phase = "start" | "playing";

/**
 * How long the video gets, from the Start tap, to actually begin playing.
 * Counted from the tap, not from mount. 3s was too tight: on a slow mobile
 * connection the file had not buffered by then, so those guests skipped
 * straight to the hero and never saw the intro. The Skip button (shown after
 * SKIP_DELAY_MS) lets anyone impatient leave sooner.
 */
const POSTER_FALLBACK_MS = 7000;
const SKIP_DELAY_MS = 1000;
const MOBILE_BREAKPOINT = 767;
/** First frame of the intro video, so the start screen paints instantly. */
const INTRO_POSTER = "/video/opening-poster.webp";
/**
 * Stall guard, armed when playback starts (and re-armed on every `playing`,
 * e.g. after a re-buffer). Playback can start and then stall mid-way — a slow
 * connection re-buffering, the tab losing focus, iOS pausing playback — after
 * which no further `timeupdate`/`ended` event ever arrives. Without this,
 * that stall left visitors stuck on the intro forever instead of reaching the
 * site. Counted from playback start (not the tap) so a video that took a few
 * seconds to load still gets to play through to the reveal.
 */
const STALL_SLACK_MS = 3000;
const stallCeilingMs = () => WEDDING_CONFIG.media.introRevealAtSeconds * 1000 + STALL_SLACK_MS;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

/**
 * Opening experience — a sealed envelope (the intro video's own first frame,
 * paused) with the couple's names and an "open" CTA. The wax seal itself is a
 * tap target. On tap the copy steps aside, the envelope settles centre-stage
 * and the video plays (muted — it carries no audio of its own) while the
 * background song starts in the same gesture. A thin gold line tracks
 * playback to the reveal. It replays in full on every load; nothing is
 * remembered.
 *
 * The reveal has exactly one owner: `triggerComplete`, guarded by
 * `revealedRef` so whichever cause happens first (the 4s cue, the video
 * ending, an error, or the hard ceiling) wins and the rest no-op. It
 * runs a glow-of-light bloom, then fades the whole scene out — no curtain
 * wipe — to uncover the Hero, which is already mounted beneath this fixed
 * overlay.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete, onStart, onReveal }) => {
  const [phase, setPhase] = useState<Phase>("start");
  const [showSkip, setShowSkip] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const phaseRef = useRef<Phase>("start");
  const revealedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hardCeilingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    if (hardCeilingTimerRef.current) clearTimeout(hardCeilingTimerRef.current);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  /** The single entry point to the reveal. Safe to call from any trigger. */
  const triggerComplete = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    clearTimers();
    videoRef.current?.pause();
    setIsRevealing(true);

    if (prefersReduced || !overlayRef.current || !glowRef.current) {
      onReveal?.();
      onComplete();
      return;
    }

    gsap
      .timeline({ onComplete })
      // Huge glow of light blooms over the paused final frame…
      .to(glowRef.current, { opacity: 1, scale: 1.4, duration: 0.55, ease: "power2.out" })
      // Hero starts opening underneath while the light is at its brightest.
      .call(() => onReveal?.(), undefined, 0.45)
      // …then the glow fades while the whole scene fades with it, uncovering Hero.
      .to(glowRef.current, { opacity: 0, duration: 0.55, ease: "power1.in" }, "+=0.05")
      .to(overlayRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "<");
  }, [clearTimers, onComplete, onReveal, prefersReduced]);

  /**
   * The copy clears out and the envelope takes the stage. On the landscape
   * layout the card glides from beside the copy column to dead centre and
   * grows a little; on phones it is already full-bleed, so only the copy
   * (split above/below the seal) drifts apart and fades.
   */
  const stepAside = useCallback(() => {
    const card = cardRef.current;
    const copy = copyRef.current;
    if (!card || !copy) return;
    const groups = copy.querySelectorAll<HTMLElement>(".v2-op-group");
    const isCardLayout = getComputedStyle(card).position === "relative";

    const tl = gsap.timeline();
    tl.to(groups[0] ?? copy, { opacity: 0, y: isCardLayout ? 0 : -24, x: isCardLayout ? -32 : 0, duration: 0.55, ease: "power2.in" }, 0);
    if (groups[1]) {
      tl.to(groups[1], { opacity: 0, y: isCardLayout ? 0 : 24, x: isCardLayout ? -32 : 0, duration: 0.55, ease: "power2.in" }, 0.05);
    }
    if (isCardLayout) {
      const r = card.getBoundingClientRect();
      const dx = window.innerWidth / 2 - (r.left + r.width / 2);
      const scale = Math.min(1.08, (window.innerHeight * 0.94) / r.height);
      tl.to(card, { x: dx, scale, duration: 1.1, ease: "power3.inOut" }, 0.1);
    }
    if (backdropRef.current) {
      tl.to(backdropRef.current, { filter: "blur(28px) saturate(1.2) brightness(0.62)", duration: 2.5, ease: "sine.inOut" }, 0.3);
    }
  }, []);

  const handleStart = useCallback(() => {
    if (phaseRef.current !== "start") return;
    phaseRef.current = "playing";

    const vid = videoRef.current;
    if (!vid) {
      triggerComplete();
      return;
    }

    // The song is started synchronously here — no await, no state flush in
    // between — so the browser still credits this to the user gesture and
    // allows it to play with sound. The video itself is muted, so its own
    // play() carries no gesture requirement.
    const playPromise = vid.play();
    onStart?.();

    setPhase("playing");
    if (!prefersReduced) stepAside();
    skipTimerRef.current = setTimeout(() => setShowSkip(true), SKIP_DELAY_MS);
    fallbackTimerRef.current = setTimeout(() => {
      console.warn(`[intro] video did not start within ${POSTER_FALLBACK_MS / 1000}s — skipping to hero`);
      triggerComplete();
    }, POSTER_FALLBACK_MS);

    void playPromise?.catch((err: unknown) => {
      console.warn("[intro] video play() rejected:", err);
      triggerComplete();
    });
  }, [onStart, prefersReduced, stepAside, triggerComplete]);

  /** Playback genuinely started — the poster fallback is no longer needed. */
  const handlePlaying = useCallback(() => {
    if (revealedRef.current) return;
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    // (Re-)arm the stall guard — see STALL_SLACK_MS.
    if (hardCeilingTimerRef.current) clearTimeout(hardCeilingTimerRef.current);
    hardCeilingTimerRef.current = setTimeout(() => {
      console.warn("[intro] playback stalled — forcing reveal");
      triggerComplete();
    }, stallCeilingMs());
    // Drive the progress line from the video clock itself (timeupdate only
    // fires ~4×/s, which made it visibly step).
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const vid = videoRef.current;
      const bar = progressRef.current;
      if (vid && bar) {
        const p = Math.min(1, vid.currentTime / WEDDING_CONFIG.media.introRevealAtSeconds);
        bar.style.transform = `scaleX(${p})`;
      }
      if (!revealedRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [triggerComplete]);

  /** The one 4-second cue. No other timeupdate logic exists. */
  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.currentTime >= WEDDING_CONFIG.media.introRevealAtSeconds) triggerComplete();
  }, [triggerComplete]);

  const handleVideoError = useCallback(() => {
    console.warn("[intro] video failed to load:", videoRef.current?.currentSrc);
    triggerComplete();
  }, [triggerComplete]);

  useEffect(() => {
    if (prefersReduced) triggerComplete();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;
  const introSrc = isMobile
    ? WEDDING_CONFIG.media.introVideoMobile
    : WEDDING_CONFIG.media.introVideoDesktop;
  const onStartScreen = phase === "start";

  return (
    /*
     * The whole start screen is the tap target, matching "tap to begin" — and
     * it keeps the intro reachable even if a decorative layer ends up over the
     * button again, which is exactly how the pulse ring broke it once.
     */
    <div
      ref={overlayRef}
      onClick={onStartScreen ? handleStart : undefined}
      className={`v2-op ${onStartScreen ? "v2-op--start" : "v2-op--playing"}`}
      style={
        isRevealing && prefersReduced ? { opacity: 0, transition: "opacity 0.4s ease" } : undefined
      }
      role="dialog"
      aria-label={`${WEDDING_CONFIG.couple.displayNames} — invitation`}
      aria-hidden={isRevealing || undefined}
    >
      <div ref={backdropRef} className="v2-op-backdrop" aria-hidden="true" />

      <div className="v2-op-layout">
        <div ref={cardRef} className="v2-op-card">
          <div className="v2-op-stage">
            {/*
              The video itself IS the start-screen visual; `poster` is its own
              first frame so something paints before the file arrives. Muted:
              it carries no audio — the background song (started in
              handleStart) is the only sound.
            */}
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              poster={INTRO_POSTER}
              onCanPlay={() => setVideoReady(true)}
              onPlaying={handlePlaying}
              onTimeUpdate={handleTimeUpdate}
              onEnded={triggerComplete}
              onError={handleVideoError}
            >
              <source src={introSrc} type="video/mp4" />
            </video>
            <div className="v2-op-scrim" aria-hidden="true" />
            {/* Pinned over the wax seal in the footage — "break the seal". */}
            <button
              type="button"
              className="v2-op-seal"
              onClick={handleStart}
              aria-label="Break the seal and open the invitation"
              tabIndex={onStartScreen ? 0 : -1}
            />
          </div>
        </div>

        <motion.div
          ref={copyRef}
          className="v2-op-copy"
          variants={prefersReduced ? undefined : container}
          initial={prefersReduced ? undefined : "hidden"}
          animate={prefersReduced ? undefined : "show"}
          aria-hidden={!onStartScreen || undefined}
        >
          <div className="v2-op-group">
            <motion.div variants={item} className="v2-op-cross" aria-hidden="true">
              <CrossMotif size={28} />
            </motion.div>
            <motion.p variants={item} className="v2-op-eyebrow">
              {WEDDING_CONFIG.videoIntro.topFlourish}
            </motion.p>
            <motion.h1 variants={item} className="v2-op-names">
              <span>{WEDDING_CONFIG.couple.shortName1}</span>
              <span className="v2-op-amp">&amp;</span>
              <span>{WEDDING_CONFIG.couple.shortName2}</span>
            </motion.h1>
          </div>

          <div className="v2-op-group">
            <motion.div variants={item} className="v2-op-rule v2-op-desktop-only" aria-hidden="true" />
            <motion.p variants={item} className="v2-op-date">
              {formatDate(WEDDING_CONFIG.dates[WEDDING_CONFIG.invite.featured.dateKey])}
            </motion.p>
            <motion.p variants={item} className="v2-op-venue">
              {WEDDING_CONFIG.events[WEDDING_CONFIG.invite.featured.eventKey].venueShort}
            </motion.p>
            <motion.div variants={item}>
              <button
                type="button"
                className="v2-btn v2-btn-gold v2-op-cta"
                onClick={handleStart}
                tabIndex={onStartScreen ? 0 : -1}
              >
                <MailOpen size={16} strokeWidth={1.6} aria-hidden="true" />
                {WEDDING_CONFIG.videoIntro.ctaText}
              </button>
            </motion.div>
            <motion.p
              variants={item}
              className={`v2-op-hint ${videoReady ? "v2-op-desktop-only" : "v2-op-hint--loading"}`}
              aria-live="polite"
            >
              {videoReady ? "or tap the wax seal" : "Preparing your invitation…"}
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="v2-op-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      {/* Bloom of light — matches the glow inside the opened envelope. */}
      <div ref={glowRef} className="v2-op-glow" aria-hidden="true" />

      {showSkip && !isRevealing && (
        <button
          type="button"
          className="v2-op-skip"
          onClick={triggerComplete}
          aria-label="Skip intro"
        >
          Skip
        </button>
      )}
    </div>
  );
};
