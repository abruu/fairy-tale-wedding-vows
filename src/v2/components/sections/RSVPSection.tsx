import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { fadeRise, motionVariants, staggerGroup } from "../../lib/motion";
import { sendWishEmail } from "@/services/emailService";
import { SectionHeader } from "../shared/SectionHeader";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";
import { WishEnvelope, type WishEnvelopeHandle } from "../shared/WishEnvelope";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Send, Loader2 } from "lucide-react";

/**
 * idle      — form accepting input
 * sending   — envelope choreography running / request in flight
 * error     — request failed; envelope stays sealed on screen, retry offered
 * sent      — envelope flew off, personalised thank-you shown
 */
type Phase = "idle" | "sending" | "error" | "sent";

interface FormData {
  name: string;
  message: string;
}

/**
 * Share Your Wishes — underline-only inputs on the dark canvas, with a
 * GSAP-owned envelope send sequence (see WishEnvelope).
 */
export const RSVPSection: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [formData, setFormData] = useState<FormData>({ name: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  // Snapshot taken at submit so edits can't change what's on the envelope.
  const [committed, setCommitted] = useState<FormData>({ name: "", message: "" });
  const [sceneActive, setSceneActive] = useState(false);
  const [awaitingNetwork, setAwaitingNetwork] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const envRef = useRef<WishEnvelopeHandle>(null);
  const prefersReduced = useReducedMotion();

  const validate = (data: FormData): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!data.name.trim()) newErrors.name = "Your name is required";
    if (!data.message.trim()) newErrors.message = "Please share your wishes";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const send = (data: FormData) =>
    sendWishEmail({ name: data.name, message: data.message }).then(
      () => null,
      (e: unknown) => (e instanceof Error ? e : new Error("Send failed")),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return; // guard against double-submit
    const data = { ...formData };
    if (!validate(data)) return;

    setCommitted(data);
    setPhase("sending");

    // Request goes out immediately, in parallel with the choreography, so
    // the animation isn't padding the perceived wait.
    const request = send(data);

    if (prefersReduced) {
      const err = await request;
      setPhase(err ? "error" : "sent");
      return;
    }

    await gsap.to(formRef.current, {
      opacity: 0,
      y: -12,
      duration: 0.35,
      ease: "power2.out",
    });
    setSceneActive(true);

    await envRef.current?.sealUp();

    // Held here deliberately: the envelope must not fly away until the
    // wish is actually delivered.
    setAwaitingNetwork(true);
    const err = await request;
    setAwaitingNetwork(false);

    if (err) {
      setPhase("error");
      return;
    }

    await envRef.current?.flyOff();
    setPhase("sent");
  };

  const handleRetry = async () => {
    setPhase("sending");
    setAwaitingNetwork(true);
    const err = await send(committed);
    setAwaitingNetwork(false);

    if (err) {
      setPhase("error");
      return;
    }

    if (prefersReduced) {
      setPhase("sent");
      return;
    }
    await envRef.current?.flyOff();
    setPhase("sent");
  };

  const handleReset = useCallback(() => {
    envRef.current?.reset();
    setSceneActive(false);
    setFormData({ name: "", message: "" });
    setErrors({});
    setPhase("idle");
  }, []);

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) setErrors({ ...errors, [field]: undefined });
    };

  // Unmounted once the envelope takes over, so an invisible form can't keep
  // catching focus; remounting on reset restores it at full opacity for free.
  const showForm = !sceneActive && (phase === "idle" || phase === "sending" || phase === "error");

  return (
    <section
      id="rsvp"
      style={{
        position: "relative",
        background: "var(--v2-ink)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
        overflow: "hidden",
      }}
    >
      <FloatingOrnaments count={4} variant="petals" />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "36rem", margin: "0 auto" }}>
        <SectionHeader
          eyebrow="RSVP"
          title="Share Your Wishes"
          subtitle="Your blessings and presence mean the world to us"
          variant="dark"
        />

        <div className="v2-wish-stage" style={{ marginTop: "3.5rem" }}>
          {showForm && (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
              className="v2-rsvp-form"
            >
              <UnderlineField
                id="rsvp-name"
                label="Your Name"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Enter your name"
                error={errors.name}
              />
              <UnderlineField
                id="rsvp-message"
                label="Your Wishes"
                value={formData.message}
                onChange={handleChange("message")}
                placeholder="Share your blessings and wishes..."
                textarea
                error={errors.message}
              />

              <button
                type="submit"
                className="v2-btn v2-btn-accent"
                disabled={phase === "sending"}
                style={{ width: "100%", opacity: phase === "sending" ? 0.7 : 1 }}
              >
                {phase === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Wishes
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mounted from the start so the sequence never waits on first paint */}
          <WishEnvelope ref={envRef} name={committed.name} message={committed.message} />

          {/*
            The form's own exit is GSAP's (it's the first beat of the envelope
            choreography), so it stays out of AnimatePresence — one library per
            node. Everything else below mounts and unmounts through React, so it
            gets a real exit here instead of vanishing.
          */}
          <AnimatePresence mode="wait">
            {awaitingNetwork && (
              <motion.p
                key="status"
                className="v2-wish-status"
                variants={motionVariants(prefersReduced, fadeRise)}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ color: "rgba(198,161,91,0.6)" }}
              >
                Sending your wish…
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {phase === "error" && (
              <motion.div
                key="error"
                className="v2-wish-status"
                role="alert"
                variants={motionVariants(prefersReduced, fadeRise)}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ color: "var(--v2-rose-gold)" }}
              >
                <p style={{ margin: "0 0 0.9rem", letterSpacing: "0.06em", textTransform: "none", fontSize: "0.85rem" }}>
                  Your wish couldn't be sent. It's still sealed and safe — try again?
                </p>
                <button className="v2-btn v2-btn-outline" onClick={handleRetry} style={{ fontSize: "0.65rem", padding: "0.6rem 1.6rem" }}>
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
          {phase === "sent" && (
            <motion.div
              key="sent"
              variants={motionVariants(prefersReduced, staggerGroup(0.08, 0.1))}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ textAlign: "center", padding: "2rem 1rem" }}
            >
              <motion.h3
                variants={motionVariants(prefersReduced, fadeRise)}
                style={{
                  fontFamily: "var(--v2-font-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                  fontWeight: 500,
                  color: "var(--v2-ivory)",
                  margin: "0 0 0.75rem",
                }}
              >
                Thank you for your wishes, {committed.name}
              </motion.h3>
              <motion.p
                variants={motionVariants(prefersReduced, fadeRise)}
                style={{
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "rgba(234,228,216,0.6)",
                  marginBottom: "1.75rem",
                }}
              >
                Your blessing is on its way to us
              </motion.p>
              <motion.button
                variants={motionVariants(prefersReduced, fadeRise)}
                className="v2-btn v2-btn-outline"
                onClick={handleReset}
                whileHover={prefersReduced ? undefined : { y: -2 }}
                whileTap={prefersReduced ? undefined : { scale: 0.97 }}
              >
                Send Another Wish
              </motion.button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .v2-rsvp-field { width: 100%; padding: 0.6rem 0; background: transparent; border: none; border-bottom: 1px solid var(--v2-line); font-family: var(--v2-font-sans); font-size: 0.95rem; font-weight: 300; color: var(--v2-ivory); outline: none; transition: border-color 0.3s ease; }
        .v2-rsvp-field::placeholder { color: rgba(234,228,216,0.3); }
        .v2-rsvp-field:focus { border-bottom-color: var(--v2-accent-bright); }
      `}</style>
    </section>
  );
};

interface UnderlineFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  error?: string;
}

const UnderlineField: React.FC<UnderlineFieldProps> = ({ id, label, value, onChange, placeholder, type = "text", textarea, error }) => (
  <div>
    <label className="v2-input-label" htmlFor={id} style={{ color: "var(--v2-gold)" }}>
      {label}
    </label>
    {textarea ? (
      <textarea
        id={id}
        className="v2-rsvp-field"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        style={{ resize: "vertical", minHeight: "80px" }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    ) : (
      <input id={id} type={type} className="v2-rsvp-field" value={value} onChange={onChange} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
    )}
    {error && (
      <p id={`${id}-error`} style={{ color: "var(--v2-rose-gold)", fontSize: "0.75rem", marginTop: "0.4rem" }}>
        {error}
      </p>
    )}
  </div>
);
