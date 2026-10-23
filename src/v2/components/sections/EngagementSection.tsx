import React from "react";
import { CalendarPlus, ExternalLink, MapPin } from "lucide-react";
import { ENGAGEMENT_END, ENGAGEMENT_START, WEDDING_CONFIG } from "@/config/dates";
import { addToCalendar } from "../../lib/calendar";
import { couplePeople } from "../../lib/couple";
import { formatDate, formatTime } from "../../lib/format";
import { pick, T, useLang } from "../../lib/i18n";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** Opens the phone's calendar app (Google Calendar on Android/desktop) with the engagement in it. */
function addEngagementToCalendar() {
  const [a, b] = couplePeople("en");
  const { date, venue } = WEDDING_CONFIG.engagement;
  addToCalendar({
    start: ENGAGEMENT_START,
    end: ENGAGEMENT_END,
    title: `Engagement · ${a.nameEn} & ${b.nameEn}`,
    description: `Engagement of ${a.nameEn} & ${b.nameEn}`,
    location: `${venue.name_en}, ${venue.address_en}`,
    uid: `engagement-${date}-${a.nameEn}-${b.nameEn}@invitation`.toLowerCase().replace(/\s+/g, ""),
  });
}

/** Burgundy highlight: the engagement time in large champagne serif, with date, venue and map links. */
export const EngagementSection: React.FC = () => {
  const { lang, t } = useLang();
  const { date, time, venue } = WEDDING_CONFIG.engagement;

  return (
    <section id="engagement" className="v2-section v2-bg-burgundy" aria-labelledby="engagement-title">
      <Px name="gold-rings-glow" speed={0.15} x="-50%" className="v2-engagement-glow" />
      <Px name="gold-dust" speed={0.4} className="v2-engagement-dust" />

      <div className="v2-container v2-narrow v2-center">
        <SectionHeader id="engagement-title" eyebrow="engagement.eyebrow" tone="dark" />
        <Reveal>
          <p className="v2-engagement-time" lang={lang}>
            {formatTime(time, lang)}
          </p>
          <p className="v2-engagement-date" lang={lang}>
            {formatDate(date, lang)}
          </p>

          <div className="v2-engagement-venue">
            <T k="engagement.venue" as="p" className="v2-engagement-venue-label" />
            <p className="v2-engagement-venue-name" lang={lang}>
              {pick(venue, "name", lang)}
            </p>
            <p className="v2-engagement-venue-address" lang={lang}>
              {pick(venue, "address", lang)}
            </p>
            <p className="v2-engagement-maps">
              <a className="v2-engagement-map" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={14} aria-hidden="true" />
                {t("engagement.map")}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
              <a className="v2-engagement-map" href={venue.appleMapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={14} aria-hidden="true" />
                {t("engagement.appleMap")}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>

          <T k="engagement.note" as="p" className="v2-engagement-note" />
          <button type="button" className="v2-btn v2-btn--ghost" onClick={addEngagementToCalendar}>
            <CalendarPlus size={16} aria-hidden="true" />
            <T k="engagement.addToCalendar" />
          </button>
        </Reveal>
      </div>
    </section>
  );
};
