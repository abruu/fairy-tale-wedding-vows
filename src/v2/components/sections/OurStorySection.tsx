import React from "react";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { SectionHeader } from "../shared/SectionHeader";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Editorial timeline — the rule sits offset from center (not centered),
 * with alternating content either side, consistent with the asymmetric
 * layout language used across the site.
 */
export const OurStorySection: React.FC = () => {
  const items = WEDDING_CONFIG.story.items;

  return (
    <section
      id="story"
      style={{
        position: "relative",
        background: "var(--v2-deep-charcoal)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 2, maxWidth: "56rem", margin: "0 auto" }}>
        <SectionHeader eyebrow="Our Journey" title="How it all began" subtitle="Every love story is beautiful, but ours is our favorite" variant="dark" />

        <div className="v2-story-timeline" style={{ position: "relative", marginTop: "4rem" }}>
          <div
            aria-hidden="true"
            className="v2-story-line"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "clamp(1rem, 8vw, 30%)",
              width: 1,
              background: "linear-gradient(to bottom, transparent, var(--v2-gold) 10%, var(--v2-gold) 90%, transparent)",
              opacity: 0.35,
            }}
          />

          {items.map((story, i) => (
            <StoryItem key={i} date={story.date} content={story.content} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StoryItem: React.FC<{ date: string; content: string; index: number }> = ({ date, content, index }) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, x: -24 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "relative",
        paddingLeft: "clamp(2rem, 10vw, calc(30% + 2.5rem))",
        marginBottom: "3rem",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "clamp(1rem, 8vw, 30%)",
          top: "0.4rem",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--v2-gold), var(--v2-gold-light))",
          boxShadow: "0 0 0 4px rgba(198,161,91,0.15)",
        }}
      />
      <p className="v2-eyebrow" style={{ color: "var(--v2-gold)", marginBottom: "0.6rem" }}>
        {date}
      </p>
      <p
        style={{
          fontFamily: "var(--v2-font-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
          color: "rgba(234,228,216,0.85)",
          lineHeight: 1.7,
          maxWidth: "48ch",
        }}
      >
        {content}
      </p>
    </motion.div>
  );
};
