import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Loader2, Send } from "lucide-react";
import { SITE } from "../config";

// Same studio EmailJS account the template has always used.
const EMAILJS = { serviceId: "service_qjht1ax", templateId: "template_3xnyrgi", publicKey: "06oig93wOq67ST0Sc" };

type Phase = "idle" | "sending" | "sent" | "error";

/**
 * Wishes form. Until recipient emails are set in SITE.wishes the form is
 * shown but closed — sending with no recipient would land in whatever
 * default inbox the EmailJS template has, i.e. some other couple's.
 */
export const Wishes: React.FC = () => {
  const recipients = SITE.wishes.recipientEmails.filter(Boolean);
  const isOpen = recipients.length > 0;
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [phase, setPhase] = useState<Phase>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOpen || phase === "sending") return;
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Please tell us your name";
    if (!message.trim()) errs.message = "Please write a few words";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setPhase("sending");
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          to_email: recipients.join(", "),
          reply_to: recipients.join(", "),
          from_name: name.trim(),
          message: message.trim(),
          couple_names: `${SITE.couple.bride} & ${SITE.couple.groom}`,
          wedding_date: SITE.betrothal.dateLabel,
        },
        EMAILJS.publicKey,
      );
      setPhase("sent");
    } catch {
      setPhase("error");
    }
  };

  return (
    <section id="wishes" className="aa-section">
      <header className="aa-head">
        <p className="aa-eyebrow" data-reveal>
          Blessings
        </p>
        <h2 className="aa-title" data-reveal style={{ "--d": "0.08s" } as React.CSSProperties}>
          Send your <em>wishes</em>
        </h2>
        <p className="aa-lede" data-reveal style={{ "--d": "0.16s" } as React.CSSProperties}>
          Your prayers and kind words mean the world to us.
        </p>
      </header>

      {phase === "sent" ? (
        <div className="aa-wishes-done" role="status">
          <h3>Thank you, {name.trim()}</h3>
          <p className="aa-lede">Your blessing is on its way to us.</p>
          <button
            type="button"
            className="aa-btn aa-btn--ghost"
            onClick={() => {
              setName("");
              setMessage("");
              setPhase("idle");
            }}
          >
            Send another
          </button>
        </div>
      ) : (
        <form className="aa-wishes-form" onSubmit={submit} noValidate data-reveal>
          <div className="aa-field">
            <label htmlFor="wish-name">Your name</label>
            <input
              id="wish-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "wish-name-err" : undefined}
            />
            {errors.name && (
              <p className="aa-field-err" id="wish-name-err">
                {errors.name}
              </p>
            )}
          </div>
          <div className="aa-field">
            <label htmlFor="wish-msg">Your wishes</label>
            <textarea
              id="wish-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "wish-msg-err" : undefined}
            />
            {errors.message && (
              <p className="aa-field-err" id="wish-msg-err">
                {errors.message}
              </p>
            )}
          </div>
          <button type="submit" className="aa-btn" disabled={!isOpen || phase === "sending"}>
            {phase === "sending" ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
            {phase === "sending" ? "Sending…" : "Send Wishes"}
          </button>
          {!isOpen && <p className="aa-wishes-note">Wishes will open here very soon.</p>}
          {phase === "error" && (
            <p className="aa-field-err" role="alert" style={{ textAlign: "center" }}>
              Sorry — that didn't send. Please try again in a moment.
            </p>
          )}
        </form>
      )}
    </section>
  );
};
