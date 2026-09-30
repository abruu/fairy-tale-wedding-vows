import React from "react";
import { useLang } from "../../lib/i18n";
import { translations } from "../../lib/translations";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

const PETALS = [
  { top: "12%", left: "6%", w: 30, speed: 0.35, rotate: 0.04 },
  { top: "70%", left: "10%", w: 22, speed: 0.5, rotate: -0.04 },
  { top: "18%", left: "88%", w: 26, speed: 0.45, rotate: -0.04 },
  { top: "76%", left: "84%", w: 34, speed: 0.3, rotate: 0.04 },
  { top: "46%", left: "95%", w: 18, speed: 0.55, rotate: 0.05 },
];

/**
 * Short welcome in both languages — the active one leads, the other follows
 * beneath it, the way a printed Kerala invitation card pairs the two.
 */
export const BlessingsSection: React.FC = () => {
  const { lang } = useLang();
  const other = lang === "en" ? "ml" : "en";

  return (
    <section id="blessings" className="v2-section v2-bg-ivory" aria-labelledby="blessings-title">
      <Px name="thookku-vilakku" speed={0.12} rotate={0.01} className="v2-hanging-lamp v2-hanging-lamp--left" />
      <Px name="thookku-vilakku" speed={0.12} rotate={-0.01} className="v2-hanging-lamp v2-hanging-lamp--right" />
      <Px name="peacock-feather" speed={0.3} rotate={0.015} className="v2-feather v2-feather--left" />
      <Px name="peacock-feather" speed={0.3} rotate={-0.015} flip="x" className="v2-feather v2-feather--right" />
      {PETALS.map((p, i) => (
        <Px
          key={i}
          name="jasmine-petals"
          speed={p.speed}
          rotate={p.rotate}
          className="v2-petal"
          style={{ top: p.top, left: p.left, width: p.w, animationDelay: `${i * -1.7}s` }}
        />
      ))}

      <div className="v2-container v2-narrow">
        <SectionHeader id="blessings-title" eyebrow="blessings.eyebrow" title="blessings.title" />
        <Reveal>
          <p className="v2-blessing-primary" lang={lang}>
            {translations[lang]["blessings.body"]}
          </p>
          <p className="v2-blessing-secondary" lang={other}>
            {translations[other]["blessings.body"]}
          </p>
        </Reveal>
      </div>
    </section>
  );
};
