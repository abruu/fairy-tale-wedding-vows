import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate } from "../../lib/format";

interface OpeningExperienceProps {
  /** Starts the background song. Called synchronously inside the tap, so the browser allows sound. */
  onStart: () => void;
  /** Called as the card starts lifting away (the hero begins animating in) */
  onOpening: () => void;
  /** Called once the overlay is fully out of the way */
  onComplete: () => void;
}

/** Where the arch window sits, in viewport px — measured from the layout. */
interface Arch {
  top: number;
  left: number;
  width: number;
  height: number;
  vw: number;
  vh: number;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SWEEP: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Opening timeline, seconds after the tap */
const T_EXPAND = 0.25; // arch grows to fill the screen
const T_LIFT = 1.3; // whole card lifts away
const D_EXPAND = 1.05;
const D_LIFT = 1.05;

const rise = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE_OUT } },
});
const letters: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 1.25 } },
};
const letter: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE_OUT } },
};

/** inset() clip for a rect with a semicircular top — the arch window. */
const archClip = (a: Arch, collapsed = false) => {
  const r = a.width / 2;
  const top = collapsed ? a.top + a.height : a.top;
  return `inset(${top}px ${a.vw - a.left - a.width}px ${a.vh - a.top - a.height}px ${a.left}px round ${r}px ${r}px 0px 0px)`;
};
const FULL_CLIP = "inset(0px 0px 0px 0px round 0px 0px 0px 0px)";

/** Hairline arch outline, 10px outside the photo, legs running past its foot. */
const outlinePath = (a: Arch) => {
  const g = 10;
  const l = a.left - g;
  const rgt = a.left + a.width + g;
  const r = a.width / 2 + g;
  const foot = a.top + a.height + 28;
  return `M ${l} ${foot} V ${a.top - g + r} A ${r} ${r} 0 0 1 ${rgt} ${a.top - g + r} V ${foot}`;
};

/**
 * Opening screen — an editorial invitation card. The couple's photo rises
 * into a tall arch window while a hairline outline draws around it; the names
 * arrive letter by letter in oversized italics, overlapping the arch's foot.
 * A rotating "Tap to open" seal sits beneath.
 *
 * On open the copy lifts away, the arch expands to fill the screen, and the
 * whole card slides up like a turned page to uncover the hero (already
 * mounted underneath). Reduced-motion visitors never mount this — see WeddingV2.
 */
export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onStart, onOpening, onComplete }) => {
  const [opening, setOpening] = useState(false);
  const [arch, setArch] = useState<Arch | null>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { lang, t } = useLang();
  const [first, second] = couplePeople(lang);

  // The photo + outline are drawn in viewport coordinates, matched to the
  // placeholder box the CSS lays out (so text and arch always line up).
  useLayoutEffect(() => {
    const measure = () => {
      const el = archRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setArch({ top: r.top, left: r.left, width: r.width, height: r.height, vw: window.innerWidth, vh: window.innerHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (archRef.current) ro.observe(archRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // The page underneath must not scroll while the opening screen is up.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const open = useCallback(() => {
    if (opening) return;
    // Must run synchronously in the tap handler (no await before it) or the
    // browser blocks audible playback.
    onStart();
    setOpening(true);
    window.setTimeout(onOpening, T_LIFT * 1000);
  }, [opening, onStart, onOpening]);

  // English names arrive letter by letter; Malayalam as whole words, since
  // splitting its conjuncts would break the shaping.
  const split = (text: string) => (lang === "en" ? Array.from(text) : [text]);
  const nameParts = [
    ...split(first.name).map((c) => ({ c, amp: false })),
    { c: "&", amp: true },
    ...split(second.name).map((c) => ({ c, amp: false })),
  ];

  const [y, m, d] = WEDDING_CONFIG.weddingDate.split("-");
  const copyExit = { opacity: 0, y: -14, transition: { duration: 0.45, ease: EASE_OUT } };

  return (
    <motion.div
      className={`v2-intro ${opening ? "is-opening" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${first.nameEn} & ${second.nameEn}`}
      // Lenis must ignore wheel/touch over the overlay, or it scrolls the page behind
      data-lenis-prevent
      onClick={open}
      initial={{ y: 0 }}
      animate={{ y: opening ? "-100%" : 0 }}
      transition={{ duration: D_LIFT, delay: opening ? T_LIFT : 0, ease: EASE_SWEEP }}
      onAnimationComplete={() => {
        if (opening) onComplete();
      }}
    >
      <div className="v2-intro-aura" aria-hidden="true" />

      {/* Photo in the arch window — grows up into the arch, then fills the screen on open */}
      {arch && (
        <motion.div
          className="v2-intro-photo"
          aria-hidden="true"
          initial={{ clipPath: archClip(arch, true) }}
          animate={{ clipPath: opening ? FULL_CLIP : archClip(arch), y: opening ? "22%" : 0 }}
          transition={{
            clipPath: opening
              ? { duration: D_EXPAND, delay: T_EXPAND, ease: EASE_SWEEP }
              : { duration: 1.5, delay: 0.25, ease: EASE_OUT },
            y: { duration: D_LIFT, delay: T_LIFT, ease: EASE_SWEEP },
          }}
        >
          {/* Sized to the arch at rest (so the whole portrait shows, even on wide
              screens), then grown to the full viewport in step with the clip */}
          <motion.img
            src={WEDDING_CONFIG.intro.photo}
            alt=""
            initial={{ top: arch.top, left: arch.left, width: arch.width, height: arch.height, scale: 1.22 }}
            animate={
              opening
                ? { top: 0, left: 0, width: arch.vw, height: arch.vh, scale: 1 }
                : { top: arch.top, left: arch.left, width: arch.width, height: arch.height, scale: 1.04 }
            }
            transition={
              opening
                ? { duration: D_EXPAND, delay: T_EXPAND, ease: EASE_SWEEP }
                : { duration: 2.6, delay: 0.25, ease: EASE_OUT, top: { duration: 0 }, left: { duration: 0 }, width: { duration: 0 }, height: { duration: 0 } }
            }
          />
          <motion.span
            className="v2-intro-photo-shade"
            animate={{ opacity: opening ? 0.35 : 1 }}
            transition={{ duration: 0.8, delay: opening ? T_EXPAND : 0 }}
          />
        </motion.div>
      )}

      {/* Hairline outline drawn around the arch */}
      {arch && (
        <motion.svg
          className="v2-intro-outline"
          aria-hidden="true"
          viewBox={`0 0 ${arch.vw} ${arch.vh}`}
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.path
            d={outlinePath(arch)}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7, ease: EASE_OUT }}
          />
        </motion.svg>
      )}

      {/* Corner labels */}
      <motion.div className="v2-intro-corners" initial="hidden" animate={opening ? copyExit : "show"} variants={rise(0.4)}>
        <T k="intro.saveTheDate" className="v2-intro-corner" />
        <span className="v2-intro-corner" lang="en">
          {d} · {m} · {y}
        </span>
      </motion.div>

      {/* Copy, laid out around the arch placeholder */}
      <motion.div className="v2-intro-content" initial="hidden" animate={opening ? copyExit : "show"}>
        <motion.p variants={rise(0.9)} className="v2-intro-eyebrow">
          <T k="intro.eyebrow" />
        </motion.p>

        <div ref={archRef} className="v2-intro-arch" aria-hidden="true" />

        <motion.h1 className="v2-intro-names" lang={lang} variants={letters} aria-label={`${first.name} & ${second.name}`}>
          {nameParts.map((p, i) => (
            <motion.span key={i} variants={letter} className={p.amp ? "v2-amp" : undefined} aria-hidden="true">
              {p.c}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p variants={rise(2.05)} className="v2-intro-date" lang={lang}>
          {formatDate(WEDDING_CONFIG.weddingDate, lang)}
        </motion.p>

        {/* Seal-style button: rotating ring of text around an arrow that points the way the card lifts */}
        <motion.div
          className="v2-intro-cta-wrap"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 2.35, ease: EASE_OUT } },
          }}
        >
          <button
            ref={buttonRef}
            type="button"
            className="v2-intro-cta"
            aria-label={t("intro.open")}
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            <svg className="v2-intro-cta-ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="v2-intro-circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
              </defs>
              <text>
                <textPath href="#v2-intro-circle" textLength="250" lengthAdjust="spacing">
                  TAP TO OPEN ✦ TAP TO OPEN ✦
                </textPath>
              </text>
            </svg>
            <span className="v2-intro-cta-core" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
          </button>
          {lang === "ml" && <T k="intro.open" as="p" className="v2-intro-cta-caption" />}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
