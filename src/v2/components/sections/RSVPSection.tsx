import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { sendWishEmail } from "@/services/emailService";
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
 * RSVP — underline-only inputs on the dark canvas, matching the
 * editorial minimalism used across the site.
 */
export const RSVPSection: React.FC = () => {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Your name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Please share your wishes";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");
    try {
      await sendWishEmail({ name: formData.name, message: formData.message });
      setFormState("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

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
        <SectionHeader eyebrow="RSVP" title="Share Your Wishes" subtitle="Your blessings and presence mean the world to us" variant="dark" />

        <div style={{ marginTop: "3.5rem" }}>
          <AnimatePresence mode="wait">
            {formState === "success" ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <SuccessState onReset={() => setFormState("idle")} />
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
                className="v2-rsvp-form"
              >
                <UnderlineField id="rsvp-name" label="Your Name" value={formData.name} onChange={handleChange("name")} placeholder="Enter your name" error={errors.name} />
                <UnderlineField id="rsvp-email" label="Email Address" value={formData.email} onChange={handleChange("email")} placeholder="your@email.com" type="email" error={errors.email} />
                <UnderlineField
                  id="rsvp-message"
                  label="Your Wishes"
                  value={formData.message}
                  onChange={handleChange("message")}
                  placeholder="Share your blessings and wishes..."
                  textarea
                  error={errors.message}
                />

                {formState === "error" && (
                  <p style={{ color: "var(--v2-rose-gold)", fontSize: "0.85rem", textAlign: "center" }}>Something went wrong. Please try again.</p>
                )}

                <button type="submit" className="v2-btn v2-btn-gold" disabled={formState === "submitting"} style={{ width: "100%", opacity: formState === "submitting" ? 0.7 : 1 }}>
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
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .v2-rsvp-field { width: 100%; padding: 0.6rem 0; background: transparent; border: none; border-bottom: 1px solid var(--v2-line); font-family: var(--v2-font-sans); font-size: 0.95rem; font-weight: 300; color: var(--v2-ivory); outline: none; transition: border-color 0.3s ease; }
        .v2-rsvp-field::placeholder { color: rgba(234,228,216,0.3); }
        .v2-rsvp-field:focus { border-bottom-color: var(--v2-gold); }
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

const SuccessState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--v2-gold-dark), var(--v2-gold))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.5rem",
        boxShadow: "0 4px 20px rgba(198,161,91,0.3)",
      }}
    >
      <Check size={28} color="var(--v2-deep-charcoal)" />
    </motion.div>
    <h3 style={{ fontFamily: "var(--v2-font-serif)", fontSize: "1.5rem", fontWeight: 500, color: "var(--v2-ivory)", marginBottom: "0.5rem" }}>Thank You!</h3>
    <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: "1rem", color: "rgba(234,228,216,0.6)", marginBottom: "1.5rem" }}>
      Your wishes have been sent with love
    </p>
    <button className="v2-btn v2-btn-outline" onClick={onReset}>
      Send Another
    </button>
  </div>
);
