import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { SectionHeader } from "../shared/SectionHeader";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface OurStorySectionProps {
  /** Scrolls to an element id through the page's Lenis-aware navigator. */
  onNavigate?: (id: string) => void;
}

const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const pad = (n: number) => String(n).padStart(2, "0");
/**
 * transform-origin that leaves point `c` (0–100) centred after scaling by
 * `s`: the visible centre is o + (50 − o)/s, solved for o and clamped so
 * the frame never shows past the photo's edge.
 */
const originFor = (c: number, s: number) =>
  s <= 1 ? 50 : Math.min(100, Math.max(0, (c - 50 / s) / (1 - 1 / s)));

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** One progress bar per chapter, filling as that chapter's stretch is scrolled. */
const Segment: React.FC<{
  progress: MotionValue<number>;
  index: number;
  count: number;
  label: string;
  active: boolean;
  onSelect: () => void;
}> = ({ progress, index, count, label, active, onSelect }) => {
  const fill = useTransform(progress, [index / count, (index + 1) / count], [0, 1], { clamp: true });
  return (
    <button
      type="button"
      className={`v2-journey-seg ${active ? "is-active" : ""}`}
      onClick={onSelect}
      aria-label={`Chapter ${index + 1}: ${label}`}
      aria-current={active ? "step" : undefined}
    >
      <span className="v2-journey-seg-track">
        <motion.span className="v2-journey-seg-fill" style={{ scaleX: fill }} />
      </span>
      <span className="v2-journey-seg-label">{label}</span>
    </button>
  );
};

/**
 * "Our Journey" — scrollytelling. The track is one screen plus ~a third
 * of a screen per chapter (CSS --chapter-scroll); inside it a 100vh stage stays pinned (position: sticky) while scrolling
 * advances the chapter: the arched frame "camera" glides to that chapter's
 * focus on the photo, the copy swaps with a staggered rise, and the
 * segmented bar fills. Every chapter's copy stays in the DOM (stacked in one
 * grid cell), so the stage never changes height mid-scroll.
 */
export const OurStorySection: React.FC<OurStorySectionProps> = ({ onNavigate }) => {
  const items = WEDDING_CONFIG.story.items;
  const count = items.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
    setActive((prev) => (prev === i ? prev : i));
  });
  // A slow push-in across the whole journey, on top of each chapter's framing.
  const drift = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);

  const dateFor = (event?: "engagement" | "wedding") =>
    event ? formatDate(WEDDING_CONFIG.dates[event]) : null;

  return (
    <section id="story" className="v2-journey">
      <div className="v2-journey-head">
        <SectionHeader
          eyebrow="Our Journey"
          title="How it all began"
          subtitle="Every love story is beautiful, but ours is our favorite"
          variant="dark"
        />
      </div>

      <div
        ref={trackRef}
        className="v2-journey-track"
        style={{ "--n": count } as React.CSSProperties}
      >
        {/* Scroll targets for the chapter buttons — each lands a little way
            into its chapter's stretch so it is unambiguously active. */}
        {items.map((_, i) => (
          <span
            key={i}
            id={`story-ch-${i}`}
            className="v2-journey-anchor"
            style={{ top: i === 0 ? 0 : `calc(${i + 0.3} * var(--chapter-scroll) * 1svh)` }}
            aria-hidden="true"
          />
        ))}

        <div className="v2-journey-stage">
          <div className="v2-journey-inner">
            {/* ── Arched frame ── */}
            <div className="v2-journey-visual">
              <div className="v2-journey-frame">
                <motion.div className="v2-journey-zoom" style={{ scale: drift }}>
                  {items.map((it, i) => {
                    const f = it.focus ?? { x: 50, y: 40, scale: 1 };
                    return (
                      <img
                        key={i}
                        src={it.image ?? WEDDING_CONFIG.media.heroBgImage}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={`v2-journey-img ${i === active ? "is-active" : ""}`}
                        style={
                          {
                            transformOrigin: `${originFor(f.x, f.scale)}% ${originFor(f.y, f.scale)}%`,
                            "--s": f.scale,
                          } as React.CSSProperties
                        }
                      />
                    );
                  })}
                </motion.div>
                <span className="v2-journey-frame-line" aria-hidden="true" />
              </div>

              <div className="v2-journey-counter" aria-hidden="true">
                <span className="v2-journey-counter-num">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {pad(active + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="v2-journey-counter-total">/ {pad(count)}</span>
              </div>
            </div>

            {/* ── Copy ── */}
            <div className="v2-journey-copy">
              <div className="v2-journey-chapters">
                {items.map((it, i) => {
                  const date = dateFor(it.event);
                  const state = i === active ? "is-active" : i < active ? "is-past" : "is-next";
                  return (
                    <article key={i} className={`v2-journey-chapter ${state}`}>
                      <p className="v2-journey-label">
                        <span>Chapter {ORDINALS[i] ?? i + 1}</span>
                        <i aria-hidden="true" />
                        <span>{it.label}</span>
                        {date && <em>{date}</em>}
                      </p>
                      <h3 className="v2-journey-title">{it.title}</h3>
                      <p className="v2-journey-text">{it.content}</p>
                    </article>
                  );
                })}
              </div>

              <nav className="v2-journey-segs" aria-label="Journey chapters">
                {items.map((it, i) => (
                  <Segment
                    key={i}
                    progress={scrollYProgress}
                    index={i}
                    count={count}
                    label={it.label}
                    active={i === active}
                    onSelect={() => onNavigate?.(`story-ch-${i}`)}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
