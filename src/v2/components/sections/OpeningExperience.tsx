import React, { useState, useCallback, useEffect, useRef } from "react";
import { WEDDING_CONFIG } from "@/config/dates";

interface OpeningExperienceProps {
  onComplete: () => void;
  onStart?: () => void;
}

type Phase = "idle" | "playing" | "fading" | "done";

const FADE_DURATION = 1500;
const VIDEO_STALL_TIMEOUT = 15000;

/**
 * Cinematic opening experience — elegant invitation screen with layered animations.
 * Replaces the old VideoIntro with a pure CSS/React experience.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onComplete,
  onStart,
}) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [videoReady, setVideoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const triggeredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerComplete = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    setPhase("fading");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, FADE_DURATION);
  }, [onComplete]);

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
      })
      .catch(() => {
        setIsLoading(false);
        triggerComplete();
      });
  }, [phase, onStart, triggerComplete]);

  useEffect(() => {
    // Allow keyboard enter
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") handleEnter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleEnter]);

  // Cleanup stall timer
  useEffect(() => {
    return () => {
      if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
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
    <div
      onClick={isIdle && !isLoading ? handleEnter : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background:
          "radial-gradient(ellipse at center, #1F1B16 0%, #1A1A1A 50%, #0F0D0A 100%)",
        overflow: "hidden",
        opacity: isFading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease`,
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
        onCanPlay={() => setVideoReady(true)}
        onEnded={triggerComplete}
        onError={handleVideoError}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.6s ease",
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
            background: "rgba(15,13,10,0.7)",
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(201,169,110,0.15)",
              borderTopColor: "rgba(201,169,110,0.8)",
              animation: "v2-spin 0.8s linear infinite",
            }}
          />
          <p
            style={{
              fontFamily: "var(--v2-font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.5)",
              marginTop: "1rem",
            }}
          >
            Loading…
          </p>
        </div>
      )}
      {/* Watercolor glows — only show on idle screen, not over video */}
      {isIdle && !isLoading && (
        <>
          <div
            className="v2-watercolor"
            style={{
              width: 400,
              height: 400,
              top: "10%",
              left: "5%",
              background: "var(--v2-gold)",
            }}
          />
          <div
            className="v2-watercolor"
            style={{
              width: 350,
              height: 350,
              bottom: "10%",
              right: "5%",
              background: "var(--v2-rose-gold)",
            }}
          />
        </>
      )}

      {/* Floating sparkles — only on idle screen */}
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
              color: "rgba(201,169,110,0.4)",
              animationDelay: `${i * 0.3}s`,
            }}
          >
            ✦
          </span>
        ))}

      {/* Content — only visible on idle screen */}
      {isIdle && !isLoading && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "2rem",
            maxWidth: "90vw",
          }}
        >
          {/* Top flourish */}
          <p
            className="v2-eyebrow"
            style={{
              color: "var(--v2-gold)",
              animation: "v2-fade-up 1s ease-out 0.2s both",
            }}
          >
            {WEDDING_CONFIG.videoIntro.topFlourish}
          </p>

          {/* Decorative line */}
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)",
              margin: "1.5rem auto",
              animation: "v2-fade-in 1.2s ease-out 0.4s both",
            }}
          />

          {/* "The Wedding of" */}
          <p
            style={{
              fontFamily: "var(--v2-font-sans)",
              fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.7)",
              marginBottom: "1rem",
              animation: "v2-fade-up 0.9s ease-out 0.5s both",
            }}
          >
            {WEDDING_CONFIG.videoIntro.weddingOfLabel}
          </p>

          {/* Names */}
          <h1
            className="v2-heading-xl"
            style={{
              fontStyle: "italic",
              color: "var(--v2-ivory)",
              textShadow: "0 4px 40px rgba(201,169,110,0.2)",
              margin: 0,
              animation: "v2-fade-up 1s ease-out 0.6s both",
            }}
          >
            {WEDDING_CONFIG.couple.name1}
          </h1>

          {/* Ampersand */}
          <p
            style={{
              fontFamily: "var(--v2-font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              color: "var(--v2-gold)",
              margin: "0.25rem 0",
              animation: "v2-fade-up 1s ease-out 0.8s both",
            }}
          >
            &amp;
          </p>

          <h1
            className="v2-heading-xl"
            style={{
              fontStyle: "italic",
              color: "var(--v2-ivory)",
              textShadow: "0 4px 40px rgba(201,169,110,0.2)",
              margin: 0,
              animation: "v2-fade-up 1s ease-out 0.9s both",
            }}
          >
            {WEDDING_CONFIG.couple.name2}
          </h1>

          {/* Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              marginTop: "2rem",
              animation: "v2-fade-up 0.9s ease-out 1.1s both",
            }}
          >
            <div
              style={{
                width: 30,
                height: 1,
                background: "rgba(201,169,110,0.3)",
              }}
            />
            <p
              style={{
                fontFamily: "var(--v2-font-sans)",
                fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                letterSpacing: "0.25em",
                color: "rgba(255,255,240,0.5)",
              }}
            >
              {formatDate(WEDDING_CONFIG.dates.wedding)}
            </p>
            <div
              style={{
                width: 30,
                height: 1,
                background: "rgba(201,169,110,0.3)",
              }}
            />
          </div>

          {/* Venue */}
          <p
            style={{
              fontFamily: "var(--v2-font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,240,0.3)",
              marginTop: "0.5rem",
              animation: "v2-fade-up 0.9s ease-out 1.2s both",
            }}
          >
            {WEDDING_CONFIG.videoIntro.venue}
          </p>

          {/* Decorative line */}
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)",
              margin: "2rem auto",
              animation: "v2-fade-in 1.2s ease-out 1.3s both",
            }}
          />

          {/* Enter button with pulsing ring */}
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              animation: "v2-fade-up 0.8s ease-out 1.4s both",
            }}
          >
            <div
              aria-hidden="true"
              className="v2-animate-pulse-ring"
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "1px solid rgba(201,169,110,0.3)",
              }}
            />
            <button
              className="v2-btn v2-btn-ghost-light"
              style={{
                padding: "0.75rem 2.5rem",
                fontSize: "0.7rem",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              aria-label="Enter the wedding invitation"
            >
              {WEDDING_CONFIG.videoIntro.ctaText}
            </button>
          </div>

          {/* Bottom flourish */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "clamp(1.5rem, 5vh, 3rem)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              animation: "v2-fade-up 0.8s ease-out 1.6s both",
            }}
          >
            <span
              style={{ color: "rgba(201,169,110,0.3)", fontSize: "0.5rem" }}
            >
              ✦
            </span>
            <span
              style={{ color: "rgba(201,169,110,0.4)", fontSize: "0.7rem" }}
            >
              ♥
            </span>
            <span
              style={{ color: "rgba(201,169,110,0.3)", fontSize: "0.5rem" }}
            >
              ✦
            </span>
          </div>
        </div>
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
    </div>
  );
};
