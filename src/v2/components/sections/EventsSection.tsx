import React from "react";
import { CalendarPlus, Clock, ExternalLink, MapPin } from "lucide-react";
import { MUHURTHAM_END, MUHURTHAM_START, WEDDING_CONFIG, type WeddingEvent } from "@/config/dates";
import { downloadIcs } from "../../lib/calendar";
import { couplePeople } from "../../lib/couple";
import { translations } from "../../lib/translations";
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

/** Downloads a .ics invite for the muhurtham (Apple / Google / Outlook calendars). */
function addMuhurthamToCalendar() {
  const [a, b] = couplePeople("en");
  const { venue, weddingDate } = WEDDING_CONFIG;
  downloadIcs(
    {
      start: MUHURTHAM_START,
      end: MUHURTHAM_END,
      title: `Muhurtham · ${a.nameEn} & ${b.nameEn}`,
      description: translations.en["events.subtitle"],
      location: `${venue.name_en}, ${venue.address}`,
      uid: `muhurtham-${weddingDate}-${a.nameEn}-${b.nameEn}@wedding`.toLowerCase().replace(/\s+/g, ""),
    },
    "muhurtham.ics",
  );
}

/**
 * Vertical timeline generated from WEDDING_CONFIG.events. A single rail on
 * phones; alternating left/right cards from 900px up.
 */
export const EventsSection: React.FC = () => {
  const { lang, t } = useLang();
  const events = WEDDING_CONFIG.events.filter((ev) => !ev.hidden);
  // The calendar button sits on the first highlighted card (the muhurtham)
  const muhurthamIndex = events.findIndex((ev) => ev.highlight);

  return (
    <section id="events" className="v2-section v2-bg-ivory" aria-labelledby="events-title">
      <Px name="elephant-nettipattam" speed={0.2} className="v2-events-elephant v2-events-elephant--left" />
      <Px name="elephant-nettipattam" speed={0.2} flip="x" className="v2-events-elephant v2-events-elephant--right" />
      {/* Edge-anchored layers in this very tall section move gently, or they'd be
          pushed out past the top/bottom edge before coming into view */}
      <Px name="lotus" speed={0.15} className="v2-events-lotus v2-events-lotus--a" />
      <Px name="lotus" speed={0.15} className="v2-events-lotus v2-events-lotus--b" />
      <Px name="shankhu" speed={0.25} rotate={-0.01} className="v2-events-shankhu" />
      <Px name="vettila" speed={0.2} className="v2-events-vettila" />
      <Px name="temple-bell" speed={0.12} rotate={0.02} className="v2-bell v2-bell--left" />
      <Px name="temple-bell" speed={0.12} rotate={-0.02} className="v2-bell v2-bell--right" />

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
                <h3 className="v2-timeline-name">
                  <span lang={lang}>{pick(ev, "name", lang)}</span>
                  <span className="v2-timeline-name-alt" lang={lang === "en" ? "ml" : "en"}>
                    {pick(ev, "name", lang === "en" ? "ml" : "en")}
                  </span>
                </h3>
                <p className="v2-timeline-meta">
                  <Clock size={15} aria-hidden="true" />
                  <span lang={lang}>{eventTime(ev, lang)}</span>
                </p>
                {ev.venue && (
                  <p className="v2-timeline-meta">
                    <MapPin size={15} aria-hidden="true" />
                    <span>
                      {ev.venue}
                      {ev.mapUrl && (
                        <>
                          {" "}
                          <a className="v2-timeline-map" href={ev.mapUrl} target="_blank" rel="noopener noreferrer">
                            {t("events.map")}
                            <ExternalLink size={13} aria-hidden="true" />
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
                {i === muhurthamIndex && (
                  <button type="button" className="v2-link-btn v2-timeline-cal" onClick={addMuhurthamToCalendar}>
                    <CalendarPlus size={16} aria-hidden="true" />
                    {t("muhurtham.addToCalendar")}
                  </button>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
