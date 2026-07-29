import React from "react";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { SectionHeader } from "../shared/SectionHeader";
import { CrossMotif } from "../shared/CrossMotif";
import { FaithDivider } from "../shared/FaithDivider";
import { FloatingOrnaments } from "../shared/FloatingOrnaments";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const slideIn = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

/**
 * Editorial invitation — asymmetric wide/narrow split (couple + intro vs.
 * families), with the scripture/blessing line as the page's primary
 * faith moment, flanked by the cross motif.
 */
export const InvitationSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const brideFirst = WEDDING_CONFIG.couple.brideFirst;

  const firstFamily = brideFirst
    ? {
        label: "Bride's Parents",
        parents: WEDDING_CONFIG.couple.brideParents,
        address: WEDDING_CONFIG.couple.brideAddress,
      }
    : {
        label: "Groom's Parents",
        parents: WEDDING_CONFIG.couple.groomParents,
        address: WEDDING_CONFIG.couple.groomAddress,
      };
  const secondFamily = brideFirst
    ? {
        label: "Groom's Parents",
        parents: WEDDING_CONFIG.couple.groomParents,
        address: WEDDING_CONFIG.couple.groomAddress,
      }
    : {
        label: "Bride's Parents",
        parents: WEDDING_CONFIG.couple.brideParents,
        address: WEDDING_CONFIG.couple.brideAddress,
      };

  return (
    <section
      id="invitation"
      style={{
        position: "relative",
        background: "var(--v2-ink)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
        overflow: "hidden",
      }}
    >
      <FloatingOrnaments count={4} variant="sparkles" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="With Joy"
          title="Together with our families"
          variant="dark"
        />

        {/* Asymmetric split: wide intro/names column · narrow families column */}
        <div
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "start",
          }}
          className="v2-invitation-split"
        >
          {/* Wide column */}
          <motion.div
            initial={prefersReduced ? undefined : "hidden"}
            whileInView={prefersReduced ? undefined : "show"}
            viewport={{ once: true, amount: 0.3 }}
            variants={slideIn(true)}
          >
            <p
              style={{
                fontFamily: "var(--v2-font-sans)",
                fontSize: "0.7rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(198,161,91,0.7)",
                marginBottom: "1.25rem",
              }}
            >
              {WEDDING_CONFIG.couple.invitationIntro}
            </p>

            <h3
              style={{
                fontFamily: "var(--v2-font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2.25rem, 6vw, 4rem)",
                fontWeight: 500,
                color: "var(--v2-ivory)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {WEDDING_CONFIG.couple.name1}
              <span style={{ color: "var(--v2-gold)", margin: "0 0.25em" }}>
                &amp;
              </span>
              <br />
              {WEDDING_CONFIG.couple.name2}
            </h3>

            {(() => {
              const lines = [
                brideFirst
                  ? WEDDING_CONFIG.couple.brideSharingHappiness
                  : WEDDING_CONFIG.couple.sharingHappiness,
                brideFirst
                  ? WEDDING_CONFIG.couple.sharingHappiness
                  : WEDDING_CONFIG.couple.brideSharingHappiness,
              ].filter(Boolean);
              if (lines.length === 0) return null;
              return (
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <p
                    className="v2-eyebrow"
                    style={{ color: "var(--v2-gold)", margin: 0 }}
                  >
                    With Best Wishes
                  </p>
                  {lines.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "var(--v2-font-display)",
                        fontStyle: "italic",
                        fontSize: "0.85rem",
                        color: "rgba(234,228,216,0.55)",
                        margin: 0,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              );
            })()}
          </motion.div>

          {/* Narrow column: two family blocks */}
          <motion.div
            initial={prefersReduced ? undefined : "hidden"}
            whileInView={prefersReduced ? undefined : "show"}
            viewport={{ once: true, amount: 0.3 }}
            variants={slideIn(false)}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {[firstFamily, secondFamily].map((family, i) => (
              <div
                key={i}
                style={{
                  borderLeft: "1px solid var(--v2-line)",
                  paddingLeft: "1.5rem",
                }}
              >
                <p
                  className="v2-eyebrow"
                  style={{ color: "var(--v2-gold)", marginBottom: "0.6rem" }}
                >
                  {family.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--v2-font-serif)",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    fontWeight: 500,
                    color: "var(--v2-ivory)",
                    lineHeight: 1.4,
                    marginBottom: "0.4rem",
                  }}
                >
                  {family.parents}
                </p>
                <p
                  style={{
                    fontFamily: "var(--v2-font-sans)",
                    fontSize: "0.75rem",
                    color: "rgba(234,228,216,0.5)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {family.address}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scripture band — the primary faith moment */}
        <FaithDivider tone="dark" />
        <div
          style={{ textAlign: "center", maxWidth: "42rem", margin: "0 auto" }}
        >
          <p
            style={{
              fontFamily: "var(--v2-font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.15rem, 2.6vw, 1.6rem)",
              color: "var(--v2-sacred-gold)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {WEDDING_CONFIG.couple.supportingMessage}
          </p>

          {/* Event dates, repeated under the scripture for visibility */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
              marginTop: "2.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(198,161,91,0.6)",
                }}
              >
                Betrothal
              </span>
              <span
                style={{
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)",
                  color: "var(--v2-ivory)",
                }}
              >
                {WEDDING_CONFIG.events.betrothal.dateLabel}
              </span>
            </div>
            <span
              style={{ color: "rgba(198,161,91,0.4)", fontSize: "0.7rem" }}
              aria-hidden="true"
            >
              ✦
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--v2-font-sans)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(198,161,91,0.6)",
                }}
              >
                Wedding
              </span>
              <span
                style={{
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)",
                  color: "var(--v2-ivory)",
                }}
              >
                {WEDDING_CONFIG.events.wedding.dateLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .v2-invitation-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};
