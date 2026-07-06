import React, { useCallback } from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useCountdown } from "../../hooks/useCountdown";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";

interface CountdownSectionProps {
  onComplete?: () => void;
}

const fmt = (n: number) => String(n).padStart(2, "0");

/**
 * Luxury glass card countdown on a dark cinematic background.
 */
export const CountdownSection: React.FC<CountdownSectionProps> = ({
  onComplete,
}) => {
  const { timeLeft, setOnComplete } = useCountdown(
    WEDDING_CONFIG.dates.wedding,
  );
  const { ref, revealed, className } = useReveal<HTMLDivElement>({
    type: "scale",
  });

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
      className="v2-bg-gradient-dark"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Watercolor glows */}
      <div
        className="v2-watercolor"
        style={{
          width: 400,
          height: 400,
          top: "5%",
          left: "10%",
          background: "var(--v2-gold)",
          opacity: 0.08,
        }}
      />
      <div
        className="v2-watercolor"
        style={{
          width: 350,
          height: 350,
          bottom: "5%",
          right: "10%",
          background: "var(--v2-rose-gold)",
          opacity: 0.06,
        }}
      />

      <FloatingOrnaments count={5} variant="sparkles" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "60rem",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <SectionHeader
          eyebrow="Counting Down"
          title={timeLeft.isComplete ? "United Forever" : "The Wait Begins"}
          subtitle={
            timeLeft.isComplete
              ? "Our forever starts now"
              : "Every second brings us closer to forever"
          }
          variant="light"
        />

        {/* Countdown */}
        <div
          ref={ref}
          className={`${className} ${revealed ? "revealed" : ""}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          {timeLeft.isComplete ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h3
                style={{
                  fontFamily: "var(--v2-font-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(2rem, 6vw, 4rem)",
                  fontWeight: 500,
                  background:
                    "linear-gradient(135deg, var(--v2-gold-light) 0%, var(--v2-ivory) 50%, var(--v2-gold-light) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(201,169,110,0.4))",
                  margin: 0,
                }}
              >
                United Forever
              </h3>
              <p
                style={{
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  color: "rgba(255,255,240,0.5)",
                  marginTop: "1rem",
                }}
              >
                {WEDDING_CONFIG.couple.displayNames}
              </p>
            </div>
          ) : (
            <>
              {units.map((u, i) => (
                <React.Fragment key={u.label}>
                  <div className="v2-countdown-box">
                    <span className="v2-countdown-number">{fmt(u.value)}</span>
                    <span className="v2-countdown-label">{u.label}</span>
                  </div>
                  {i < units.length - 1 && (
                    <span
                      className="v2-countdown-separator"
                      style={{
                        fontFamily: "var(--v2-font-serif)",
                        fontSize: "1.5rem",
                        color: "rgba(201,169,110,0.4)",
                        paddingBottom: "1.5rem",
                      }}
                    >
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>

        {/* Date reminder */}
        {!timeLeft.isComplete && (
          <p
            style={{
              fontFamily: "var(--v2-font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.5)",
              marginTop: "2.5rem",
            }}
          >
            {WEDDING_CONFIG.events.wedding.dateLabel} ·{" "}
            {WEDDING_CONFIG.events.wedding.venue}
          </p>
        )}
      </div>
    </section>
  );
};
