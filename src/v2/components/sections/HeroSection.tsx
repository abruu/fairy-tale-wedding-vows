import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/**
 * Full-screen editorial hero — asymmetric bottom-left name block over a
 * slow-drifting background image, with scroll-linked parallax depth
 * (works on touch devices, unlike mouse-only parallax).
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onEnter }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 0]);

  const weddingDate = useMemo(
    () => formatDate(WEDDING_CONFIG.dates.wedding),
    [],
  );
  const heroImage = WEDDING_CONFIG.media.heroBgImage;

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Parallax background layer */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          y: bgY,
          scale: bgScale,
        }}
      />

      {/* Dark editorial overlay for readability */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: WEDDING_CONFIG.textOverlay.heroGradient }} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at bottom left, rgba(13,12,11,0.15) 0%, rgba(13,12,11,0.55) 60%, rgba(13,12,11,0.8) 100%)",
        }}
      />

      <FloatingOrnaments count={6} variant="sparkles" />

      {/* Asymmetric content block — bottom-left third, magazine-cover style */}
      <motion.div
        variants={prefersReduced ? undefined : container}
        initial={prefersReduced ? undefined : "hidden"}
        animate={prefersReduced ? undefined : "show"}
        style={{
          position: "relative",
          zIndex: 2,
          y: contentY,
          opacity: contentOpacity,
          width: "100%",
          padding: "2rem clamp(1.5rem, 6vw, 5rem) clamp(3rem, 10vh, 6rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "36rem", textAlign: "left" }}>
          <motion.p variants={item} className="v2-eyebrow" style={{ color: "var(--v2-gold-light)", marginBottom: "1.25rem" }}>
            {WEDDING_CONFIG.couple.tagline}
          </motion.p>

          <motion.div
            variants={item}
            aria-hidden="true"
            style={{ width: 1, height: "2.5rem", background: "linear-gradient(to bottom, var(--v2-gold), transparent)", marginBottom: "1.25rem" }}
          />

          <motion.h1
            variants={item}
            className="v2-heading-xl"
            style={{ fontStyle: "italic", color: "var(--v2-ivory)", textShadow: WEDDING_CONFIG.textOverlay.nameShadow, margin: 0, lineHeight: 1 }}
          >
            {WEDDING_CONFIG.couple.name1}
            <span style={{ fontFamily: "var(--v2-font-display)", color: "var(--v2-gold)", margin: "0 0.3em" }}>&amp;</span>
            <br />
            {WEDDING_CONFIG.couple.name2}
          </motion.h1>

          <motion.div variants={item} style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.75rem" }}>
            <div style={{ width: 40, height: 1, background: "var(--v2-line)" }} />
            <p style={{ fontFamily: "var(--v2-font-sans)", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(234,228,216,0.75)", margin: 0 }}>
              {weddingDate.day} {weddingDate.month} {weddingDate.year}
            </p>
          </motion.div>
          <motion.p
            variants={item}
            style={{ fontFamily: "var(--v2-font-sans)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(234,228,216,0.45)", margin: "0.4rem 0 0" }}
          >
            {WEDDING_CONFIG.couple.venue}
          </motion.p>
        </div>

        {/* Scripture reference — quiet permanent faith marker */}
        {WEDDING_CONFIG.scripture && (
          <motion.div variants={item} style={{ textAlign: "right", maxWidth: "18rem" }}>
            <p
              style={{
                fontFamily: "var(--v2-font-display)",
                fontStyle: "italic",
                fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                color: "rgba(217,181,103,0.8)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {WEDDING_CONFIG.scripture.reference}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <div className="v2-scroll-indicator" onClick={() => onEnter?.()}>
        <div className="v2-scroll-mouse" />
        <span style={{ fontFamily: "var(--v2-font-sans)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(198,161,91,0.6)" }}>
          Scroll
        </span>
      </div>
    </section>
  );
};
