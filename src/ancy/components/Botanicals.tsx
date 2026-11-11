import React, { useMemo } from "react";

/**
 * Procedural botanical line-work: leaves, blossoms, a wreath and a sprig.
 * Vector so they stay crisp, weigh nothing and recolour with the tokens.
 * A seeded RNG keeps the "hand-placed" jitter identical on every render.
 */

const LEAF = "M0 0 C4 -6.5 14 -7.5 21 0 C14 7.5 4 6.5 0 0Z";
const LEAF_TONES = ["var(--aa-sage)", "var(--aa-ink-soft)", "var(--aa-pistachio)", "var(--aa-sage)"];

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const deg = (r: number) => (r * 180) / Math.PI;

export const Blossom: React.FC<{ x: number; y: number; r?: number; tone?: string; className?: string }> = ({
  x,
  y,
  r = 7,
  tone = "var(--aa-blush)",
  className = "aa-bloom",
}) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={className}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.62} rx={r * 0.52} ry={r * 0.72} fill={tone} transform={`rotate(${a})`} opacity={0.95} />
      ))}
      <circle r={r * 0.26} fill="var(--aa-gold)" />
    </g>
  </g>
);

interface Leaf {
  x: number;
  y: number;
  rot: number;
  s: number;
  tone: string;
}

const Leaves: React.FC<{ leaves: Leaf[] }> = ({ leaves }) => (
  <>
    {leaves.map((l, i) => (
      <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.s.toFixed(2)})`}>
        <path className="aa-leaf" d={LEAF} fill={l.tone} />
      </g>
    ))}
  </>
);

/** Circular wreath, open at the bottom, two blossom clusters. viewBox 0 0 300 300. */
export const Wreath: React.FC<{ className?: string; seed?: number }> = ({ className, seed = 7 }) => {
  const { leaves, ring } = useMemo(() => {
    const rand = rng(seed);
    const cx = 150;
    const cy = 150;
    const R = 122;
    const out: Leaf[] = [];
    // Two branches meeting at the top, each sweeping from the bottom gap.
    const N = 22;
    for (const dir of [1, -1]) {
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const a = Math.PI / 2 + dir * (0.32 + t * (Math.PI - 0.42)); // radians, 90° = bottom
        const px = cx + Math.cos(a) * R;
        const py = cy + Math.sin(a) * R;
        const tangent = deg(a) + dir * 90; // pointing along the branch
        const side = i % 2 === 0 ? 1 : -1;
        out.push({
          x: px,
          y: py,
          rot: tangent + side * (34 + rand() * 18) * dir,
          s: 0.8 + (1 - Math.abs(t - 0.45)) * 0.45 + rand() * 0.15,
          tone: LEAF_TONES[(i + (dir > 0 ? 0 : 2)) % LEAF_TONES.length],
        });
      }
    }
    // The branch stem itself: a near-full circle with the bottom left open.
    const gap = 0.3;
    const a0 = Math.PI / 2 + gap;
    const a1 = Math.PI / 2 - gap + Math.PI * 2;
    const p = (a: number) => `${(cx + Math.cos(a) * R).toFixed(1)} ${(cy + Math.sin(a) * R).toFixed(1)}`;
    const ring = `M${p(a0)} A${R} ${R} 0 1 1 ${p(a1)}`;
    return { leaves: out, ring };
  }, [seed]);

  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <path className="aa-stem" d={ring} fill="none" stroke="var(--aa-ink-soft)" strokeWidth={1.1} strokeLinecap="round" pathLength={1} />
      <Leaves leaves={leaves} />
      <Blossom x={63} y={232} r={10} />
      <Blossom x={82} y={250} r={6.5} tone="#f6e3dd" />
      <Blossom x={237} y={232} r={10} />
      <Blossom x={218} y={250} r={6.5} tone="#f6e3dd" />
      <Blossom x={150} y={28} r={8} tone="#f6e3dd" />
    </svg>
  );
};

/** A single curved sprig with leaves and a blossom at the tip. viewBox 0 0 200 200. */
export const Sprig: React.FC<{ className?: string; seed?: number; bloom?: boolean }> = ({ className, seed = 3, bloom = true }) => {
  const { leaves, stem } = useMemo(() => {
    const rand = rng(seed);
    const P0 = [18, 190];
    const P1 = [50, 70];
    const P2 = [178, 26];
    const at = (t: number) => [
      (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
      (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
    ];
    const tan = (t: number) => {
      const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
      const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
      return deg(Math.atan2(dy, dx));
    };
    const out: Leaf[] = [];
    const N = 13;
    for (let i = 0; i < N; i++) {
      const t = 0.1 + (i / (N - 1)) * 0.82;
      const [x, y] = at(t);
      const side = i % 2 === 0 ? 1 : -1;
      out.push({
        x,
        y,
        rot: tan(t) + side * (38 + rand() * 16),
        s: 1.25 - t * 0.55 + rand() * 0.2,
        tone: LEAF_TONES[i % LEAF_TONES.length],
      });
    }
    return { leaves: out, stem: `M${P0.join(" ")} Q${P1.join(" ")} ${P2.join(" ")}` };
  }, [seed]);

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path className="aa-stem" d={stem} fill="none" stroke="var(--aa-ink-soft)" strokeWidth={1.2} strokeLinecap="round" pathLength={1} />
      <Leaves leaves={leaves} />
      {bloom && (
        <>
          <Blossom x={180} y={24} r={11} />
          <Blossom x={150} y={44} r={6} tone="#f6e3dd" />
        </>
      )}
    </svg>
  );
};

/** Corner spray for the invitation card. viewBox 0 0 120 120. */
export const Corner: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    <path d="M6 112 C 10 60, 40 20, 112 8" fill="none" stroke="var(--aa-ink-soft)" strokeWidth={1} />
    <Leaves
      leaves={[
        { x: 10, y: 92, rot: -60, s: 1.1, tone: "var(--aa-sage)" },
        { x: 14, y: 76, rot: -110, s: 1, tone: "var(--aa-pistachio)" },
        { x: 22, y: 58, rot: -40, s: 1.05, tone: "var(--aa-ink-soft)" },
        { x: 34, y: 42, rot: -100, s: 0.95, tone: "var(--aa-sage)" },
        { x: 50, y: 28, rot: -20, s: 0.9, tone: "var(--aa-pistachio)" },
        { x: 70, y: 18, rot: -80, s: 0.8, tone: "var(--aa-sage)" },
        { x: 88, y: 12, rot: 0, s: 0.75, tone: "var(--aa-ink-soft)" },
      ]}
    />
    <Blossom x={16} y={104} r={9} className="" />
    <Blossom x={30} y={110} r={5} tone="#f6e3dd" className="" />
    <Blossom x={110} y={9} r={6} className="" />
  </svg>
);

export const Cross: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 34" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
    <path d="M12 2v30M4 11h16" />
    <circle cx={12} cy={11} r={2.2} fill="currentColor" stroke="none" />
  </svg>
);
