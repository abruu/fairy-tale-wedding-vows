import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCountdown } from "../../hooks/useCountdown";

interface MiniCountdownProps {
  label: string;
  targetDate: string;
  accent?: string;
  size?: "sm" | "md";
  completeText?: string;
}

const fmt = (n: number) => String(n).padStart(2, "0");

/**
 * Compact live countdown — a labeled row of day/hour/minute/second pills.
 * Used anywhere a full CountdownSection would be too heavy: the hero
 * strip and the venue detail cards.
 */
export const MiniCountdown: React.FC<MiniCountdownProps> = ({
  label,
  targetDate,
  accent = "var(--v2-gold)",
  size = "md",
  completeText = "Today!",
}) => {
  const { timeLeft } = useCountdown(targetDate);

  const units = [
    { value: timeLeft.days, label: "D" },
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "M" },
    { value: timeLeft.seconds, label: "S" },
  ];

  return (
    <div className={`v2-mini-countdown v2-mini-countdown--${size}`}>
      <span className="v2-mini-countdown-label" style={{ color: accent }}>
        {label}
      </span>

      {timeLeft.isComplete ? (
        <span className="v2-mini-countdown-complete" style={{ color: accent }}>
          {completeText}
        </span>
      ) : (
        <div className="v2-mini-countdown-units">
          {units.map((u, i) => (
            <React.Fragment key={u.label}>
              <div className="v2-mini-countdown-unit">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={u.value}
                    className="v2-mini-countdown-value"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {fmt(u.value)}
                  </motion.span>
                </AnimatePresence>
                <span className="v2-mini-countdown-unit-label">{u.label}</span>
              </div>
              {i < units.length - 1 && <span className="v2-mini-countdown-sep">:</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
