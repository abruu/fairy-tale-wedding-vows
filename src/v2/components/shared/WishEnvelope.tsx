import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { WEDDING_CONFIG } from "@/config/dates";

export interface WishEnvelopeHandle {
  /** Name writes on → paper folds in → flap closes → wax seal stamps. */
  sealUp: () => Promise<void>;
  /** Envelope translates/rotates off-screen and fades. Held until the send succeeds. */
  flyOff: () => Promise<void>;
  /** Return every part to its start pose so another wish can be sent. */
  reset: () => void;
}

interface WishEnvelopeProps {
  /** Committed at submit time — written onto the envelope face, one char at a time. */
  name: string;
  /** Committed at submit time — shown on the paper that folds inside. */
  message: string;
}

const initials = () => {
  const { name1, name2 } = WEDDING_CONFIG.couple;
  return `${name1.trim()[0] ?? ""}${name2.trim()[0] ?? ""}`.toUpperCase();
};

/**
 * The wax-seal envelope for the wishes form. GSAP owns this entire
 * sequence — the one deliberate exception to the project's
 * GSAP-for-scroll / Framer-Motion-for-components split, because the
 * choreography needs a single timeline across many elements.
 *
 * The envelope and seal are inline SVG rather than fetched .svg assets:
 * individual parts (flap, seal, pocket) have to be transformed
 * independently, which is impossible through an <img src="….svg">, and
 * inlining also means there is no asset request to stutter on first tap.
 * The mount-time gsap.set() below is the actual anti-stutter measure —
 * it caches the targets and promotes them to their own layers before the
 * first frame ever runs.
 *
 * Visibility is driven by GSAP too, not by a React prop: the caller starts
 * the timeline in the same tick it would flip a prop, so a prop-driven
 * reveal would race the render and let the name write on while the scene
 * was still hidden.
 */
export const WishEnvelope = forwardRef<WishEnvelopeHandle, WishEnvelopeProps>(
  ({ name, message }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);

    // Warm-up: cache targets + establish start poses before any tap.
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        gsap.set(".v2-env", { willChange: "transform, opacity" });
        gsap.set(".v2-env-flap", { transformOrigin: "top center", rotateX: 180 });
        gsap.set(".v2-env-seal", { transformOrigin: "center center", scale: 0.4, opacity: 0, rotate: -18 });
        gsap.set(".v2-env-paper", { transformOrigin: "top center", yPercent: -128, scaleY: 1, opacity: 1 });
      }, rootRef);
      return () => ctx.revert();
    }, []);

    useImperativeHandle(ref, () => ({
      sealUp: () =>
        new Promise<void>((resolve) => {
          const q = gsap.utils.selector(rootRef);
          gsap
            .timeline({ onComplete: () => resolve() })
            // 0 — reveal the scene the form just vacated
            .set(rootRef.current, { visibility: "visible" })
            .to(rootRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" })
            // 1 — the guest's name writes onto the envelope face
            .to(q(".v2-env-name-char"), {
              opacity: 1,
              y: 0,
              duration: 0.26,
              stagger: 0.035,
              ease: "power2.out",
            })
            // 2 — their message folds…
            .to(q(".v2-env-paper"), { scaleY: 0.42, duration: 0.45, ease: "power2.inOut" }, "+=0.25")
            // …and slides down inside, fading as it passes the pocket mouth so
            // it reads as gone-inside regardless of the exact geometry
            .to(q(".v2-env-paper"), { yPercent: 55, scale: 0.9, duration: 0.55, ease: "power2.in" }, ">-0.05")
            .to(q(".v2-env-paper"), { opacity: 0, duration: 0.28 }, ">-0.3")
            // 3 — flap rotates closed
            .to(q(".v2-env-flap"), { rotateX: 0, duration: 0.5, ease: "power2.out" }, ">-0.12")
            // 4 — wax seal stamps: 0.4 → 1.05 → 1, with a settle rotation
            .to(q(".v2-env-seal"), { scale: 1.05, opacity: 1, rotate: 6, duration: 0.3, ease: "back.out(3)" }, ">-0.05")
            .to(q(".v2-env-seal"), { scale: 1, rotate: 0, duration: 0.2, ease: "power2.out" });
        }),

      flyOff: () =>
        new Promise<void>((resolve) => {
          const q = gsap.utils.selector(rootRef);
          gsap
            .timeline({ onComplete: () => resolve() })
            .to(q(".v2-env"), {
              y: -520,
              x: 90,
              rotate: 14,
              scale: 0.82,
              opacity: 0,
              duration: 0.8,
              ease: "power3.in",
            })
            // Drop the (absolutely positioned) scene out of the paint order so
            // it can't sit invisibly over the thank-you that replaces it.
            .set(rootRef.current, { visibility: "hidden" });
        }),

      reset: () => {
        const q = gsap.utils.selector(rootRef);
        gsap.set(rootRef.current, { opacity: 0, visibility: "hidden" });
        gsap.set(q(".v2-env"), { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1 });
        gsap.set(q(".v2-env-flap"), { rotateX: 180 });
        gsap.set(q(".v2-env-seal"), { scale: 0.4, opacity: 0, rotate: -18 });
        gsap.set(q(".v2-env-paper"), { yPercent: -128, scaleY: 1, scale: 1, opacity: 1 });
        gsap.set(q(".v2-env-name-char"), { opacity: 0, y: 6 });
      },
    }));

    return (
      <div ref={rootRef} className="v2-env-scene" aria-hidden="true">
        <div className="v2-env-stage">
          <div className="v2-env">
            {/* Paper carrying the message — folds and slides in */}
            <div className="v2-env-paper">
              <p className="v2-env-paper-text">{message}</p>
            </div>

            {/* Back panel */}
            <svg className="v2-env-svg" viewBox="0 0 320 200" role="presentation">
              <rect
                x="0.75"
                y="0.75"
                width="318.5"
                height="198.5"
                rx="10"
                fill="var(--v2-ink)"
                stroke="var(--v2-line)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Front pocket — drawn over the paper so it reads as going inside */}
            <svg className="v2-env-svg v2-env-pocket" viewBox="0 0 320 200" role="presentation">
              <path
                d="M0.75 199.25 L0.75 70 L160 120 L319.25 70 L319.25 199.25 Z"
                fill="var(--v2-deep-charcoal)"
                stroke="var(--v2-line)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Address line — the guest's name, written on */}
            <div className="v2-env-name">
              {Array.from(name).map((ch, i) => (
                <span key={`${ch}-${i}`} className="v2-env-name-char">
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </div>

            {/* Flap — hinged at the top edge */}
            <div className="v2-env-flap">
              <svg viewBox="0 0 320 100" role="presentation">
                <path
                  d="M0.75 0.75 L319.25 0.75 L160 96 Z"
                  fill="var(--v2-ink)"
                  stroke="var(--v2-line)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Wax seal */}
            <div className="v2-env-seal">
              <svg viewBox="0 0 64 64" role="presentation">
                <circle cx="32" cy="32" r="30" fill="var(--v2-accent)" />
                <circle
                  cx="32"
                  cy="32"
                  r="24"
                  fill="none"
                  stroke="var(--v2-accent-bright)"
                  strokeWidth="1.25"
                  opacity="0.85"
                />
                <text
                  x="32"
                  y="41"
                  textAnchor="middle"
                  fontFamily="var(--v2-font-display)"
                  fontSize="22"
                  fontStyle="italic"
                  fill="var(--v2-ivory)"
                >
                  {initials()}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

WishEnvelope.displayName = "WishEnvelope";
