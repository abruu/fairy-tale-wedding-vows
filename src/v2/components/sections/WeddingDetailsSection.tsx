import React from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { MapPin, Clock, Calendar } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";
import { CornerFlourish } from "../shared/Ornament";

/**
 * Creative split layout for wedding event details.
 * Two events side by side with elegant cards and map links.
 */
export const WeddingDetailsSection: React.FC = () => {
  const {
    ref: ref1,
    revealed: rev1,
    className: cls1,
  } = useReveal<HTMLDivElement>({ type: "left", delay: 0 });
  const {
    ref: ref2,
    revealed: rev2,
    className: cls2,
  } = useReveal<HTMLDivElement>({ type: "right", delay: 150 });

  const betrothal = WEDDING_CONFIG.events.betrothal;
  const wedding = WEDDING_CONFIG.events.wedding;

  return (
    <section
      id="details"
      className="v2-bg-gradient-soft"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Watercolor accents */}
      <div
        className="v2-watercolor"
        style={{
          width: 350,
          height: 350,
          top: "20%",
          left: "-8%",
          background: "var(--v2-gold)",
        }}
      />
      <div
        className="v2-watercolor"
        style={{
          width: 300,
          height: 300,
          bottom: "10%",
          right: "-8%",
          background: "var(--v2-soft-green)",
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
          eyebrow="Join Us"
          title="Wedding Celebrations"
          subtitle="We invite you to be part of our journey as we celebrate our union"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "2rem",
            marginTop: "3.5rem",
          }}
        >
          {/* Betrothal Card */}
          <EventCard
            revealRef={ref1}
            revealed={rev1}
            className={cls1}
            label="Betrothal"
            dateLabel={betrothal.dateLabel}
            time={betrothal.time}
            venue={betrothal.venue}
            mapsUrl={betrothal.mapsUrl}
            icon={<Calendar size={20} />}
            accentColor="var(--v2-rose-gold)"
          />

          {/* Wedding Card */}
          <EventCard
            revealRef={ref2}
            revealed={rev2}
            className={cls2}
            label="Holy Matrimony"
            dateLabel={wedding.dateLabel}
            time={wedding.time}
            venue={wedding.venue}
            mapsUrl={wedding.mapsUrl}
            icon={<Calendar size={20} />}
            accentColor="var(--v2-gold)"
            featured
          />
        </div>
      </div>
    </section>
  );
};

interface EventCardProps {
  label: string;
  dateLabel: string;
  time: string;
  venue: string;
  mapsUrl: string;
  icon: React.ReactNode;
  accentColor: string;
  featured?: boolean;
  revealRef: React.RefObject<HTMLDivElement>;
  revealed: boolean;
  className: string;
}

const EventCard: React.FC<EventCardProps> = ({
  label,
  dateLabel,
  time,
  venue,
  mapsUrl,
  accentColor,
  featured,
  revealRef,
  revealed,
  className,
}) => {
  return (
    <div
      ref={revealRef}
      className={`v2-luxury-card ${className} ${revealed ? "revealed" : ""}`}
      style={{
        padding: "2.5rem 2rem",
        position: "relative",
        overflow: "hidden",
        ...(featured
          ? {
              borderColor: "rgba(201,169,110,0.3)",
              boxShadow: "0 8px 32px rgba(201,169,110,0.12)",
            }
          : {}),
      }}
    >
      <CornerFlourish
        position="tl"
        color={`rgba(${accentColor === "var(--v2-gold)" ? "201,169,110" : "183,110,121"},0.2)`}
      />
      <CornerFlourish
        position="br"
        color={`rgba(${accentColor === "var(--v2-gold)" ? "201,169,110" : "183,110,121"},0.2)`}
      />

      {/* Label badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 1.2rem",
          borderRadius: "9999px",
          background: `${accentColor === "var(--v2-gold)" ? "rgba(201,169,110,0.1)" : "rgba(183,110,121,0.1)"}`,
          border: `1px solid ${accentColor === "var(--v2-gold)" ? "rgba(201,169,110,0.2)" : "rgba(183,110,121,0.2)"}`,
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ color: accentColor, fontSize: "0.7rem" }}>♥</span>
        <span className="v2-eyebrow" style={{ color: accentColor }}>
          {label}
        </span>
      </div>

      {/* Date */}
      <h3
        style={{
          fontFamily: "var(--v2-font-serif)",
          fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
          fontWeight: 500,
          color: "var(--v2-charcoal)",
          marginBottom: "1.5rem",
        }}
      >
        {dateLabel}
      </h3>

      {/* Details list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <DetailRow icon={<Clock size={16} />} label="Time" value={time} />
        <DetailRow icon={<MapPin size={16} />} label="Venue" value={venue} />
      </div>

      {/* Map link */}
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="v2-btn v2-btn-outline"
          style={{
            marginTop: "1.75rem",
            width: "100%",
            fontSize: "0.65rem",
            padding: "0.65rem 1.5rem",
          }}
        >
          View on Map
        </a>
      )}
    </div>
  );
};

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "rgba(201,169,110,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--v2-gold-dark)",
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
          color: "rgba(44,44,44,0.4)",
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
          color: "var(--v2-charcoal)",
          margin: "0.2rem 0 0",
          lineHeight: 1.5,
        }}
      >
        {value}
      </p>
    </div>
  </div>
);
