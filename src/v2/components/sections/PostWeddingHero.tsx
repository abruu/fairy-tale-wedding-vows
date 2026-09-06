import React from "react";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { CrossMotif } from "../shared/CrossMotif";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { fadeRise, motionVariants, staggerGroup } from "../../lib/motion";

interface PostWeddingHeroProps {
  onEnter?: () => void;
}

/**
 * Replaces the countdown hero once the wedding is over. A looping
 * celebration video carries the whole frame, with a thank-you note over it.
 *
 * The video is muted + playsInline + loop, which is exactly the combination
 * browsers allow to autoplay without a gesture — this screen is reached
 * directly, with no intro tap in front of it.
 */
export const PostWeddingHero: React.FC<PostWeddingHeroProps> = ({ onEnter }) => {
  const prefersReduced = useReducedMotion();
  const { postWedding, couple, textOverlay } = WEDDING_CONFIG;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={WEDDING_CONFIG.media.heroBgImage}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={postWedding.video} type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: textOverlay.heroGradient }}
      />

      <motion.div
        variants={motionVariants(prefersReduced, staggerGroup(0.12, 0.2))}
        initial="hidden"
        animate="show"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "2rem clamp(1.5rem, 6vw, 5rem)",
          maxWidth: "44rem",
        }}
      >
        <motion.div variants={motionVariants(prefersReduced, fadeRise)} style={{ marginBottom: "1.25rem" }}>
          <CrossMotif size={26} />
        </motion.div>

        <motion.p
          variants={motionVariants(prefersReduced, fadeRise)}
          className="v2-eyebrow"
          style={{ color: "var(--v2-gold-light)", marginBottom: "1.25rem" }}
        >
          {postWedding.eyebrow}
        </motion.p>

        <motion.h1
          variants={motionVariants(prefersReduced, fadeRise)}
          className="v2-heading-xl"
          style={{
            fontStyle: "italic",
            color: "var(--v2-ivory)",
            textShadow: textOverlay.nameShadow,
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          {postWedding.heading}
        </motion.h1>

        <motion.p
          variants={motionVariants(prefersReduced, fadeRise)}
          style={{
            fontFamily: "var(--v2-font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2.4vw, 1.25rem)",
            color: "rgba(234,228,216,0.85)",
            lineHeight: 1.75,
            margin: "1.75rem auto 0",
            maxWidth: "34rem",
            textShadow: textOverlay.textShadow,
          }}
        >
          {postWedding.message}
        </motion.p>

        <motion.div
          variants={motionVariants(prefersReduced, fadeRise)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}
        >
          <div style={{ width: 40, height: 1, background: "var(--v2-line)" }} />
          <p
            style={{
              fontFamily: "var(--v2-font-sans)",
              fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(234,228,216,0.75)",
              margin: 0,
            }}
          >
            {couple.displayNames}
          </p>
          <div style={{ width: 40, height: 1, background: "var(--v2-line)" }} />
        </motion.div>

        <motion.button
          variants={motionVariants(prefersReduced, fadeRise)}
          className="v2-btn v2-btn-quiet"
          onClick={() => onEnter?.()}
          whileHover={prefersReduced ? undefined : { y: -2 }}
          whileTap={prefersReduced ? undefined : { scale: 0.97 }}
          style={{ marginTop: "2rem" }}
        >
          View Invitation
        </motion.button>
      </motion.div>

      <div className="v2-scroll-indicator" onClick={() => onEnter?.()}>
        <div className="v2-scroll-mouse" />
        <span
          style={{
            fontFamily: "var(--v2-font-sans)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(198,161,91,0.6)",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
};
