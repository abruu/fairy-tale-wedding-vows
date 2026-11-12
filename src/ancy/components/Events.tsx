import React from "react";
import { CalendarPlus, Clock, MapPin, Navigation, UtensilsCrossed, Church } from "lucide-react";
import { SITE, calendarLink, mapsLink } from "../config";
import { Sprig, Wreath } from "./Botanicals";
import { Countdown, EventCountdown, useNextEvent } from "./Countdown";

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="aa-row">
    {icon}
    <div>
      <small>{label}</small>
      <p>{value}</p>
    </div>
  </div>
);

const dayParts = (iso: string) => {
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    weekday: d.toLocaleDateString("en-GB", { weekday: "long" }),
  };
};

/** Two event cards: the betrothal (light, primary) and the wedding (deep forest). */
export const Events: React.FC = () => {
  const b = SITE.betrothal;
  const w = SITE.wedding;
  const bd = dayParts(b.iso);
  const wd = dayParts(w.iso);

  return (
    <section id="celebrations" className="aa-section">
      <header className="aa-head">
        <p className="aa-eyebrow" data-reveal>
          Save the Dates
        </p>
        <h2 className="aa-title" data-reveal style={{ "--d": "0.08s" } as React.CSSProperties}>
          Two days, <em>one blessing</em>
        </h2>
      </header>

      <div className="aa-events-grid">
        <article className="aa-event" data-reveal>
          <Sprig className="aa-event-sprig" seed={21} />
          <p className="aa-eyebrow">{b.title}</p>
          <div className="aa-event-date">
            <b>{bd.day}</b>
            <span>
              <small>{bd.weekday}</small>
              {bd.month}
            </span>
          </div>
          <div className="aa-event-rows">
            <Row icon={<Clock aria-hidden="true" />} label="Time" value={b.time} />
            <Row icon={<Church aria-hidden="true" />} label="Venue" value={b.venue} />
            <Row icon={<UtensilsCrossed aria-hidden="true" />} label="Lunch" value={b.lunch} />
          </div>
          <div className="aa-event-count">
            <p className="aa-eyebrow">Counting down</p>
            <EventCountdown iso={b.iso} doneText="Blessed on 02 January 2027 ✓" />
          </div>
          <div className="aa-event-actions">
            <a className="aa-btn" href={mapsLink(b)} target="_blank" rel="noopener noreferrer">
              <Navigation size={14} aria-hidden="true" /> Directions
            </a>
            <a className="aa-btn aa-btn--ghost" href={calendarLink(b)} target="_blank" rel="noopener noreferrer">
              <CalendarPlus size={14} aria-hidden="true" /> Add to Calendar
            </a>
          </div>
        </article>

        <article className="aa-event aa-event--dark" data-reveal style={{ "--d": "0.15s" } as React.CSSProperties}>
          <p className="aa-eyebrow">{w.title}</p>
          <div className="aa-event-date">
            <b>{wd.day}</b>
            <span>
              <small>{wd.weekday}</small>
              {wd.month}
            </span>
          </div>
          <div className="aa-event-rows">
            <Row icon={<Clock aria-hidden="true" />} label="Time" value={w.time} />
            <Row icon={<MapPin aria-hidden="true" />} label="Church" value={w.venue} />
          </div>
          <div className="aa-event-count">
            <p className="aa-eyebrow">Counting down</p>
            <EventCountdown iso={w.iso} doneText="Joined in Holy Matrimony ✓" />
          </div>
          <div className="aa-event-actions">
            <a className="aa-btn aa-btn--light" href={mapsLink(w)} target="_blank" rel="noopener noreferrer">
              <Navigation size={14} aria-hidden="true" /> Directions
            </a>
            <a className="aa-btn aa-btn--line-light" href={calendarLink(w)} target="_blank" rel="noopener noreferrer">
              <CalendarPlus size={14} aria-hidden="true" /> Add to Calendar
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};

/** Deep band: scripture (placeholder) + the big live countdown. */
export const CountdownBand: React.FC = () => {
  const next = useNextEvent();
  return (
    <section className="aa-section aa-band" aria-label="Countdown">
      <Wreath className="aa-band-wreath" seed={4} />
      <div style={{ position: "relative" }}>
        <p className="aa-eyebrow" data-reveal>
          {next ? `Counting the days ${next.label}` : "With grateful hearts"}
        </p>
        {SITE.scripture.map((v) => (
          <React.Fragment key={v.reference}>
            <p className="aa-band-quote" data-reveal="blur">
              {v.quote}
            </p>
            <p className="aa-band-ref" data-reveal style={{ marginBottom: "2rem" }}>
              {v.reference}
            </p>
          </React.Fragment>
        ))}
        <div data-reveal style={{ "--d": "0.2s" } as React.CSSProperties}>
          <Countdown variant="band" />
        </div>
      </div>
    </section>
  );
};
