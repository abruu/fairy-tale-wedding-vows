import React from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { T, useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import { formatDate } from "../../lib/format";
import { Monogram } from "../shared/Monogram";
import { Px } from "../shared/Px";

/** Burgundy closing band: thank-you line, names, hashtag, contact and monogram. */
export const FooterSection: React.FC = () => {
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);
  const { hashtag, engagement } = WEDDING_CONFIG;

  return (
    <footer className="v2-footer">
      {/* <section> so the parallax engine treats the footer like every other band */}
      <section className="v2-section v2-bg-burgundy">
        <Px name="gold-dust" speed={0.3} className="v2-footer-dust" />

        <div className="v2-container v2-center v2-footer-text">
          <Monogram size={64} className="v2-footer-monogram" />
          <T k="footer.thanks" as="p" className="v2-footer-thanks" />
          <p className="v2-footer-names" lang={lang}>
            {first.name} &amp; {second.name}
          </p>
          <p className="v2-footer-date" lang={lang}>
            {formatDate(engagement.date, lang, false)}
          </p>
          {hashtag && <p className="v2-footer-hashtag">{hashtag}</p>}
        </div>
      </section>
    </footer>
  );
};
