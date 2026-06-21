import React, { useState } from "react";
import { Heart, Send, CheckCircle, AlertCircle } from "lucide-react";
import { ANIMATION_CONFIG } from "@/config/animations";
import { WEDDING_CONFIG } from "@/config/dates";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import FloatingDecorations from "@/components/FloatingDecorations";
import { sendWishEmail } from "@/services/emailService";

interface FormState {
  name: string;
  message: string;
}

const RSVPSection: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref: sectionRef, style: sectionRevealStyle } =
    useScrollReveal<HTMLElement>({
      animation: "fade-up",
      duration: ANIMATION_CONFIG.wishes.floatUp.duration,
    });

  const { ref: formRef, style: formRevealStyle } =
    useScrollReveal<HTMLDivElement>({
      animation: "fade-up",
      delay: 200,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await sendWishEmail({
        name: form.name,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to send wish:", err);
      setError(
        "Unable to send your wishes at the moment. Please try again later or contact us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="wishes"
      className="py-20 px-4 bg-blush-gradient relative overflow-hidden"
      style={sectionRevealStyle}
    >
      {/* Floating decorative elements */}
      <FloatingDecorations types={["sparkles", "flowers"]} maxCount={8} />

      {/* Background decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #C5E0FF, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #A8C9E6, transparent)" }}
      />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 glow-pulse-element"
            style={{ background: "rgba(74,127,193,0.12)" }}
          >
            <Heart size={26} style={{ color: "#4A7FC1" }} fill="#4A7FC1" />
          </div>
          <h2 className="section-title mb-3">Send Your Wishes</h2>
          <div className="wedding-divider mx-auto" />
          <p className="section-subtitle mt-4 max-w-sm mx-auto">
            Your love and blessings mean the world to us. Leave a message for
            the happy couple!
          </p>
        </div>

        {/* Form / Success */}
        <div ref={formRef} style={formRevealStyle}>
          {submitted ? (
            <div
              className="wedding-card wedding-card-enhanced p-10 text-center"
              style={{
                animation: `wishes-float-in ${ANIMATION_CONFIG.wishes.newWishAnimation.duration}ms ease-out both`,
              }}
            >
              <div className="flex justify-center mb-5">
                <CheckCircle
                  size={52}
                  style={{ color: "#A8C3A0" }}
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className="font-serif text-2xl mb-3"
                style={{ color: "#4B3832" }}
              >
                Thank You, {form.name}!
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#7A5A5A" }}
              >
                Your wishes have been received. We are so grateful to have you
                celebrating with us!
              </p>
              <div className="mt-6">
                <span style={{ color: "#4A7FC1", fontSize: "1.5rem" }}>♥</span>
              </div>
            </div>
          ) : (
            <form
              className="wedding-card wedding-card-enhanced p-8 md:p-10"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="wish-name"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "#7A5A5A" }}
                  >
                    Your Name{" "}
                    <span aria-hidden="true" style={{ color: "#4A7FC1" }}>
                      *
                    </span>
                  </label>
                  <input
                    id="wish-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wish-message"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "#7A5A5A" }}
                  >
                    Your Wishes
                  </label>
                  <textarea
                    id="wish-message"
                    name="message"
                    rows={4}
                    placeholder={`Write your heartfelt wishes for ${WEDDING_CONFIG.couple.displayNames}…`}
                    value={form.message}
                    onChange={handleChange}
                    className="form-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.name.trim()}
                  className="btn-primary btn-primary-enhanced w-full mt-2"
                  style={{ opacity: loading ? 0.75 : 1 }}
                >
                  {loading ? (
                    <>
                      <span
                        className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        style={{ animation: "spin 0.8s linear infinite" }}
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Wishes
                    </>
                  )}
                </button>

                {error && (
                  <div
                    className="mt-4 p-3 rounded-lg flex items-start gap-2"
                    style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}
                  >
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
