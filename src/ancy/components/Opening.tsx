import React, { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SITE } from "../config";
import { Wreath } from "./Botanicals";

interface OpeningProps {
  /** Start the song — must run synchronously inside the tap for autoplay rules. */
  onStart: () => void;
  /** Card halves begin to part — the hero starts its own entrance here. */
  onReveal: () => void;
  /** Overlay fully gone — unmount it. */
  onComplete: () => void;
  reducedMotion: boolean;
}

const BURST_TONES = ["var(--aa-blush)", "#f6e3dd", "var(--aa-pistachio)", "var(--aa-rose)", "var(--aa-sage)"];

/**
 * Opening — a gatefold invitation card. On load the wreath draws itself
 * (stem, then leaves, then blossoms) around the A & A monogram. On tap the
 * seal breaks into a burst of petals and the two halves swing open in 3D
 * onto the already-mounted hero.
 */
export const Opening: React.FC<OpeningProps> = ({ onStart, onReveal, onComplete, reducedMotion }) => {
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".aa-open-stage > *", { autoAlpha: 0, y: 18 });
      gsap.set(".aa-open-seal", { autoAlpha: 1, y: 0 });
      gsap.set(".aa-open-seal .aa-stem", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".aa-open-seal .aa-leaf", { scale: 0, transformOrigin: "0% 50%" });
      gsap.set(".aa-open-seal .aa-bloom", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".aa-open-mono", { autoAlpha: 0, scale: 0.85, filter: "blur(10px)" });

      gsap
        .timeline({ delay: 0.25, defaults: { ease: "power3.out" } })
        .to(".aa-open-seal .aa-stem", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" })
        .to(".aa-open-seal .aa-leaf", { scale: 1, duration: 0.7, stagger: { each: 0.025, from: "edges" }, ease: "back.out(2)" }, 0.35)
        .to(".aa-open-seal .aa-bloom", { scale: 1, duration: 0.8, stagger: 0.08, ease: "back.out(2.4)" }, 1.1)
        .to(".aa-open-mono", { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.1 }, 0.9)
        .to(".aa-open-stage > *:not(.aa-open-seal)", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.4);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  const open = useCallback(() => {
    if (opened.current) return;
    opened.current = true;
    onStart();

    const el = root.current;
    if (reducedMotion || !el) {
      onReveal();
      if (el) gsap.to(el, { autoAlpha: 0, duration: 0.4, onComplete });
      else onComplete();
      return;
    }

    // Belt and braces: whatever happens to the timeline, the site opens.
    const safety = window.setTimeout(onComplete, 4500);
    const q = gsap.utils.selector(el);
    const petals = q(".aa-burst i");

    gsap
      .timeline({
        // A quick tap can land mid-intro; "auto" kills the intro's
        // conflicting tweens so the exit always wins.
        defaults: { ease: "power3.inOut", overwrite: "auto" },
        onComplete: () => {
          window.clearTimeout(safety);
          onComplete();
        },
      })
      .to(q(".aa-open-stage > *:not(.aa-open-seal)"), { autoAlpha: 0, y: -12, duration: 0.35, stagger: 0.04, ease: "power2.in" })
      .to(q(".aa-open-seal"), { scale: 1.08, duration: 0.25, ease: "power2.out" }, 0.1)
      .to(q(".aa-open-seal"), { scale: 0.2, rotate: 40, autoAlpha: 0, duration: 0.55, ease: "power3.in" }, 0.35)
      .fromTo(
        petals,
        { x: 0, y: 0, scale: 0.4, rotate: 0, autoAlpha: 1 },
        {
          x: () => gsap.utils.random(-1, 1) * window.innerWidth * 0.55,
          y: () => gsap.utils.random(-1, 1) * window.innerHeight * 0.55,
          rotate: () => gsap.utils.random(-540, 540),
          scale: () => gsap.utils.random(0.8, 1.6),
          autoAlpha: 0,
          duration: 1.6,
          ease: "power2.out",
          stagger: 0.01,
        },
        0.55,
      )
      .add(onReveal, 0.7)
      .to(q(".aa-open-panel--l"), { rotateY: -96, xPercent: -18, duration: 1.4 }, 0.7)
      .to(q(".aa-open-panel--r"), { rotateY: 96, xPercent: 18, duration: 1.4 }, 0.7)
      .to(q(".aa-open-shade"), { opacity: 1, duration: 0.9, ease: "power1.in" }, 0.7)
      .to(el, { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, 1.7);
  }, [onStart, onReveal, onComplete, reducedMotion]);

  const [b, g] = [SITE.couple.bride, SITE.couple.groom];
  const date = new Date(SITE.betrothal.iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");

  return (
    <div ref={root} className="aa-open" onClick={open} role="dialog" aria-label={`Invitation — ${b} & ${g}`}>
      <div className="aa-open-panel aa-open-panel--l">
        <div className="aa-open-shade" />
      </div>
      <div className="aa-open-panel aa-open-panel--r">
        <div className="aa-open-shade" />
      </div>

      <div className="aa-open-stage">
        <p className="aa-eyebrow">The Betrothal of</p>
        <div className="aa-open-seal">
          <Wreath />
          <div className="aa-open-mono aa-script" aria-hidden="true">
            {SITE.couple.monogram[0]}
            <span className="amp">&amp;</span>
            {SITE.couple.monogram[1]}
          </div>
        </div>
        <h1 className="aa-open-names">
          {b} <span style={{ color: "var(--aa-rose)" }}>&amp;</span> {g}
        </h1>
        <p className="aa-open-date">
          {dd} · {mm} · {date.getFullYear()}
        </p>
        <button
          type="button"
          className="aa-btn aa-open-cta"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          autoFocus
        >
          Open the Invitation
        </button>
        <p className="aa-open-hint">Best enjoyed with sound on</p>
      </div>

      <div className="aa-burst" aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => (
          <i key={i} style={{ "--c": BURST_TONES[i % BURST_TONES.length] } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
};
