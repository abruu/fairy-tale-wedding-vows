import React from "react";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { MapPin, Clock } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { CrossMotif } from "../shared/CrossMotif";
import { MiniCountdown } from "../shared/MiniCountdown";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DURATION, EASE_OUT, fadeRise, motionVariants } from "../../lib/motion";

/**
 * Wedding celebrations — two asymmetric "ticket stub" cards; the wedding
 * (main event) rendered larger/primary, the betrothal smaller alongside.
 */
export const WeddingDetailsSection: React.FC = () => {
  const betrothal = WEDDING_CONFIG.events.betrothal;
  const wedding = WEDDING_CONFIG.events.wedding;

  return (
    <section
      id="details"
      style={{
        position: "relative",
        background: "var(--v2-ink)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "68rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="Join Us"
          title="Wedding Celebrations"
          subtitle="We invite you to be part of our journey as we celebrate our union"
          variant="dark"
        />

        <div
          className="v2-details-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            marginTop: "4rem",
            alignItems: "stretch",
          }}
        >
          <EventTicket
            label="Betrothal"
            dateLabel={betrothal.dateLabel}
            time={betrothal.time}
            venue={betrothal.venue}
            mapsUrl={betrothal.mapsUrl}
            targetDate={WEDDING_CONFIG.dates.engagement}
            fromLeft
          />
          <EventTicket
            label="Holy Matrimony"
            dateLabel={wedding.dateLabel}
            time={wedding.time}
            venue={wedding.venue}
            mapsUrl={wedding.mapsUrl}
            receptionVenue={wedding.receptionVenue}
            receptionMapsUrl={wedding.receptionMapsUrl}
            targetDate={WEDDING_CONFIG.dates.wedding}
            featured
            fromLeft={false}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .v2-details-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 420px) {
          .v2-event-ticket { padding: 1.5rem !important; gap: 1.1rem !important; }
        }
      `}</style>
    </section>
  );
};

interface EventTicketProps {
  label: string;
  dateLabel: string;
  time: string;
  venue: string;
  mapsUrl: string;
  receptionVenue?: string;
  receptionMapsUrl?: string;
  targetDate: string;
  featured?: boolean;
  fromLeft: boolean;
}

const EventTicket: React.FC<EventTicketProps> = ({
  label,
  dateLabel,
  time,
  venue,
  mapsUrl,
  receptionVenue,
  receptionMapsUrl,
  targetDate,
  featured,
  fromLeft,
}) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={motionVariants(prefersReduced, {
        hidden: { opacity: 0, x: fromLeft ? -30 : 30 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: DURATION.slow, ease: EASE_OUT, staggerChildren: 0.08, delayChildren: 0.15 },
        },
      })}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="v2-event-ticket"
      style={{
        position: "relative",
        background: featured
          ? "var(--v2-deep-charcoal)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${featured ? "rgba(198,161,91,0.35)" : "var(--v2-line)"}`,
        borderRadius: "1.25rem",
        padding: "clamp(1.75rem, 3vw, 2.75rem)",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "1.75rem",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 1,
          background:
            "linear-gradient(to bottom, transparent, var(--v2-gold), transparent)",
        }}
      />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <CrossMotif size={14} />
          <span className="v2-eyebrow" style={{ color: "var(--v2-gold)" }}>
            {label}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--v2-font-serif)",
            fontSize: featured
              ? "clamp(1.5rem, 3.2vw, 2rem)"
              : "clamp(1.2rem, 2.6vw, 1.5rem)",
            fontWeight: 500,
            color: "var(--v2-ivory)",
            marginBottom: "1.25rem",
          }}
        >
          {dateLabel}
        </h3>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
        >
          <DetailRow icon={<Clock size={16} />} label="Time" value={time} prefersReduced={prefersReduced} />
          <DetailRow icon={<MapPin size={16} />} label="Venue" value={venue} prefersReduced={prefersReduced} />
          {receptionVenue && (
            <DetailRow
              icon={<MapPin size={16} />}
              label="Reception"
              value={receptionVenue}
              prefersReduced={prefersReduced}
            />
          )}
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--v2-line)",
          }}
        >
          <MiniCountdown
            label="Counting Down"
            targetDate={targetDate}
            size="sm"
            completeText="It's Here! ✓"
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn v2-btn-outline"
              style={{ fontSize: "0.65rem", padding: "0.65rem 1.5rem" }}
            >
              View on Map
            </a>
          )}
          {receptionMapsUrl && (
            <a
              href={receptionMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn v2-btn-outline"
              style={{ fontSize: "0.65rem", padding: "0.65rem 1.5rem" }}
            >
              Reception Map
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/** A staggered child of the ticket card — rows arrive one after another. */
const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  prefersReduced: boolean;
}> = ({ icon, label, value, prefersReduced }) => (
  <motion.div
    variants={motionVariants(prefersReduced, fadeRise)}
    style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "rgba(198,161,91,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--v2-gold)",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <p
        style={{
          fontFamily: "var(--v2-font-sans)",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(234,228,216,0.4)",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--v2-font-sans)",
          fontSize: "0.9rem",
          fontWeight: 300,
          color: "rgba(234,228,216,0.9)",
          margin: "0.2rem 0 0",
          lineHeight: 1.5,
        }}
      >
        {value}
      </p>
    </div>
  </motion.div>
);
