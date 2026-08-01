import { comingSoonConfig } from "../config";
import { useCountdown } from "../hooks/useCountdown";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live countdown to the wedding. Typography-led (no boxed cards) with hairline
 * gold separators; collapses gracefully on narrow screens.
 */
export const WeddingCountdown = () => {
  const { days, hours, minutes, seconds, finished } = useCountdown(
    comingSoonConfig.weddingDate,
  );
  const labels = comingSoonConfig.countdown;

  if (finished) {
    return <p className="cs-countdown--done">{labels.finished}</p>;
  }

  const units = [
    { value: String(days), label: labels.days },
    { value: pad(hours), label: labels.hours },
    { value: pad(minutes), label: labels.minutes },
    { value: pad(seconds), label: labels.seconds },
  ];

  return (
    <ul
      className="cs-countdown"
      aria-label={`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds until the wedding`}
    >
      {units.map((u) => (
        <li className="cs-countdown__unit" key={u.label}>
          {/* key on the value so each change replays the soft tick transition */}
          <span className="cs-countdown__num" key={u.value} aria-hidden="true">
            {u.value}
          </span>
          <span className="cs-countdown__label" aria-hidden="true">
            {u.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default WeddingCountdown;
