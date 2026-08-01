import type { LoveBit } from "../hooks/useLoveEasterEgg";

/**
 * Tiny hearts / petals / sparkles blooming out of the heart between the names.
 * Purely decorative — the particles are produced by `useLoveEasterEgg`.
 */
export const LoveEasterEgg = ({ bits }: { bits: LoveBit[] }) => {
  if (!bits.length) return null;

  return (
    <span className="cs-egg" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="cs-egg__bit"
          style={
            {
              "--bit-x": `${b.x}px`,
              "--bit-y": `${b.y}px`,
              "--bit-scale": b.scale,
              "--bit-rot": `${b.rot}deg`,
              "--bit-size": `${b.size}px`,
              "--bit-color": b.color,
              "--bit-delay": `${b.delay}s`,
              "--bit-dur": `${b.duration}s`,
            } as React.CSSProperties
          }
        >
          {b.glyph}
        </span>
      ))}
    </span>
  );
};

export default LoveEasterEgg;
