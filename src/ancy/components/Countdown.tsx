import React from "react";
import { useCountdown } from "@/v2/hooks/useCountdown";
import { SITE } from "../config";

/**
 * Counts to the betrothal; once that has passed it switches to the wedding,
 * and after the wedding it settles on a blessing line instead of zeros.
 */
export const useNextEvent = () => {
  const now = Date.now();
  if (new Date(SITE.betrothal.iso).getTime() > now) return { ...SITE.betrothal, label: "until the Betrothal" };
  if (new Date(SITE.wedding.iso).getTime() > now) return { ...SITE.wedding, label: "until the Wedding" };
  return null;
};

const pad = (n: number) => String(n).padStart(2, "0");

export const Countdown: React.FC<{ variant?: "chips" | "band" }> = ({ variant = "chips" }) => {
  const next = useNextEvent();
  const { timeLeft } = useCountdown(next?.iso ?? SITE.wedding.iso);

  if (!next || timeLeft.isComplete) {
    return (
      <p className={variant === "band" ? "aa-band-quote" : "aa-lede"} style={{ marginTop: "1.5rem" }}>
        Blessed and joined — thank you for your prayers.
      </p>
    );
  }

  const units: [number, string][] = [
    [timeLeft.days, "Days"],
    [timeLeft.hours, "Hours"],
    [timeLeft.minutes, "Mins"],
    [timeLeft.seconds, "Secs"],
  ];

  return (
    <div
      className={variant === "band" ? "aa-band-clock" : "aa-countdown"}
      role="timer"
      aria-label={`${timeLeft.days} days ${next.label}`}
    >
      {units.map(([v, l]) => (
        <div key={l}>
          <b>{variant === "band" ? pad(v) : v}</b>
          <small>{l}</small>
        </div>
      ))}
    </div>
  );
};
