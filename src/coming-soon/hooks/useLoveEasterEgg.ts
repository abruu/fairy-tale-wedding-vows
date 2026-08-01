import { useCallback, useEffect, useRef, useState } from "react";

/** Hearts, petals, golden particles and sparkles — one pool, mixed on spawn. */
const GLYPHS = ["♥", "❤", "✿", "❀", "✦", "✧", "·"];
const COLORS = ["#c07f76", "#d8a7a0", "#b79657", "#d9b978", "#f0dcae", "#e9d3cd"];

export interface LoveBit {
  id: number;
  glyph: string;
  color: string;
  x: number;
  y: number;
  scale: number;
  rot: number;
  size: number;
  delay: number;
  duration: number;
}

let seq = 0;

const buildBurst = (count: number): LoveBit[] =>
  Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const radius = 38 + Math.random() * 74;
    return {
      id: ++seq,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: Math.cos(angle) * radius,
      // Bias upward so the burst floats rather than falls
      y: Math.sin(angle) * radius - 30,
      scale: 0.7 + Math.random() * 0.9,
      rot: (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 160),
      size: 10 + Math.random() * 13,
      delay: Math.random() * 0.18,
      duration: 1.3 + Math.random() * 0.6,
    };
  });

/**
 * Drives the heart easter egg: a ~1.5–2s bloom of hearts, petals and golden
 * sparkles, plus a whispered line that fades in and out afterwards.
 * Particle count is halved on light devices; reduced motion shows only the
 * whisper, with no particles at all.
 */
export const useLoveEasterEgg = (reduced: boolean, light = false) => {
  const [bits, setBits] = useState<LoveBit[]>([]);
  const [whisper, setWhisper] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const burst = useCallback(() => {
    clearTimers();
    if (!reduced) setBits(buildBurst(light ? 9 : 16));
    setWhisper(true);
    timers.current.push(
      window.setTimeout(() => setBits([]), 2000),
      window.setTimeout(() => setWhisper(false), 3200),
    );
  }, [reduced, light]);

  useEffect(() => clearTimers, []);

  return { burst, bits, whisper };
};
