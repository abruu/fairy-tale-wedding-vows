import React, { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { T, useLang } from "../../lib/i18n";
import { submitRsvp, type RsvpResult } from "../../lib/rsvp";
import type { TranslationKey } from "../../lib/translations";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

type Phase = "idle" | "sending" | RsvpResult;

const EMPTY = { name: "", message: "" };

/** Ivory band with a "Send your wishes" form (name + message, sent via EmailJS). */
export const RSVPSection: React.FC = () => {
  const { lang, t } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [nameError, setNameError] = useState<TranslationKey | null>(null);
  const [messageError, setMessageError] = useState<TranslationKey | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return;
    const nameMissing = !form.name.trim();
    const messageMissing = !form.message.trim();
    setNameError(nameMissing ? "rsvp.nameRequired" : null);
    setMessageError(messageMissing ? "rsvp.messageRequired" : null);
    if (nameMissing || messageMissing) return;
    setPhase("sending");
    setPhase(await submitRsvp({ name: form.name.trim(), message: form.message.trim() }));
  };

  return (
    <section id="rsvp" className="v2-section v2-bg-ivory v2-grain" aria-labelledby="rsvp-title">
      <Px name="olive-branch" speed={0.2} className="v2-rsvp-olive" />
      <Px name="soft-petals" speed={0.35} rotate={0.04} className="v2-rsvp-petals" />

      <div className="v2-container v2-narrow">
        <Reveal className="v2-rsvp-card">
          <SectionHeader id="rsvp-title" eyebrow="rsvp.eyebrow" title="rsvp.title" />

          {phase === "ok" ? (
            <div className="v2-rsvp-status v2-rsvp-status--ok" role="status">
              <CheckCircle2 size={26} aria-hidden="true" />
              <T k="rsvp.success" as="p" />
              <button
                type="button"
                className="v2-link-btn"
                onClick={() => {
                  setForm(EMPTY);
                  setPhase("idle");
                }}
              >
                <T k="rsvp.sendAnother" />
              </button>
            </div>
          ) : (
            <form className="v2-form" onSubmit={handleSubmit} noValidate lang={lang}>
              <div className="v2-field">
                <label htmlFor="rsvp-name">
                  <T k="rsvp.name" />
                </label>
                <input
                  id="rsvp-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "rsvp-name-err" : undefined}
                  required
                />
                {nameError && (
                  <p id="rsvp-name-err" className="v2-field-error">
                    {t(nameError)}
                  </p>
                )}
              </div>

              <div className="v2-field">
                <label htmlFor="rsvp-message">
                  <T k="rsvp.message" />
                </label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  aria-invalid={!!messageError}
                  aria-describedby={messageError ? "rsvp-message-err" : undefined}
                  required
                />
                {messageError && (
                  <p id="rsvp-message-err" className="v2-field-error">
                    {t(messageError)}
                  </p>
                )}
              </div>

              {(phase === "error" || phase === "not-configured") && (
                <div className="v2-rsvp-status v2-rsvp-status--error" role="alert">
                  <T k={phase === "error" ? "rsvp.error" : "rsvp.notConfigured"} as="p" />
                </div>
              )}

              <button type="submit" className="v2-btn" disabled={phase === "sending"}>
                {phase === "sending" ? (
                  <>
                    <Loader2 size={18} className="v2-spin" aria-hidden="true" />
                    <T k="rsvp.sending" />
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden="true" />
                    <T k="rsvp.submit" />
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
};
