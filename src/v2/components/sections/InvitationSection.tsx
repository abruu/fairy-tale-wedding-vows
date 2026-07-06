import React from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";
import { CornerFlourish } from "../shared/Ornament";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";

/**
 * Editorial-style family invitation section.
 * Two families presented side by side with elegant typography.
 */
export const InvitationSection: React.FC = () => {
  const { ref, revealed, className } = useReveal<HTMLDivElement>({
    type: "up",
  });
  const {
    ref: ref2,
    revealed: revealed2,
    className: className2,
  } = useReveal<HTMLDivElement>({ type: "scale", delay: 200 });
  const {
    ref: ref3,
    revealed: revealed3,
    className: className3,
  } = useReveal<HTMLDivElement>({ type: "up", delay: 400 });

  return (
    <section
      id="invitation"
      className="v2-bg-gradient-soft"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        overflow: "hidden",
      }}
    >
      <FloatingOrnaments count={4} variant="sparkles" />

      {/* Watercolor accents */}
      <div
        className="v2-watercolor"
        style={{
          width: 300,
          height: 300,
          top: "5%",
          left: "-5%",
          background: "var(--v2-gold)",
        }}
      />
      <div
        className="v2-watercolor"
        style={{
          width: 250,
          height: 250,
          bottom: "5%",
          right: "-5%",
          background: "var(--v2-rose-gold)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="With Joy"
          title="Together with their families"
          subtitle={WEDDING_CONFIG.couple.invitationIntro}
        />

        {/* Invitation Card */}
        <div
          ref={ref2}
          className={`v2-luxury-card ${className2} ${revealed2 ? "revealed" : ""}`}
          style={{
            marginTop: "3rem",
            padding: "clamp(2rem, 5vw, 4rem)",
            position: "relative",
          }}
        >
          <CornerFlourish position="tl" />
          <CornerFlourish position="tr" />
          <CornerFlourish position="bl" />
          <CornerFlourish position="br" />

          {/* Inner border */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "12px",
              border: "1px solid rgba(201,169,110,0.1)",
              borderRadius: "1rem",
              pointerEvents: "none",
            }}
          />

          {/* Families */}
          <div
            className="v2-invitation-families"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "1.5rem",
              alignItems: "center",
              padding: "2rem 0",
              borderTop: "1px solid rgba(201,169,110,0.08)",
              borderBottom: "1px solid rgba(201,169,110,0.08)",
            }}
          >
            {/* Groom's family */}
            <div style={{ textAlign: "center" }}>
              <p className="v2-eyebrow" style={{ marginBottom: "0.75rem" }}>
                Groom's Parents
              </p>
              <p
                style={{
                  fontFamily: "var(--v2-font-serif)",
                  fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                  fontWeight: 500,
                  color: "var(--v2-charcoal)",
                  lineHeight: 1.5,
                  marginBottom: "0.4rem",
                }}
              >
                {WEDDING_CONFIG.couple.groomParents}
              </p>
              <p
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "0.7rem",
                  color: "rgba(44,44,44,0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                {WEDDING_CONFIG.couple.groomAddress}
              </p>
            </div>

            {/* Connector */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <div
                style={{
                  width: 1,
                  height: 24,
                  background:
                    "linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "rgba(201,169,110,0.6)",
                }}
              >
                &amp;
              </span>
              <div
                style={{
                  width: 1,
                  height: 24,
                  background:
                    "linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)",
                }}
              />
            </div>

            {/* Bride's family */}
            <div style={{ textAlign: "center" }}>
              <p className="v2-eyebrow" style={{ marginBottom: "0.75rem" }}>
                Bride's Parents
              </p>
              <p
                style={{
                  fontFamily: "var(--v2-font-serif)",
                  fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                  fontWeight: 500,
                  color: "var(--v2-charcoal)",
                  lineHeight: 1.5,
                  marginBottom: "0.4rem",
                }}
              >
                {WEDDING_CONFIG.couple.brideParents}
              </p>
              <p
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "0.7rem",
                  color: "rgba(44,44,44,0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                {WEDDING_CONFIG.couple.brideAddress}
              </p>
            </div>
          </div>

          {/* Names block */}
          <div
            ref={ref}
            className={`${className} ${revealed ? "revealed" : ""}`}
            style={{ textAlign: "center", padding: "2.5rem 0 1rem" }}
          >
            <p
              style={{
                fontFamily: "var(--v2-font-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.6)",
                marginBottom: "1rem",
              }}
            >
              Request the pleasure of your company at the wedding of
            </p>

            <h3
              style={{
                fontFamily: "var(--v2-font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 500,
                color: "var(--v2-gold-dark)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {WEDDING_CONFIG.couple.name1}
            </h3>
            <p
              style={{
                fontFamily: "var(--v2-font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                color: "rgba(201,169,110,0.5)",
                margin: "0.25rem 0",
              }}
            >
              &amp;
            </p>
            <h3
              style={{
                fontFamily: "var(--v2-font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 500,
                color: "var(--v2-gold-dark)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {WEDDING_CONFIG.couple.name2}
            </h3>
          </div>

          {/* Sharing happiness */}
          <div
            ref={ref3}
            className={`${className3} ${revealed3 ? "revealed" : ""}`}
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.8rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, rgba(201,169,110,0.3))",
                }}
              />
              <span
                style={{ color: "rgba(201,169,110,0.4)", fontSize: "0.6rem" }}
              >
                ✦
              </span>
              <div
                style={{
                  width: 40,
                  height: 1,
                  background:
                    "linear-gradient(to right, rgba(201,169,110,0.3), transparent)",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--v2-font-display)",
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: "rgba(44,44,44,0.5)",
                letterSpacing: "0.02em",
              }}
            >
              {WEDDING_CONFIG.couple.sharingHappiness}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
