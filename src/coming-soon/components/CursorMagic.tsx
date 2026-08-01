import { useEffect, useRef, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  glyph: string;
  size: number;
  drift: number;
}

const GLYPHS = ["✦", "✧", "·", "♥"];
const MAX_ALIVE = 10;
const SPAWN_GAP_MS = 190;
const LIFE_MS = 900;

let seq = 0;

/**
 * A soft warm glow that follows the pointer, plus the occasional tiny sparkle.
 * Desktop only for the trail; touch devices get a single sparkle burst on tap.
 * Deliberately capped at a handful of live particles so it stays free.
 */
export const CursorMagic = ({ enabled }: { enabled: boolean }) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    let last = 0;
    let px = 0;
    let py = 0;

    const spawn = (x: number, y: number, count: number) => {
      const born: Spark[] = Array.from({ length: count }, () => ({
        id: ++seq,
        x,
        y,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        size: 7 + Math.random() * 7,
        drift: (Math.random() - 0.5) * 34,
      }));
      setSparks((prev) => [...prev, ...born].slice(-MAX_ALIVE));
      const id = window.setTimeout(() => {
        const ids = new Set(born.map((b) => b.id));
        setSparks((prev) => prev.filter((s) => !ids.has(s.id)));
      }, LIFE_MS);
      timers.current.push(id);
    };

    const paint = () => {
      frame = 0;
      const el = glowRef.current;
      if (el) el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);

      const now = e.timeStamp;
      if (now - last > SPAWN_GAP_MS && Math.random() > 0.55) {
        last = now;
        spawn(e.clientX, e.clientY, 1);
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      spawn(e.clientX, e.clientY, 3);
    };

    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cs-magic" aria-hidden="true">
      <div ref={glowRef} className="cs-magic__glow" />
      {sparks.map((s) => (
        <span
          key={s.id}
          className="cs-magic__spark"
          style={
            {
              left: `${s.x}px`,
              top: `${s.y}px`,
              "--spark-size": `${s.size}px`,
              "--spark-drift": `${s.drift}px`,
            } as React.CSSProperties
          }
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
};

export default CursorMagic;
