import React, { useMemo, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCountdown } from "../../hooks/useCountdown";
import { useHasPassed } from "../../hooks/useHasPassed";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";

interface HeroSectionProps {
  onEnter?: () => void;
  /**
   * Starts the entrance choreography. The hero is mounted underneath the
   * envelope intro, so it holds its "before" pose until the intro's light
   * bloom begins to fade — otherwise the whole entrance would play unseen.
   */
  play?: boolean;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "long" }),
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    year: d.toLocaleDateString("en-GB", { year: "numeric" }),
  };
};

const pad = (n: number) => String(n).padStart(2, "0");

/* ─── Choreography (seconds from `play`) ───
   0.0  photo opens from a framed card to full bleed
   0.55 eyebrow rules draw in
   0.75 names rise letter by letter through a mask
   1.25 ampersand settles
   1.45 date → venue → countdown → CTA cascade
   2.3  scroll cue                                                      */
const media: Variants = {
  hidden: { clipPath: "inset(14% 12% 14% 12% round 32px)", scale: 1.3 },
  show: {
    clipPath: "inset(0% 0% 0% 0% round 0px)",
    scale: 1,
    transition: { duration: 1.8, ease: EASE_IN_OUT },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: EASE_OUT },
  }),
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: (delay: number) => ({ scaleX: 1, transition: { duration: 1.1, delay, ease: EASE_OUT } }),
};

const letter: Variants = {
  hidden: { y: "115%", rotate: 8 },
  show: (delay: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1.1, delay, ease: EASE_OUT },
  }),
};

const amp: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -18 },
  show: (delay: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.2, delay, ease: EASE_OUT },
  }),
};

/** A name whose letters rise one by one through a clipping mask. */
const SplitName: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
  <span className="v2-hero2-name" aria-hidden="true">
    {Array.from(text).map((ch, i) => (
      <span key={i} className="v2-hero2-mask">
        <motion.span className="v2-hero2-letter" variants={letter} custom={delay + i * 0.05}>
          {ch === " " ? " " : ch}
        </motion.span>
      </span>
    ))}
  </span>
);

/** Days / hours / mins / secs — each digit pair rolls when it changes. */
const HeroCountdown: React.FC<{ label: string; target: string; completeText: string }> = ({
  label,
  target,
  completeText,
}) => {
  const { timeLeft } = useCountdown(target);
  const units = [
    { v: timeLeft.days, l: "Days" },
    { v: timeLeft.hours, l: "Hours" },
    { v: timeLeft.minutes, l: "Mins" },
    { v: timeLeft.seconds, l: "Secs" },
  ];

  return (
    <div className="v2-hero2-countdown" role="timer" aria-label={label}>
      <span className="v2-hero2-countdown-label">{label}</span>
      {timeLeft.isComplete ? (
        <span className="v2-hero2-countdown-done">{completeText}</span>
      ) : (
        <div className="v2-hero2-countdown-units">
          {units.map((u) => (
            <div key={u.l} className="v2-hero2-unit">
              <span className="v2-hero2-unit-value">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={u.v}
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    {pad(u.v)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="v2-hero2-unit-label">{u.l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Hero — phones: full-bleed portrait with the faces left clear and every
 * line of copy gathered into the lower half. Landscape ≥ 900px: an editorial
 * split, copy on the left and the photo as a full-height panel on the right
 * with the scripture set as a caption on it. The entrance is a choreographed
 * sequence (see above) triggered by `play`; scroll then drives a gentle
 * parallax and fade-out.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onEnter, play = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);

  // The headline event depends on whose family sent the invite (see config).
  const { featured } = WEDDING_CONFIG.invite;
  const featuredDate = useMemo(() => formatDate(WEDDING_CONFIG.dates[featured.dateKey]), [featured]);
  const engagementDate = useMemo(() => formatDate(WEDDING_CONFIG.dates.engagement), []);
  // Only "has it happened?" is needed here — the ticking lives inside
  // HeroCountdown, so the rest of the hero doesn't re-render every second.
  const betrothalPassed = useHasPassed(WEDDING_CONFIG.dates.engagement);
  // First names only — the full names are set in the Invitation section.
  const { shortName1: name1, shortName2: name2, displayNames, tagline } = WEDDING_CONFIG.couple;
  const venue = WEDDING_CONFIG.events[featured.eventKey].venueShort;
  // Bride's-family invite counts down to the betrothal until it has passed;
  // otherwise (and afterwards) the countdown is to the wedding.
  const countBetrothal = featured.dateKey === "engagement" && !betrothalPassed;

  // Reduced motion: render the final pose straight away.
  const initial = reduced ? false : "hidden";
  const animate = play || reduced ? "show" : "hidden";

  return (
    <motion.section
      id="hero"
      ref={sectionRef}
      className="v2-hero2"
      initial={initial}
      animate={animate}
    >
      {/* ── Photo ── */}
      <motion.div className="v2-hero2-media" style={{ y: mediaY }}>
        <motion.div className="v2-hero2-reveal" variants={media}>
          <img
            className="v2-hero2-img"
            src={WEDDING_CONFIG.media.heroBgImage}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        <div className="v2-hero2-shade" aria-hidden="true" />

        {WEDDING_CONFIG.scripture && (
          <motion.figure className="v2-hero2-scripture" variants={rise} custom={2.1}>
            <blockquote>{WEDDING_CONFIG.scripture.quote}</blockquote>
            <figcaption>{WEDDING_CONFIG.scripture.reference}</figcaption>
          </motion.figure>
        )}
      </motion.div>

      <div className="v2-hero2-ambient" aria-hidden="true" />
      <FloatingOrnaments count={6} variant="sparkles" />

      {/* ── Copy ── */}
      <motion.div className="v2-hero2-content" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="v2-hero2-eyebrow">
          <motion.span className="v2-hero2-rule v2-hero2-rule--l" variants={rule} custom={0.55} aria-hidden="true" />
          <motion.span variants={rise} custom={0.6}>
            {tagline}
          </motion.span>
          <motion.span className="v2-hero2-rule v2-hero2-rule--r" variants={rule} custom={0.55} aria-hidden="true" />
        </div>

        <h1 className="v2-hero2-names" aria-label={displayNames}>
          <SplitName text={name1} delay={0.75} />
          <motion.span className="v2-hero2-amp" variants={amp} custom={1.25} aria-hidden="true">
            &amp;
          </motion.span>
          <SplitName text={name2} delay={0.75 + name1.length * 0.05 + 0.15} />
        </h1>

        <motion.p className="v2-hero2-date" variants={rise} custom={1.45}>
          <span>{featuredDate.weekday}</span>
          <i aria-hidden="true" />
          <span>
            {featuredDate.day} {featuredDate.month} {featuredDate.year}
          </span>
        </motion.p>
        <motion.p className="v2-hero2-venue" variants={rise} custom={1.55}>
          {venue}
        </motion.p>

        {/* Wedding countdown — except on the bride's-family invite, which
            counts to the betrothal first. Once the betrothal has passed it is
            noted beneath the wedding countdown. */}
        <motion.div className="v2-hero2-countdown-wrap" variants={rise} custom={1.7}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={countBetrothal ? "betrothal" : "wedding"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
            >
              {countBetrothal ? (
                <HeroCountdown
                  label="Until our betrothal"
                  target={WEDDING_CONFIG.dates.engagement}
                  completeText="Celebrated"
                />
              ) : (
                <>
                  <HeroCountdown
                    label="Until our wedding"
                    target={WEDDING_CONFIG.dates.wedding}
                    completeText="United Forever"
                  />
                  {betrothalPassed && (
                    <p className="v2-hero2-countdown-note">
                      {WEDDING_CONFIG.countdown.pastEngagementLabel} · {engagementDate.day} {engagementDate.month}{" "}
                      {engagementDate.year}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div className="v2-hero2-actions" variants={rise} custom={1.9}>
          <motion.button
            type="button"
            className="v2-btn v2-btn-gold v2-hero2-cta"
            onClick={() => onEnter?.()}
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            View Invitation
            <ArrowDown size={15} strokeWidth={1.8} aria-hidden="true" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll cue — a bead travelling down a hairline */}
      <motion.button
        type="button"
        className="v2-hero2-scroll"
        onClick={() => onEnter?.()}
        variants={rise}
        custom={2.3}
        aria-label="Scroll to invitation"
      >
        <span>Scroll</span>
        <i aria-hidden="true" />
      </motion.button>
    </motion.section>
  );
};
