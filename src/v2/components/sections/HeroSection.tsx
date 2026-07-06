import React, { useMemo } from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReveal } from "../../hooks/useReveal";
import { useMouseParallax } from "../../hooks/useMouseParallax";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";

interface HeroSectionProps {
  onEnter?: () => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    year: d.toLocaleDateString("en-GB", { year: "numeric" }),
  };
};

/**
 * Full-screen cinematic hero with layered typography, mouse parallax, and floating ornaments.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onEnter }) => {
  const { ref, revealed } = useReveal<HTMLElement>({
    type: "blur",
    once: true,
  });
  const mouseOffset = useMouseParallax(15);
  const prefersReduced = useReducedMotion();

  const weddingDate = useMemo(
    () => formatDate(WEDDING_CONFIG.dates.wedding),
    [],
  );
  const heroImage = WEDDING_CONFIG.media.heroBgImage;

  const parallaxStyle = (depth: number) => {
    if (prefersReduced) return {};
    return {
      transform: `translate3d(${mouseOffset.x * depth}px, ${mouseOffset.y * depth}px, 0)`,
      willChange: "transform" as const,
    };
  };

  return (
    <section
      id="hero"
      ref={ref}
      className={`v2-reveal-blur ${revealed ? "revealed" : ""}`}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `linear-gradient(180deg, rgba(26,26,26,0.35) 0%, rgba(26,26,26,0.2) 40%, rgba(26,26,26,0.5) 100%), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Dark overlay for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(26,26,26,0.3) 70%, rgba(26,26,26,0.6) 100%)",
        }}
      />

      {/* Floating ornaments */}
      <FloatingOrnaments count={6} variant="sparkles" />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "2rem",
          maxWidth: "90vw",
        }}
      >
        {/* Eyebrow */}
        <p
          className="v2-eyebrow"
          style={{
            color: "var(--v2-gold-light)",
            marginBottom: "1.5rem",
            ...parallaxStyle(0.5),
          }}
        >
          {WEDDING_CONFIG.videoIntro.weddingOfLabel}
        </p>

        {/* Name 1 */}
        <h1
          className="v2-heading-xl"
          style={{
            fontStyle: "italic",
            color: "var(--v2-ivory)",
            textShadow: "0 4px 40px rgba(0,0,0,0.4)",
            margin: 0,
            ...parallaxStyle(1),
          }}
        >
          {WEDDING_CONFIG.couple.name1}
        </h1>

        {/* Ampersand with decorative lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            margin: "0.5rem 0",
            ...parallaxStyle(0.3),
          }}
        >
          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(201,169,110,0.5))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--v2-font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              color: "var(--v2-gold)",
            }}
          >
            &amp;
          </span>
          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(to right, rgba(201,169,110,0.5), transparent)",
            }}
          />
        </div>

        {/* Name 2 */}
        <h1
          className="v2-heading-xl"
          style={{
            fontStyle: "italic",
            color: "var(--v2-ivory)",
            textShadow: "0 4px 40px rgba(0,0,0,0.4)",
            margin: 0,
            ...parallaxStyle(1),
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
            gap: "1rem",
            marginTop: "2.5rem",
            ...parallaxStyle(0.6),
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(201,169,110,0.3)",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--v2-font-sans)",
                fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,240,0.6)",
                margin: 0,
              }}
            >
              {weddingDate.day} {weddingDate.month} {weddingDate.year}
            </p>
            <p
              style={{
                fontFamily: "var(--v2-font-sans)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,240,0.35)",
                margin: "0.3rem 0 0",
              }}
            >
              {WEDDING_CONFIG.videoIntro.venue}
            </p>
          </div>
          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(201,169,110,0.3)",
            }}
          />
        </div>

        {/* Scripture */}
        {WEDDING_CONFIG.scripture && (
          <div
            style={{
              marginTop: "2rem",
              ...parallaxStyle(0.4),
            }}
          >
            <p
              style={{
                fontFamily: "var(--v2-font-display)",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                color: "rgba(255,255,240,0.5)",
                maxWidth: "30rem",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {WEDDING_CONFIG.scripture.quote}
            </p>
            <p
              style={{
                fontFamily: "var(--v2-font-sans)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.5)",
                marginTop: "0.5rem",
              }}
            >
              {WEDDING_CONFIG.scripture.reference}
            </p>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="v2-scroll-indicator" onClick={() => onEnter?.()}>
        <div className="v2-scroll-mouse" />
        <span
          style={{
            fontFamily: "var(--v2-font-sans)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(201,169,110,0.5)",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
};
