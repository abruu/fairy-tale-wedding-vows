import React, { useMemo, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCountdown } from "../../hooks/useCountdown";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";
import { MiniCountdown } from "../shared/MiniCountdown";

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

const containerVariants = (reduced: boolean) => ({
  hidden: {},
  show: { transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: reduced ? 0 : 0.1 } },
});
const itemVariants = (reduced: boolean) => ({
  hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 },
  show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
});

/**
 * Full-screen editorial hero — asymmetric bottom-left name block over a
 * slow-drifting background image, with scroll-linked parallax depth
 * (works on touch devices, unlike mouse-only parallax).
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onEnter }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const containerV = containerVariants(prefersReduced);
  const itemV = itemVariants(prefersReduced);
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
  const engagementDate = useMemo(
    () => formatDate(WEDDING_CONFIG.dates.engagement),
    [],
  );
  const heroImage = WEDDING_CONFIG.media.heroBgImage;
  const { timeLeft: betrothalTimeLeft } = useCountdown(WEDDING_CONFIG.dates.engagement);

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
        variants={containerV}
        initial="hidden"
        animate="show"
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
          <motion.p variants={itemV} className="v2-eyebrow" style={{ color: "var(--v2-gold-light)", marginBottom: "1.25rem" }}>
            {WEDDING_CONFIG.couple.tagline}
          </motion.p>

          <motion.div
            variants={itemV}
            aria-hidden="true"
            style={{ width: 1, height: "2.5rem", background: "linear-gradient(to bottom, var(--v2-gold), transparent)", marginBottom: "1.25rem" }}
          />

          <motion.h1
            variants={itemV}
            className="v2-heading-xl"
            style={{ fontStyle: "italic", color: "var(--v2-ivory)", textShadow: WEDDING_CONFIG.textOverlay.nameShadow, margin: 0, lineHeight: 1 }}
          >
            {WEDDING_CONFIG.couple.name1}
            <span style={{ fontFamily: "var(--v2-font-display)", color: "var(--v2-gold)", margin: "0 0.3em" }}>&amp;</span>
            <br />
            {WEDDING_CONFIG.couple.name2}
          </motion.h1>

          <motion.div variants={itemV} style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.75rem" }}>
            <div style={{ width: 40, height: 1, background: "var(--v2-line)" }} />
            <p style={{ fontFamily: "var(--v2-font-sans)", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(234,228,216,0.75)", margin: 0 }}>
              {weddingDate.day} {weddingDate.month} {weddingDate.year}
            </p>
          </motion.div>
          <motion.p
            variants={itemV}
            style={{ fontFamily: "var(--v2-font-sans)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(234,228,216,0.45)", margin: "0.4rem 0 0" }}
          >
            {WEDDING_CONFIG.couple.venue}
          </motion.p>
        </div>

        {/* Scripture quote — quiet permanent faith marker */}
        {WEDDING_CONFIG.scripture && (
          <motion.div variants={itemV} className="v2-hero-scripture" style={{ maxWidth: "20rem" }}>
            <p
              style={{
                fontFamily: "var(--v2-font-display)",
                fontStyle: "italic",
                fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
                color: "rgba(234,228,216,0.85)",
                lineHeight: 1.6,
                margin: 0,
                textShadow: WEDDING_CONFIG.textOverlay.textShadow,
              }}
            >
              {WEDDING_CONFIG.scripture.quote}
            </p>
            <p
              style={{
                fontFamily: "var(--v2-font-display)",
                fontStyle: "italic",
                fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                color: "rgba(217,181,103,0.8)",
                lineHeight: 1.6,
                margin: "0.6rem 0 0",
              }}
            >
              {WEDDING_CONFIG.scripture.reference}
            </p>
          </motion.div>
        )}

        {/* Single active countdown — betrothal counts down first; once that date
            arrives it automatically switches over to the wedding countdown. */}
        {/* Betrothal counts down first, then this automatically becomes the
            wedding countdown and the strip lifts to a highlighted state. */}
        <motion.div
          variants={itemV}
          className={`v2-hero-countdown-strip ${betrothalTimeLeft.isComplete ? "is-primary" : ""}`}
        >
          <AnimatePresence mode="wait">
            {betrothalTimeLeft.isComplete ? (
              <motion.div
                key="wedding"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6 }}
              >
                <MiniCountdown
                  label="Counting Down to Our Wedding"
                  targetDate={WEDDING_CONFIG.dates.wedding}
                  accent="var(--v2-gold-light)"
                  completeText="United Forever"
                />
                <p
                  style={{
                    fontFamily: "var(--v2-font-sans)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(234,228,216,0.5)",
                    margin: "0.6rem 0 0",
                  }}
                >
                  {WEDDING_CONFIG.countdown.pastEngagementLabel} · {engagementDate.day} {engagementDate.month} {engagementDate.year}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="betrothal"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6 }}
              >
                <MiniCountdown
                  label="Counting Down to Our Betrothal"
                  targetDate={WEDDING_CONFIG.dates.engagement}
                  accent="var(--v2-gold-light)"
                  completeText="Celebrated ✓"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secondary CTA — deliberately quieter than the names/countdown */}
          <motion.button
            variants={itemV}
            className="v2-btn v2-btn-quiet"
            onClick={() => onEnter?.()}
            whileHover={prefersReduced ? undefined : { y: -2 }}
            whileTap={prefersReduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginTop: "1.5rem" }}
          >
            View Invitation
          </motion.button>
        </motion.div>
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
