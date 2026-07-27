import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { useCountdown } from "../../hooks/useCountdown";
import { SectionHeader } from "../shared/SectionHeader";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface CountdownSectionProps {
  onComplete?: () => void;
}

const fmt = (n: number) => String(n).padStart(2, "0");

/**
 * Dark cinematic countdown with a flip-transition per digit and a
 * scripture fragment as a quiet reminder of what's being counted down to.
 */
export const CountdownSection: React.FC<CountdownSectionProps> = ({ onComplete }) => {
  const { timeLeft, setOnComplete } = useCountdown(WEDDING_CONFIG.dates.wedding);
  const prefersReduced = useReducedMotion();

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  setOnComplete(handleComplete);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <section
      id="countdown"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, var(--v2-deep-charcoal) 0%, var(--v2-ink) 50%, var(--v2-deep-charcoal) 100%)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
        overflow: "hidden",
      }}
    >
      <FloatingOrnaments count={5} variant="sparkles" />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "60rem", margin: "0 auto", textAlign: "center" }}>
        <SectionHeader
          eyebrow="Counting Down"
          title={timeLeft.isComplete ? "United Forever" : "The Wait Begins"}
          subtitle={timeLeft.isComplete ? "Our forever starts now" : "Every second brings us closer to forever"}
          variant="dark"
        />

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "3rem", flexWrap: "wrap" }}>
          <AnimatePresence mode="wait">
            {timeLeft.isComplete ? (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ textAlign: "center", padding: "2rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--v2-font-serif)",
                    fontStyle: "italic",
                    fontSize: "clamp(2rem, 6vw, 4rem)",
                    fontWeight: 500,
                    background: "linear-gradient(135deg, var(--v2-gold-light) 0%, var(--v2-ivory) 50%, var(--v2-gold-light) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 20px rgba(198,161,91,0.4))",
                    margin: 0,
                  }}
                >
                  United Forever
                </h3>
                <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(234,228,216,0.6)", marginTop: "1rem" }}>
                  {WEDDING_CONFIG.couple.displayNames}
                </p>
              </motion.div>
            ) : (
              <motion.div key="counting" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                {units.map((u, i) => (
                  <React.Fragment key={u.label}>
                    <div className="v2-countdown-box">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={u.value}
                          className="v2-countdown-number"
                          initial={prefersReduced ? undefined : { rotateX: 90, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          exit={prefersReduced ? undefined : { rotateX: -90, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ display: "inline-block" }}
                        >
                          {fmt(u.value)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="v2-countdown-label">{u.label}</span>
                    </div>
                    {i < units.length - 1 && (
                      <span className="v2-countdown-separator" style={{ fontFamily: "var(--v2-font-serif)", fontSize: "1.5rem", color: "rgba(198,161,91,0.4)", paddingBottom: "1.5rem" }}>
                        :
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!timeLeft.isComplete && (
          <p style={{ fontFamily: "var(--v2-font-sans)", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(198,161,91,0.5)", marginTop: "2.5rem" }}>
            {WEDDING_CONFIG.events.wedding.dateLabel} · {WEDDING_CONFIG.events.wedding.venue}
          </p>
        )}

        {WEDDING_CONFIG.scripture && (
          <p
            style={{
              fontFamily: "var(--v2-font-display)",
              fontStyle: "italic",
              fontSize: "0.85rem",
              color: "var(--v2-sacred-gold)",
              opacity: 0.7,
              marginTop: "2rem",
              maxWidth: "34rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {WEDDING_CONFIG.scripture.quote}
          </p>
        )}
      </div>
    </section>
  );
};
