import React from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate } from "../../lib/format";
import { Px } from "../shared/Px";

/** Green closing band: blessing line, names and hashtag. */
export const FooterSection: React.FC = () => {
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);
  const { hashtag, weddingDate } = WEDDING_CONFIG;

  return (
    <footer className="v2-footer">
      {/* <section> so the parallax engine treats the footer like every other band */}
      <section className="v2-section v2-bg-green">
        <Px name="kasavu-border" speed={0} className="v2-footer-kasavu" />
        <Px name="kolam" speed={0.1} rotate={0.05} x="-50%" className="v2-footer-kolam" />
        <Px name="nilavilakku" speed={0.2} className="v2-footer-lamp v2-footer-lamp--left" />
        <Px name="nilavilakku" speed={0.2} className="v2-footer-lamp v2-footer-lamp--right" />

        {/* Text sits on its own layer above the kolam/lamps with a readability
            shadow (see .v2-footer-text in v2.css) so it stays legible no
            matter how busy the decorative art behind it gets. */}
        <div className="v2-container v2-center v2-footer-text">
          <p className="v2-footer-blessing" lang="ml">
            ശുഭമസ്തു
          </p>
          {lang === "en" && <T k="footer.blessing" as="p" className="v2-footer-blessing-en" />}
          <p className="v2-footer-love" lang={lang}>
            <T k="footer.withLove" /> {first.name} &amp; {second.name}
          </p>
          <p className="v2-footer-date" lang={lang}>
            {formatDate(weddingDate, lang, false)} · <span lang="ml" className="v2-nowrap">{WEDDING_CONFIG.malayalamDate_ml}</span>
          </p>
          <p className="v2-footer-hashtag">{hashtag}</p>
        </div>
      </section>
    </footer>
  );
};
