import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { WEDDING_CONFIG } from "@/config/dates";

export interface WishEnvelopeHandle {
  /** Letter writes on → slips into the envelope → flap folds shut → wax seal stamps. */
  sealUp: () => Promise<void>;
  /** Envelope lifts away with a trail of gold. Held until the send succeeds. */
  flyOff: () => Promise<void>;
  /** Return every part to its start pose so another wish can be sent. */
  reset: () => void;
}

interface WishEnvelopeProps {
  /** Committed at submit time — signs the letter and the envelope. */
  name: string;
  /** Committed at submit time — the body of the letter. */
  message: string;
}

const { shortName1, shortName2 } = WEDDING_CONFIG.couple;
const MONOGRAM = `${shortName1[0] ?? ""}&${shortName2[0] ?? ""}`;
const BURST = 10;
const TRAIL = 7;

/** Start poses — shared by the mount-time warm-up and reset(). */
const startPose = (q: (s: string) => Element[], scene: HTMLElement | null) => {
  gsap.set(scene, { opacity: 0, visibility: "hidden" });
  gsap.set(q(".v2-env"), { x: 0, y: 40, rotate: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 0 });
  // Open: rotated up over the hinge, behind the letter.
  gsap.set(q(".v2-env-flap"), { rotateX: 180, transformPerspective: 900, transformOrigin: "50% 0%", zIndex: 1 });
  gsap.set(q(".v2-env-letter"), { yPercent: -55, rotate: -3, scale: 0.92, opacity: 0 });
  gsap.set(q(".v2-env-letter-body"), { clipPath: "inset(0% 0% 100% 0%)" });
  gsap.set(q(".v2-env-sign-char"), { opacity: 0, y: 4 });
  gsap.set(q(".v2-env-seal"), { scale: 2.4, opacity: 0, y: -46, rotate: -28 });
  gsap.set(q(".v2-env-ring"), { scale: 0.5, opacity: 0 });
  gsap.set(q(".v2-env-burst i"), { x: 0, y: 0, scale: 1, opacity: 0 });
  gsap.set(q(".v2-env-sheen span"), { xPercent: -160 });
  gsap.set(q(".v2-env-from"), { opacity: 0, y: 6 });
  gsap.set(q(".v2-env-trail i"), { x: 0, y: 0, scale: 1, opacity: 0 });
};

/**
 * The wishes-form envelope — the same cream-and-gold paper and burgundy wax
 * seal as the opening video, so the guest's reply "closes the loop" on the
 * invitation they opened.
 *
 * Sequence (sealUp): the envelope rises in already open; the guest's letter
 * ("Dear Elsa & Abrin, …") inks on top to bottom and is signed; it slips
 * down into the pocket and the envelope dips under its weight; the flap
 * folds shut in 3D; the wax seal drops and stamps with a gold shockwave and
 * sparks; a sheen of light crosses the paper. While the request is in
 * flight the sealed envelope breathes gently. flyOff: a small anticipation
 * dip, then it lifts away on a comet trail of gold.
 *
 * GSAP owns all of it — the one deliberate exception to the project's
 * framer-motion-for-components split, because the choreography needs a
 * single timeline across many elements. Parts are inline SVG/CSS (not
 * <img>) so each can be transformed independently with nothing to fetch.
 *
 * Z-order: the flap's 3D turn uses its own transformPerspective rather than
 * a preserve-3d parent, so sibling z-index still applies. Open, the flap
 * sits behind the letter (z 1); halfway through closing it is lifted above
 * the letter and pocket (z 5).
 */
export const WishEnvelope = forwardRef<WishEnvelopeHandle, WishEnvelopeProps>(
  ({ name, message }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const idleRef = useRef<gsap.core.Tween | null>(null);

    // Warm-up: cache targets + establish start poses before any tap.
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        startPose(gsap.utils.selector(rootRef), rootRef.current);
        gsap.set(".v2-env", { willChange: "transform, opacity" });
      }, rootRef);
      return () => ctx.revert();
    }, []);

    useImperativeHandle(ref, () => ({
      sealUp: () =>
        new Promise<void>((resolve) => {
          const q = gsap.utils.selector(rootRef);
          const burst = q(".v2-env-burst i");

          gsap
            .timeline({
              onComplete: () => {
                // Gentle "breathing" while the request is still in flight.
                idleRef.current = gsap.to(q(".v2-env"), {
                  y: -6,
                  rotate: 0.8,
                  duration: 1.6,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                });
                resolve();
              },
            })
            // 1 — scene in: envelope rises open, the letter lifts out of it
            .set(rootRef.current, { visibility: "visible" })
            .to(rootRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
            .to(q(".v2-env"), { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "<")
            .to(
              q(".v2-env-letter"),
              { yPercent: -102, rotate: -2, scale: 1, opacity: 1, duration: 0.85, ease: "power3.out" },
              "<0.1",
            )
            // 2 — the message inks on, top to bottom, then it is signed
            .to(
              q(".v2-env-letter-body"),
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power1.inOut" },
              "-=0.25",
            )
            .to(q(".v2-env-sign-char"), { opacity: 1, y: 0, duration: 0.22, stagger: 0.04, ease: "power2.out" }, "-=0.2")
            // 3 — the letter slips down into the pocket…
            .to(q(".v2-env-letter"), { yPercent: 0, rotate: 0, duration: 0.75, ease: "power3.inOut" }, "+=0.35")
            // …and the envelope dips under its weight
            .to(q(".v2-env"), { y: 5, scaleY: 0.985, duration: 0.14, ease: "power2.out" }, "-=0.12")
            .to(q(".v2-env"), { y: 0, scaleY: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" })
            // 4 — flap folds shut; lifted over the letter as it passes upright
            .to(q(".v2-env-flap"), { rotateX: 0, duration: 0.75, ease: "power3.inOut" }, "-=0.3")
            .set(q(".v2-env-flap"), { zIndex: 5 }, "-=0.4")
            // 5 — wax seal drops and stamps
            .to(
              q(".v2-env-seal"),
              { scale: 1, y: 0, rotate: 0, opacity: 1, duration: 0.42, ease: "power4.in" },
              "-=0.08",
            )
            .addLabel("impact")
            .to(q(".v2-env"), { scaleY: 0.97, scaleX: 1.01, duration: 0.09, ease: "power2.out" }, "impact")
            .to(q(".v2-env"), { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }, "impact+=0.09")
            .to(q(".v2-env-seal"), { scale: 0.94, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out" }, "impact")
            .fromTo(
              q(".v2-env-ring"),
              { scale: 0.5, opacity: 0.9 },
              { scale: 2.6, opacity: 0, duration: 0.75, ease: "power2.out" },
              "impact",
            )
            .set(burst, { opacity: 1 }, "impact")
            .to(
              burst,
              {
                x: (i: number) => Math.cos((i / BURST) * Math.PI * 2 + 0.3) * (46 + (i % 3) * 14),
                y: (i: number) => Math.sin((i / BURST) * Math.PI * 2 + 0.3) * (46 + (i % 3) * 14),
                scale: 0,
                opacity: 0,
                duration: 0.75,
                ease: "power3.out",
              },
              "impact",
            )
            // 6 — a sheen of light crosses the sealed paper; sender's line appears
            .to(q(".v2-env-sheen span"), { xPercent: 160, duration: 1.1, ease: "power2.inOut" }, "impact+=0.15")
            .to(q(".v2-env-from"), { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "impact+=0.3");
        }),

      flyOff: () =>
        new Promise<void>((resolve) => {
          const q = gsap.utils.selector(rootRef);
          idleRef.current?.kill();
          idleRef.current = null;
          const trail = q(".v2-env-trail i");
          const toX = 150;
          const toY = -560;

          gsap
            .timeline({
              onComplete: () => {
                // Drop the (absolutely positioned) scene out of the paint
                // order so it can't sit invisibly over the thank-you.
                gsap.set(rootRef.current, { visibility: "hidden" });
                resolve();
              },
            })
            // anticipation — settles down a touch before launching
            .to(q(".v2-env"), { y: 12, rotate: -2, scale: 0.97, duration: 0.22, ease: "power2.out" })
            .addLabel("launch")
            .to(q(".v2-env"), { x: toX, y: toY, rotate: 14, scale: 0.55, duration: 0.85, ease: "power3.in" }, "launch")
            .to(q(".v2-env"), { opacity: 0, duration: 0.3, ease: "power1.in" }, "launch+=0.55")
            // comet trail — each spark is dropped a little further along the path
            .fromTo(
              trail,
              { x: 0, y: 12, scale: 1, opacity: 0 },
              {
                keyframes: [
                  { opacity: 1, duration: 0.05 },
                  {
                    x: (i: number) => toX * (0.12 + i * 0.07) + (i % 2 ? 10 : -10),
                    y: (i: number) => toY * (0.12 + i * 0.07),
                    scale: 0,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out",
                  },
                ],
                stagger: 0.07,
              },
              "launch+=0.2",
            );
        }),

      reset: () => {
        idleRef.current?.kill();
        idleRef.current = null;
        startPose(gsap.utils.selector(rootRef), rootRef.current);
      },
    }));

    return (
      <div ref={rootRef} className="v2-env-scene" aria-hidden="true">
        <div className="v2-env-stage">
          <div className="v2-env-trail">
            {Array.from({ length: TRAIL }, (_, i) => (
              <i key={i} />
            ))}
          </div>

          <div className="v2-env">
            {/* Back panel; its burgundy liner shows inside the open mouth */}
            <div className="v2-env-back" />

            {/* Flap — outside face (paper) / inside face (liner) */}
            <div className="v2-env-flap">
              <div className="v2-env-flap-face v2-env-flap-out">
                <svg viewBox="0 0 340 128" preserveAspectRatio="none" role="presentation">
                  <defs>
                    <linearGradient id="v2-env-flap-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#f3e7cc" />
                      <stop offset="1" stopColor="#dcc597" />
                    </linearGradient>
                  </defs>
                  <path d="M0 0 H340 L184 120 Q170 131 156 120 Z" fill="url(#v2-env-flap-grad)" />
                  <path
                    d="M0 0 L156 120 Q170 131 184 120 L340 0"
                    fill="none"
                    stroke="rgba(143,113,58,0.45)"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>
              <div className="v2-env-flap-face v2-env-flap-in">
                <svg viewBox="0 0 340 128" preserveAspectRatio="none" role="presentation">
                  <defs>
                    <pattern
                      id="v2-env-liner"
                      width="14"
                      height="14"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <rect width="14" height="14" fill="#5b1621" />
                      <rect width="1.2" height="14" fill="rgba(230,201,138,0.28)" />
                    </pattern>
                  </defs>
                  <path d="M0 0 H340 L184 120 Q170 131 156 120 Z" fill="url(#v2-env-liner)" />
                  <path
                    d="M10 6 H330 L182 113 Q170 122 158 113 Z"
                    fill="none"
                    stroke="rgba(230,201,138,0.45)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* The guest's letter */}
            <div className="v2-env-letter">
              <p className="v2-env-letter-to">
                Dear {shortName1} &amp; {shortName2},
              </p>
              <div className="v2-env-letter-body">
                <p>{message}</p>
              </div>
              <p className="v2-env-letter-sign">
                {Array.from(`— ${name}`).map((ch, i) => (
                  <span key={`${ch}-${i}`} className="v2-env-sign-char">
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </p>
            </div>

            {/* Front pocket — side folds + bottom fold, drawn over the letter */}
            <svg className="v2-env-pocket" viewBox="0 0 340 220" preserveAspectRatio="none" role="presentation">
              <defs>
                <linearGradient id="v2-env-side-l" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#e6d3aa" />
                  <stop offset="1" stopColor="#f2e5c9" />
                </linearGradient>
                <linearGradient id="v2-env-side-r" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0" stopColor="#e6d3aa" />
                  <stop offset="1" stopColor="#f2e5c9" />
                </linearGradient>
                <linearGradient id="v2-env-bottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6ecd6" />
                  <stop offset="1" stopColor="#e2cc9f" />
                </linearGradient>
              </defs>
              <path d="M0 0 L168 118 L0 220 Z" fill="url(#v2-env-side-l)" />
              <path d="M340 0 L172 118 L340 220 Z" fill="url(#v2-env-side-r)" />
              <path d="M0 220 L162 100 Q170 95 178 100 L340 220 Z" fill="url(#v2-env-bottom)" />
              <path
                d="M0 220 L162 100 Q170 95 178 100 L340 220"
                fill="none"
                stroke="rgba(143,113,58,0.35)"
                strokeWidth="1.1"
              />
            </svg>

            <p className="v2-env-from">
              with love, <span>{name}</span>
            </p>

            {/* Light sweep across the sealed envelope */}
            <div className="v2-env-sheen">
              <span />
            </div>

            {/* Wax seal + its impact effects */}
            <div className="v2-env-seal-wrap">
              <span className="v2-env-ring" />
              <div className="v2-env-burst">
                {Array.from({ length: BURST }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <div className="v2-env-seal">
                <svg viewBox="0 0 80 80" role="presentation">
                  <defs>
                    <radialGradient id="v2-env-wax" cx="38%" cy="32%" r="75%">
                      <stop offset="0" stopColor="#9c2f3c" />
                      <stop offset="0.55" stopColor="#6e1a26" />
                      <stop offset="1" stopColor="#4a0f18" />
                    </radialGradient>
                  </defs>
                  {/* Irregular wax edge */}
                  <path
                    d="M40 3 C47 3 50 7 56 7 C62 8 64 13 69 16 C74 20 73 26 76 31 C79 37 76 42 77 48 C77 54 72 57 70 62 C67 68 61 68 56 72 C50 76 45 74 40 77 C34 79 30 74 24 73 C18 71 15 66 11 62 C7 58 8 52 5 47 C2 41 5 36 4 30 C4 24 9 21 12 16 C15 11 21 11 26 7 C31 4 35 3 40 3 Z"
                    fill="url(#v2-env-wax)"
                  />
                  <circle cx="40" cy="40" r="25" fill="none" stroke="rgba(230,201,138,0.75)" strokeWidth="1.3" />
                  <circle cx="40" cy="40" r="21.5" fill="none" stroke="rgba(230,201,138,0.35)" strokeWidth="0.8" />
                  <text
                    x="40"
                    y="47"
                    textAnchor="middle"
                    fontFamily="Parisienne, var(--v2-font-display), cursive"
                    fontSize="19"
                    fill="#e6c98a"
                  >
                    {MONOGRAM}
                  </text>
                  <ellipse cx="29" cy="22" rx="10" ry="5" fill="rgba(255,255,255,0.14)" transform="rotate(-25 29 22)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

WishEnvelope.displayName = "WishEnvelope";
