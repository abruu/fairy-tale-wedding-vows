import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { WEDDING_CONFIG } from "@/config/dates";
import { CrossMotif } from "../shared/CrossMotif";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface OpeningExperienceProps {
  onComplete: () => void;
  /** Starts the background song. Must be called synchronously in the tap handler. */
  onStart?: () => void;
}

type Phase = "start" | "playing";

/** Counted from the Start tap, not from mount. */
const POSTER_FALLBACK_MS = 3000;
const SKIP_DELAY_MS = 1000;
const MOBILE_BREAKPOINT = 767;

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
 * Opening experience — a Start screen showing the intro video's own first
 * frame (paused) + CTA. On tap the video plays (muted — it carries no audio
 * of its own) and the background song starts in the same gesture. It
 * replays in full on every load; nothing is remembered.
 *
 * The reveal has exactly one owner: `triggerComplete`, guarded by
 * `revealedRef` so whichever of the three possible causes (the 4s cue, the
 * video ending, an error/stall) happens first wins and the rest no-op. It
 * runs a glow-of-light bloom, then fades the whole scene out — no curtain
 * wipe — to uncover the Hero, which is already mounted beneath this fixed
 * overlay.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete, onStart }) => {
  const [phase, setPhase] = useState<Phase>("start");
  const [showSkip, setShowSkip] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const phaseRef = useRef<Phase>("start");
  const revealedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
  }, []);

  /** The single entry point to the reveal. Safe to call from any trigger. */
  const triggerComplete = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    clearTimers();
    videoRef.current?.pause();
    setIsRevealing(true);

    if (prefersReduced || !overlayRef.current || !glowRef.current) {
      onComplete();
      return;
    }

    gsap
      .timeline({ onComplete })
      // Huge glow of light blooms over the paused final frame…
      .to(glowRef.current, { opacity: 1, scale: 1.4, duration: 0.55, ease: "power2.out" })
      // …then the glow fades while the whole scene fades with it, uncovering Hero.
      .to(glowRef.current, { opacity: 0, duration: 0.55, ease: "power1.in" }, "+=0.05")
      .to(overlayRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "<");
  }, [clearTimers, onComplete, prefersReduced]);

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
    skipTimerRef.current = setTimeout(() => setShowSkip(true), SKIP_DELAY_MS);
    fallbackTimerRef.current = setTimeout(() => {
      console.warn("[intro] video did not start within 3s — skipping to hero");
      triggerComplete();
    }, POSTER_FALLBACK_MS);

    void playPromise?.catch((err: unknown) => {
      console.warn("[intro] video play() rejected:", err);
      triggerComplete();
    });
  }, [onStart, triggerComplete]);

  /** Playback genuinely started — the poster fallback is no longer needed. */
  const handlePlaying = useCallback(() => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
  }, []);

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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: `radial-gradient(ellipse at center, var(--v2-ink) 0%, var(--v2-deep-charcoal) 60%, #000 100%)`,
        overflow: "hidden",
        opacity: isRevealing && prefersReduced ? 0 : 1,
        transition: isRevealing && prefersReduced ? "opacity 0.4s ease" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onStartScreen ? "pointer" : "default",
      }}
      aria-hidden={isRevealing || undefined}
    >
      {/*
        The video itself IS the start-screen visual — no separate poster
        photo. `muted`: this video carries no audio track of its own; the
        background song (started in handleStart) is the only sound.
        onLoadedMetadata seeks a hair into the file so the browser actually
        paints that first frame while paused, instead of showing nothing.
      */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 0.01;
        }}
        onPlaying={handlePlaying}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerComplete}
        onError={handleVideoError}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={introSrc} type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: WEDDING_CONFIG.textOverlay.heroGradient }}
      />

      {/* Huge glow of light — blooms at the reveal, GSAP-driven only */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "70vmax",
          height: "70vmax",
          marginLeft: "-35vmax",
          marginTop: "-35vmax",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,250,235,0.95) 0%, rgba(230,201,138,0.5) 35%, rgba(198,161,91,0) 70%)",
          opacity: 0,
          transform: "scale(0.15)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {onStartScreen && (
        <>
          <div
            className="v2-watercolor"
            style={{ width: 400, height: 400, top: "10%", left: "5%", background: "var(--v2-gold)" }}
          />
          <div
            className="v2-watercolor"
            style={{ width: 350, height: 350, bottom: "10%", right: "5%", background: "var(--v2-accent)" }}
          />

          <motion.div
            variants={prefersReduced ? undefined : container}
            initial={prefersReduced ? undefined : "hidden"}
            animate={prefersReduced ? undefined : "show"}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem", maxWidth: "90vw" }}
          >
            <div
              aria-hidden="true"
              style={{ position: "absolute", top: "-2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: -1, opacity: 0.35 }}
            >
              <CrossMotif size={40} />
            </div>

            <motion.p variants={item} className="v2-eyebrow" style={{ color: "var(--v2-sacred-gold)" }}>
              {WEDDING_CONFIG.videoIntro.topFlourish}
            </motion.p>

            <motion.div
              variants={item}
              aria-hidden="true"
              style={{ width: 80, height: 1, background: "linear-gradient(to right, transparent, var(--v2-line), transparent)", margin: "1.5rem auto" }}
            />

            <motion.h1
              variants={item}
              className="v2-heading-xl"
              style={{ fontStyle: "italic", color: "var(--v2-ivory)", margin: "0.5rem 0 0", textShadow: WEDDING_CONFIG.textOverlay.nameShadow }}
            >
              {WEDDING_CONFIG.couple.displayNames}
            </motion.h1>

            {/*
              The video's wax seal sits dead-centre of the frame. This gap
              reserves that band so no overlay text lands on top of it — the
              details below resume clear of the stamp.
            */}
            <div aria-hidden="true" className="v2-intro-seal-gap" />

            <motion.div
              variants={item}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}
            >
              <div style={{ width: 30, height: 1, background: "var(--v2-line)" }} />
              <p style={{ fontFamily: "var(--v2-font-sans)", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", letterSpacing: "0.25em", color: "rgba(234,228,216,0.6)" }}>
                {formatDate(WEDDING_CONFIG.dates.wedding)}
              </p>
              <div style={{ width: 30, height: 1, background: "var(--v2-line)" }} />
            </motion.div>

            <motion.p
              variants={item}
              style={{ fontFamily: "var(--v2-font-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(234,228,216,0.35)", marginTop: "0.5rem" }}
            >
              {WEDDING_CONFIG.videoIntro.venue}
            </motion.p>

            <motion.div variants={item} style={{ position: "relative", display: "inline-flex", marginTop: "2.5rem" }}>
              <div
                aria-hidden="true"
                className="v2-animate-pulse-ring"
                style={{ position: "absolute", inset: -10, borderRadius: 9999, border: "1px solid rgba(198,161,91,0.3)" }}
              />
              <button
                className="v2-btn v2-btn-gold"
                onClick={handleStart}
                style={{ padding: "0.85rem 2.5rem" }}
              >
                {WEDDING_CONFIG.videoIntro.ctaText}
              </button>
            </motion.div>
          </motion.div>
        </>
      )}

      {showSkip && !isRevealing && (
        <button
          onClick={triggerComplete}
          style={{
            position: "absolute",
            bottom: "1.75rem",
            right: "1.75rem",
            zIndex: 4,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 9999,
            padding: "0.4rem 1.1rem",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            opacity: 0,
            animation: "v2-fade-in 0.6s ease forwards",
          }}
          aria-label="Skip intro"
        >
          Skip
        </button>
      )}
    </div>
  );
};
