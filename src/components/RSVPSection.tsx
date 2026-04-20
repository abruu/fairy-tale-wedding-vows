import React, { useState } from 'react';
import { Heart, Send, CheckCircle } from 'lucide-react';

interface FormState {
  name: string;
  message: string;
}

const RSVPSection: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    // Simulate async submission (client-side only)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section
      id="wishes"
      className="py-20 px-4 bg-blush-gradient relative overflow-hidden"
      data-aos="fade-up"
    >
      {/* Background decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #F8C8DC, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #E6CBA8, transparent)' }}
      />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5" style={{ background: 'rgba(183,110,121,0.12)' }}>
            <Heart size={26} style={{ color: '#B76E79' }} fill="#B76E79" />
          </div>
          <h2 className="section-title mb-3">Send Your Wishes</h2>
          <div className="wedding-divider mx-auto" />
          <p className="section-subtitle mt-4 max-w-sm mx-auto">
            Your love and blessings mean the world to us. Leave a message for the happy couple!
          </p>
        </div>

        {/* Form / Success */}
        {submitted ? (
          <div
            className="wedding-card p-10 text-center"
            style={{ animation: 'fade-up 0.6s ease-out both' }}
          >
            <div className="flex justify-center mb-5">
              <CheckCircle size={52} style={{ color: '#A8C3A0' }} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl mb-3" style={{ color: '#4B3832' }}>
              Thank You, {form.name}!
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#7A5A5A' }}>
              Your wishes have been received. We are so grateful to have you celebrating with us!
            </p>
            <div className="mt-6">
              <span style={{ color: '#B76E79', fontSize: '1.5rem' }}>♥</span>
            </div>
          </div>
        ) : (
          <form className="wedding-card p-8 md:p-10" onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="wish-name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#7A5A5A' }}
                >
                  Your Name <span aria-hidden="true" style={{ color: '#B76E79' }}>*</span>
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

              {/* Message */}
              <div>
                <label
                  htmlFor="wish-message"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#7A5A5A' }}
                >
                  Your Wishes
                </label>
                <textarea
                  id="wish-message"
                  name="message"
                  rows={4}
                  placeholder="Write your heartfelt wishes for Daril & Sneha…"
                  value={form.message}
                  onChange={handleChange}
                  className="form-input resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className="btn-primary w-full mt-2"
                style={{ opacity: loading ? 0.75 : 1 }}
              >
                {loading ? (
                  <>
                    <span
                      className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                      style={{ animation: 'spin 0.8s linear infinite' }}
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
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default RSVPSection;
