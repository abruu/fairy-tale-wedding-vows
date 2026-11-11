import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { CalendarPlus } from "lucide-react";
import { SITE, calendarLink, photoSrc } from "../config";
import { Sprig } from "./Botanicals";
import { Countdown } from "./Countdown";

interface HeroProps {
  /** Flips true when the opening card parts — the entrance plays then. */
  revealed: boolean;
  reducedMotion: boolean;
  onEnter: () => void;
}

const PETAL_TONES = ["var(--aa-blush)", "#f6e3dd", "var(--aa-pistachio)", "#e9b8b0"];

export const Hero: React.FC<HeroProps> = ({ revealed, reducedMotion, onEnter }) => {
  const root = useRef<HTMLElement>(null);
  const played = useRef(false);
  const b = SITE.betrothal;
  const d = new Date(b.iso);
  const img = photoSrc(SITE.heroPhoto);

  // Hidden before first paint so nothing flashes as the card opens.
  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".aa-arch", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 18px 18px)" });
      gsap.set(".aa-arch img", { scale: 1.25 });
      gsap.set(".aa-arch-outline", { autoAlpha: 0, x: 14, y: -14 });
      gsap.set(".aa-hero-names .n", { clipPath: "inset(-30% 100% -30% -10%)" });
      gsap.set([".aa-hero .aa-eyebrow", ".aa-hero-names .amp", ".aa-hero-meta", ".aa-countdown", ".aa-hero-actions"], { autoAlpha: 0, y: 20 });
      gsap.set(".aa-hero-sprig .aa-leaf", { scale: 0, transformOrigin: "0% 50%" });
      gsap.set(".aa-hero-sprig .aa-bloom", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".aa-hero-sprig .aa-stem", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".aa-hero-badge", { scale: 0, rotate: -40 });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!revealed || reducedMotion || played.current || !root.current) return;
    played.current = true;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".aa-arch", { clipPath: "inset(0% 0% 0% 0% round 999px 999px 18px 18px)", duration: 1.5, ease: "power4.inOut" })
        .to(".aa-arch img", { scale: 1, duration: 2.4, ease: "power2.out" }, 0)
        .to(".aa-arch-outline", { autoAlpha: 1, x: 0, y: 0, duration: 1.2 }, 0.8)
        .to(".aa-hero .aa-eyebrow", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.4)
        .to(".aa-hero-names .n", { clipPath: "inset(-30% -10% -30% -10%)", duration: 1.4, stagger: 0.55, ease: "power2.inOut" }, 0.55)
        .to(".aa-hero-names .amp", { autoAlpha: 1, y: 0, duration: 0.8 }, 1.1)
        .to([".aa-hero-meta", ".aa-countdown", ".aa-hero-actions"], { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.6)
        .to(".aa-hero-sprig .aa-stem", { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 1)
        .to(".aa-hero-sprig .aa-leaf", { scale: 1, duration: 0.6, stagger: 0.03, ease: "back.out(2)" }, 1.25)
        .to(".aa-hero-sprig .aa-bloom", { scale: 1, duration: 0.7, stagger: 0.1, ease: "back.out(2.4)" }, 1.8)
        .to(".aa-hero-badge", { scale: 1, rotate: 0, duration: 1, ease: "back.out(1.8)" }, 1.7);
    }, root);
    // No revert on cleanup: reverting would snap everything back to hidden.
    return () => ctx.kill();
  }, [revealed, reducedMotion]);

  const petals = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        left: `${(i * 9.3 + 4) % 100}%`,
        "--c": PETAL_TONES[i % PETAL_TONES.length],
        "--t": `${13 + (i % 5) * 2.4}s`,
        "--d": `${-(i * 1.7)}s`,
        "--x": `${(i % 2 ? 1 : -1) * (30 + (i % 4) * 18)}px`,
        transform: `scale(${0.7 + (i % 3) * 0.2})`,
      })),
    [],
  );

  return (
    <section id="home" ref={root} style={{ position: "relative" }}>
      <div className="aa-hero-wash" aria-hidden="true" />
      {!reducedMotion && (
        <div className="aa-petals" aria-hidden="true">
          {petals.map((s, i) => (
            <i key={i} style={s as React.CSSProperties} />
          ))}
        </div>
      )}

      <div className="aa-hero">
        <div className="aa-hero-text">
          <p className="aa-eyebrow">
            Together with their families<span className="aa-hide-sm"> · </span>
            <br className="aa-show-sm" />
            The Betrothal of
          </p>

          <h1 className="aa-hero-names">
            <span className="n aa-script">{SITE.couple.bride}</span>
            <span className="amp">with</span>
            <span className="n aa-script">{SITE.couple.groom}</span>
          </h1>

          <div className="aa-hero-meta">
            <strong>{b.dateLabel}</strong>
            <span>
              {b.time} · {b.venue}
            </span>
          </div>

          <Countdown />

          <div className="aa-hero-actions">
            <button type="button" className="aa-btn" onClick={onEnter}>
              View Invitation
            </button>
            <a className="aa-btn aa-btn--ghost" href={calendarLink({ ...b, title: b.title })} target="_blank" rel="noopener noreferrer">
              <CalendarPlus size={15} aria-hidden="true" />
              Save the Date
            </a>
          </div>
        </div>

        <div className="aa-hero-photo">
          <div className="aa-arch-outline" aria-hidden="true" />
          <div className="aa-arch">
            <picture>
              <source type="image/webp" srcSet={`${photoSrc(SITE.heroPhoto, "sm").webp} 560w, ${img.webp} 853w`} sizes="(max-width: 820px) 74vw, 27rem" />
              <img src={img.jpg} alt={SITE.photos[0].alt} width={853} height={1280} fetchPriority="high" />
            </picture>
          </div>
          <Sprig className="aa-hero-sprig" seed={11} />
          <Sprig className="aa-hero-sprig aa-hero-sprig--top" seed={5} bloom={false} />
          <div className="aa-hero-badge" aria-hidden="true">
            <div>
              <b>{String(d.getDate()).padStart(2, "0")}</b>
              <small>{d.toLocaleDateString("en-GB", { month: "short" })} {d.getFullYear()}</small>
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="aa-scroll-cue" onClick={onEnter}>
        Scroll
      </button>
    </section>
  );
};
