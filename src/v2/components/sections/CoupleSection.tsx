import React from "react";
import { T, useLang } from "../../lib/i18n";
import { couplePeople, type Person } from "../../lib/couple";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/**
 * Blush band with one ivory card split in two — a family on each side of a gold
 * seam, joined by an "&" medallion. Each half carries a large ghost initial (no photos).
 */
export const CoupleSection: React.FC = () => {
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);

  return (
    <section id="couple" className="v2-section v2-bg-blush" aria-labelledby="couple-title">
      <Px name="gold-line-arch" speed={0.1} x="-50%" className="v2-couple-arch" />
      <Px name="peony-cluster" speed={0.25} className="v2-couple-peony" />

      <div className="v2-container">
        <SectionHeader id="couple-title" eyebrow="couple.eyebrow" title="couple.title" />
        <div className="v2-couple-pair">
          <Reveal>
            <PersonCard person={first} />
          </Reveal>
          <span className="v2-couple-amp" lang="en" aria-hidden="true">
            &amp;
          </span>
          <Reveal delay={0.12}>
            <PersonCard person={second} />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const PersonCard: React.FC<{ person: Person }> = ({ person }) => {
  const { lang } = useLang();
  const rows = [{ label: "couple.parents" as const, value: person.parents }].filter((r) => r.value); // empty config fields are simply not shown
  const fullName = lang === "hi" ? person.fullNameHi : person.fullNameEn;

  return (
    <article className="v2-person">
      <div className="v2-person-initial" aria-hidden="true">
        {lang === "hi" ? (
          <span lang="hi">{Array.from(person.nameHi)[0]}</span>
        ) : (
          <span lang="en">{person.nameEn[0]}</span>
        )}
      </div>
      <T k={person.role === "bride" ? "couple.bride" : "couple.groom"} as="p" className="v2-eyebrow" />
      <h3 className="v2-person-name" lang={lang}>
        {fullName}
      </h3>
      <dl className="v2-person-details">
        {rows.map((r) => (
          <div key={r.label}>
            <dt>
              <T k={r.label} />
            </dt>
            <dd lang={lang}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
};
