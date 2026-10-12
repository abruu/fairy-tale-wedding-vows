import React from "react";
import { CalendarPlus } from "lucide-react";
import { MUHURTHAM_END, MUHURTHAM_START, WEDDING_CONFIG } from "@/config/dates";
import { addToCalendar } from "../../lib/calendar";
import { couplePeople } from "../../lib/couple";
import { formatDate, formatTime } from "../../lib/format";
import { T, useLang } from "../../lib/i18n";
import { translations } from "../../lib/translations";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** Opens the phone's calendar app (or downloads a .ics on desktop) with the muhurtham in it. */
function addMuhurthamToCalendar() {
  const [a, b] = couplePeople("en");
  const { venue, weddingDate } = WEDDING_CONFIG;
  addToCalendar(
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

/** Emerald highlight: the Muhurtham time in large champagne serif. */
export const MuhurthamSection: React.FC = () => {
  const { lang } = useLang();

  return (
    <section id="muhurtham" className="v2-section v2-bg-emerald" aria-labelledby="muhurtham-title">
      <Px name="gold-rings-glow" speed={0.15} x="-50%" className="v2-muhurtham-glow" />
      <Px name="gold-dust" speed={0.4} className="v2-muhurtham-dust" />

      <div className="v2-container v2-narrow v2-center">
        <SectionHeader id="muhurtham-title" eyebrow="muhurtham.eyebrow" tone="dark" />
        <Reveal>
          <p className="v2-muhurtham-time" lang={lang}>
            {formatTime(WEDDING_CONFIG.muhurthamTime, lang)}
          </p>
          <p className="v2-muhurtham-date" lang={lang}>
            {formatDate(WEDDING_CONFIG.weddingDate, lang)}
          </p>
          <T k="muhurtham.note" as="p" className="v2-muhurtham-note" />
          <button type="button" className="v2-btn v2-btn--ghost" onClick={addMuhurthamToCalendar}>
            <CalendarPlus size={16} aria-hidden="true" />
            <T k="muhurtham.addToCalendar" />
          </button>
        </Reveal>
      </div>
    </section>
  );
};
