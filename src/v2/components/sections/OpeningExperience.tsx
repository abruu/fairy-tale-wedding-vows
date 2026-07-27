import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { CrossMotif } from "../shared/CrossMotif";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface OpeningExperienceProps {
  onComplete: () => void;
  onStart?: () => void;
}

type Phase = "idle" | "playing" | "fading" | "done";

const FADE_DURATION = 1.1;
const VIDEO_STALL_TIMEOUT = 15000;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/**
 * Cinematic opening experience — near-black canvas with a faith
 * watermark behind the couple's names, framer-motion staggered reveal,
 * and a real door-opening video sequence.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onComplete,
  onStart,
}) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [videoDim, setVideoDim] = useState(true);
  const triggeredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();

  const triggerComplete = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    setPhase("fading");
    setTimeout(
      () => {
        setPhase("done");
        onComplete();
      },
      prefersReduced ? 0 : FADE_DURATION * 1000,
    );
  }, [onComplete, prefersReduced]);

  const handleVideoError = useCallback(() => {
    triggerComplete();
  }, [triggerComplete]);

  const handleEnter = useCallback(() => {
    if (phase !== "idle") return;
    const vid = videoRef.current;
    if (!vid) {
      triggerComplete();
      return;
    }

    setIsLoading(true);
    onStart?.();

    vid
      .play()
      .then(() => {
        setIsLoading(false);
        setPhase("playing");
        stallTimerRef.current = setTimeout(
          triggerComplete,
          VIDEO_STALL_TIMEOUT,
        );
        dimTimerRef.current = setTimeout(
          () => setVideoDim(false),
          prefersReduced ? 0 : 1800,
        );
      })
      .catch(() => {
        setIsLoading(false);
        triggerComplete();
      });
  }, [phase, onStart, triggerComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") handleEnter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleEnter]);

  useEffect(() => {
    return () => {
      if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
    };
  }, []);

  if (phase === "done") return null;

  const isFading = phase === "fading";
  const isIdle = phase === "idle";
  const isPlaying = phase === "playing";

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div
          onClick={isIdle && !isLoading ? handleEnter : undefined}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: `radial-gradient(ellipse at center, var(--v2-ink) 0%, var(--v2-deep-charcoal) 60%, #000 100%)`,
            overflow: "hidden",
            cursor: isIdle && !isLoading ? "pointer" : "default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          role="button"
          tabIndex={0}
          aria-label="Enter wedding invitation"
        >
          {/* Door open video */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              if (e.currentTarget) e.currentTarget.currentTime = 0.001;
            }}
            onEnded={triggerComplete}
            onError={handleVideoError}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isLoading ? 0 : videoDim ? 0.45 : 1,
              transition: isLoading ? "opacity 0.6s ease" : "opacity 1.8s ease",
            }}
          >
            <source src="/video/openVideo.mp4" type="video/mp4" />
            <source src="/video/openVideo.mov" type="video/quicktime" />
          </video>

          {/* Loading spinner */}
          {isLoading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(13,12,11,0.7)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid rgba(198,161,91,0.15)",
                  borderTopColor: "rgba(198,161,91,0.8)",
                  animation: "v2-spin 0.8s linear infinite",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(198,161,91,0.5)",
                  marginTop: "1rem",
                }}
              >
                Loading…
              </p>
            </div>
          )}

          {/* Watercolor glows — only on idle screen */}
          {isIdle && !isLoading && (
            <>
              <div
                className="v2-watercolor"
                style={{ width: 400, height: 400, top: "10%", left: "5%", background: "var(--v2-gold)" }}
              />
              <div
                className="v2-watercolor"
                style={{ width: 350, height: 350, bottom: "10%", right: "5%", background: "var(--v2-rose-gold)" }}
              />
            </>
          )}

          {/* Floating sparkles */}
          {isIdle &&
            !isLoading &&
            [...Array(12)].map((_, i) => (
              <span
                key={i}
                className="v2-animate-sparkle"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: `${10 + ((i * 8) % 80)}%`,
                  top: `${15 + ((i * 13) % 70)}%`,
                  fontSize: 8 + (i % 3) * 4,
                  color: "rgba(198,161,91,0.4)",
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                ✦
              </span>
            ))}

          {/* Content */}
          {isIdle && !isLoading && (
            <motion.div
              variants={prefersReduced ? undefined : container}
              initial={prefersReduced ? undefined : "hidden"}
              animate={prefersReduced ? undefined : "show"}
              style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                padding: "2rem",
                maxWidth: "90vw",
              }}
            >
              {/* Faith watermark, behind names */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-2.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: -1,
                  opacity: 0.35,
                }}
              >
                <CrossMotif size={40} />
              </div>

              <motion.p variants={item} className="v2-eyebrow" style={{ color: "var(--v2-sacred-gold)" }}>
                {WEDDING_CONFIG.videoIntro.topFlourish}
              </motion.p>

              <motion.div
                variants={item}
                aria-hidden="true"
                style={{
                  width: 80,
                  height: 1,
                  background: "linear-gradient(to right, transparent, var(--v2-line), transparent)",
                  margin: "1.5rem auto",
                }}
              />

              <motion.p
                variants={item}
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(198,161,91,0.7)",
                  marginBottom: "1rem",
                }}
              >
                {WEDDING_CONFIG.videoIntro.weddingOfLabel}
              </motion.p>

              <motion.h1 variants={item} className="v2-heading-xl" style={{ fontStyle: "italic", color: "var(--v2-ivory)", margin: 0 }}>
                {WEDDING_CONFIG.couple.name1}
              </motion.h1>

              <motion.p
                variants={item}
                style={{
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                  color: "var(--v2-gold)",
                  margin: "0.25rem 0",
                }}
              >
                &amp;
              </motion.p>

              <motion.h1 variants={item} className="v2-heading-xl" style={{ fontStyle: "italic", color: "var(--v2-ivory)", margin: 0 }}>
                {WEDDING_CONFIG.couple.name2}
              </motion.h1>

              <motion.div
                variants={item}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem", marginTop: "2rem" }}
              >
                <div style={{ width: 30, height: 1, background: "var(--v2-line)" }} />
                <p style={{ fontFamily: "var(--v2-font-sans)", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", letterSpacing: "0.25em", color: "rgba(234,228,216,0.6)" }}>
                  {formatDate(WEDDING_CONFIG.dates.wedding)}
                </p>
                <div style={{ width: 30, height: 1, background: "var(--v2-line)" }} />
              </motion.div>

              <motion.p
                variants={item}
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(234,228,216,0.35)",
                  marginTop: "0.5rem",
                }}
              >
                {WEDDING_CONFIG.videoIntro.venue}
              </motion.p>

              <motion.div
                variants={item}
                aria-hidden="true"
                style={{
                  width: 80,
                  height: 1,
                  background: "linear-gradient(to right, transparent, var(--v2-line), transparent)",
                  margin: "2rem auto",
                }}
              />

              <motion.div variants={item} style={{ position: "relative", display: "inline-flex" }}>
                <div
                  aria-hidden="true"
                  className="v2-animate-pulse-ring"
                  style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1px solid rgba(198,161,91,0.3)" }}
                />
                <button
                  className="v2-btn v2-btn-ghost-light"
                  style={{ padding: "0.75rem 2.5rem", fontSize: "0.7rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnter();
                  }}
                  aria-label="Enter the wedding invitation"
                >
                  {WEDDING_CONFIG.videoIntro.ctaText}
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Skip button while video plays */}
          {isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerComplete();
              }}
              style={{
                position: "absolute",
                bottom: "1.75rem",
                right: "1.75rem",
                zIndex: 4,
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "9999px",
                padding: "0.4rem 1.1rem",
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              aria-label="Skip intro"
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
