import React, { useState } from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { sendWishEmail } from "@/services/emailService";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";
import { Send, Check, Loader2 } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Premium RSVP form with validation, loading states, and success animation.
 */
export const RSVPSection: React.FC = () => {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { ref, revealed, className } = useReveal<HTMLDivElement>({
    type: "up",
  });

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Your name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim())
      newErrors.message = "Please share your wishes";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");
    try {
      await sendWishEmail({
        name: formData.name,
        message: formData.message,
      });
      setFormState("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) setErrors({ ...errors, [field]: undefined });
    };

  return (
    <section
      id="rsvp"
      className="v2-bg-gradient-rose"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        overflow: "hidden",
      }}
    >
      <FloatingOrnaments count={4} variant="petals" />

      {/* Watercolor accents */}
      <div
        className="v2-watercolor"
        style={{
          width: 300,
          height: 300,
          top: "10%",
          right: "-5%",
          background: "var(--v2-rose-gold)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "40rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="RSVP"
          title="Share Your Wishes"
          subtitle="Your blessings and presence mean the world to us"
        />

        <div
          ref={ref}
          className={`v2-luxury-card ${className} ${revealed ? "revealed" : ""}`}
          style={{
            marginTop: "3rem",
            padding: "clamp(1.75rem, 4vw, 3rem)",
          }}
        >
          {formState === "success" ? (
            <SuccessState onReset={() => setFormState("idle")} />
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Name */}
              <div>
                <label className="v2-input-label" htmlFor="rsvp-name">
                  Your Name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  className="v2-input"
                  value={formData.name}
                  onChange={handleChange("name")}
                  placeholder="Enter your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    style={{
                      color: "var(--v2-rose-gold)",
                      fontSize: "0.75rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="v2-input-label" htmlFor="rsvp-email">
                  Email Address
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  className="v2-input"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="your@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    style={{
                      color: "var(--v2-rose-gold)",
                      fontSize: "0.75rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="v2-input-label" htmlFor="rsvp-message">
                  Your Wishes
                </label>
                <textarea
                  id="rsvp-message"
                  className="v2-input"
                  value={formData.message}
                  onChange={handleChange("message")}
                  placeholder="Share your blessings and wishes..."
                  rows={4}
                  style={{ resize: "vertical", minHeight: "100px" }}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="message-error"
                    style={{
                      color: "var(--v2-rose-gold)",
                      fontSize: "0.75rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Error message */}
              {formState === "error" && (
                <p
                  style={{
                    color: "var(--v2-rose-gold)",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="v2-btn v2-btn-gold"
                disabled={formState === "submitting"}
                style={{
                  width: "100%",
                  opacity: formState === "submitting" ? 0.7 : 1,
                }}
              >
                {formState === "submitting" ? (
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
        </div>
      </div>
    </section>
  );
};

const SuccessState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
    <div
      className="v2-animate-scale-in"
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, var(--v2-gold-dark), var(--v2-gold))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.5rem",
        boxShadow: "0 4px 20px rgba(201,169,110,0.3)",
      }}
    >
      <Check size={28} color="var(--v2-ivory)" />
    </div>
    <h3
      style={{
        fontFamily: "var(--v2-font-serif)",
        fontSize: "1.5rem",
        fontWeight: 500,
        color: "var(--v2-charcoal)",
        marginBottom: "0.5rem",
      }}
    >
      Thank You!
    </h3>
    <p
      style={{
        fontFamily: "var(--v2-font-display)",
        fontStyle: "italic",
        fontSize: "1rem",
        color: "rgba(44,44,44,0.6)",
        marginBottom: "1.5rem",
      }}
    >
      Your wishes have been sent with love
    </p>
    <button className="v2-btn v2-btn-outline" onClick={onReset}>
      Send Another
    </button>
  </div>
);
