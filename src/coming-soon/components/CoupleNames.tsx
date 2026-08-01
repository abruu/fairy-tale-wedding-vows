import { comingSoonConfig } from "../config";
import { useLoveEasterEgg } from "../hooks/useLoveEasterEgg";
import { LoveEasterEgg } from "./LoveEasterEgg";

interface CoupleNamesProps {
  groom: string;
  bride: string;
  reduced: boolean;
  /** Fewer particles on phones / low-power devices */
  light?: boolean;
  /** Entrance delay (s) for the first name */
  delay?: number;
}

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 20.7s-7.6-4.7-9.4-9.3C1.2 7.7 3.2 4.6 6.4 4.1c2-.3 3.9.6 5.1 2.2 1.2-1.6 3.1-2.5 5.1-2.2 3.2.5 5.2 3.6 3.8 7.3-1.8 4.6-9.4 9.3-9.4 9.3z" />
  </svg>
);

/**
 * A name revealed letter by letter — blur to sharp, letter-spacing settling
 * and a gentle rise. The entrance animation lives on an inner span so the
 * hover micro-interaction on the outer span never fights a filled animation
 * for `transform`.
 */
const RevealedName = ({
  name,
  start,
  reduced,
  sheenAt,
}: {
  name: string;
  start: number;
  reduced: boolean;
  sheenAt: number;
}) => (
  <span
    className={reduced ? "cs-names__name" : "cs-names__name cs-names__name--sheen"}
    style={reduced ? undefined : ({ "--sheen": `${sheenAt}s` } as React.CSSProperties)}
  >
    {[...name].map((ch, i) => (
      <span key={`${ch}-${i}`} className="cs-names__char">
        <span
          className={reduced ? undefined : "cs-reveal--letter"}
          style={
            reduced
              ? undefined
              : ({ "--d": `${start + i * 0.055}s` } as React.CSSProperties)
          }
        >
          {ch}
        </span>
      </span>
    ))}
  </span>
);

/**
 * "Abrin ♥ Elsa" — the visual centrepiece. The heart pulses slowly and, when
 * tapped, releases the Love Burst plus a whispered line beneath the names.
 */
export const CoupleNames = ({
  groom,
  bride,
  reduced,
  light = false,
  delay = 0.5,
}: CoupleNamesProps) => {
  const { burst, bits, whisper } = useLoveEasterEgg(reduced, light);
  const heartDelay = delay + groom.length * 0.055 + 0.12;
  const brideDelay = heartDelay + 0.28;
  const sheenAt = brideDelay + bride.length * 0.055 + 0.6;

  return (
    <h1 className="cs-names">
      <RevealedName name={groom} start={delay} reduced={reduced} sheenAt={sheenAt} />

      <span
        className={reduced ? "cs-heart__slot" : "cs-heart__slot cs-reveal"}
        style={
          reduced
            ? undefined
            : ({ "--d": `${heartDelay}s` } as React.CSSProperties)
        }
      >
        <button
          type="button"
          className="cs-heart"
          onClick={burst}
          aria-label={`${groom} and ${bride} — tap the heart for a little surprise`}
        >
          <HeartIcon />
          <LoveEasterEgg bits={bits} />
        </button>
      </span>

      <RevealedName
        name={bride}
        start={brideDelay}
        reduced={reduced}
        sheenAt={sheenAt + 0.18}
      />

      {whisper && (
        <span className="cs-whisper" role="status">
          {comingSoonConfig.copy.loveBurst}
        </span>
      )}
    </h1>
  );
};

export default CoupleNames;
