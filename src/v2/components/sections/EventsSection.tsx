import React from "react";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { WEDDING_CONFIG, type WeddingEvent } from "@/config/dates";
import type { Lang } from "../../lib/translations";
import { pick, useLang } from "../../lib/i18n";
import { formatDate, formatTime, formatTimeRange } from "../../lib/format";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** "Right after the muhurtham" style labels win over a clock time. */
function eventTime(ev: WeddingEvent, lang: Lang): string {
  const label = pick(ev, "timeLabel", lang);
  if (label) return label;
  return ev.endTime ? formatTimeRange(ev.time, ev.endTime, lang) : formatTime(ev.time, lang);
}

/**
 * Vertical timeline generated from WEDDING_CONFIG.events: a thin champagne
 * line with small dot markers. A single rail on phones; alternating
 * left/right entries from 900px up.
 */
export const EventsSection: React.FC = () => {
  const { lang, t } = useLang();
  const events = WEDDING_CONFIG.events.filter((ev) => !ev.hidden);

  return (
    <section id="events" className="v2-section v2-bg-ivory v2-grain" aria-labelledby="events-title">
      <Px name="botanical-sprig" speed={0.2} className="v2-events-sprig v2-events-sprig--left" />
      <Px name="botanical-sprig" speed={0.2} flip="x" className="v2-events-sprig v2-events-sprig--right" />
      <Px name="gold-dust" speed={0.4} className="v2-events-dust" />

      <div className="v2-container">
        <SectionHeader id="events-title" eyebrow="events.eyebrow" title="events.title" subtitle="events.subtitle" />

        <ol className="v2-timeline">
          {events.map((ev, i) => (
            <li key={`${ev.name_en}-${i}`} className={`v2-timeline-item ${ev.highlight ? "is-highlight" : ""}`}>
              <span className="v2-timeline-dot" aria-hidden="true" />
              <Reveal className="v2-timeline-card">
                <p className="v2-timeline-date" lang={lang}>
                  {formatDate(ev.date, lang)}
                </p>
                <h3 className="v2-timeline-name" lang={lang}>
                  {pick(ev, "name", lang)}
                </h3>
                <p className="v2-timeline-meta">
                  <Clock size={14} aria-hidden="true" />
                  <span lang={lang}>{eventTime(ev, lang)}</span>
                </p>
                {ev.venue && (
                  <p className="v2-timeline-meta">
                    <MapPin size={14} aria-hidden="true" />
                    <span>
                      {ev.venue}
                      {ev.mapUrl && (
                        <>
                          {" "}
                          <a className="v2-timeline-map" href={ev.mapUrl} target="_blank" rel="noopener noreferrer">
                            {t("events.map")}
                            <ExternalLink size={12} aria-hidden="true" />
                          </a>
                          {" · "}
                          <a
                            className="v2-timeline-map"
                            href={`https://maps.apple.com/?q=${encodeURIComponent(ev.venue)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("events.appleMap")}
                            <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        </>
                      )}
                    </span>
                  </p>
                )}
                {pick(ev, "note", lang) && (
                  <p className="v2-timeline-note" lang={lang}>
                    {pick(ev, "note", lang)}
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
