import React from "react";
import { T, useLang } from "../../lib/i18n";
import { couplePeople, type Person } from "../../lib/couple";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** Sandal band with both profiles side by side (stacked on phones). */
export const CoupleSection: React.FC = () => {
  const { lang } = useLang();
  const [first, second] = couplePeople(lang);

  return (
    <section id="couple" className="v2-section v2-bg-sandal" aria-labelledby="couple-title">
      <Px name="kasavu-border" speed={0} className="v2-couple-kasavu v2-couple-kasavu--top" />
      <Px name="kasavu-border" speed={0} flip="y" className="v2-couple-kasavu v2-couple-kasavu--bottom" />
      <Px name="nirapara" speed={0.2} className="v2-nirapara v2-nirapara--left" />
      <Px name="nirapara" speed={0.2} flip="x" className="v2-nirapara v2-nirapara--right" />
      <Px name="kolam" speed={0.1} rotate={0.04} x="-50%" className="v2-couple-kolam" />

      <div className="v2-container">
        <SectionHeader id="couple-title" eyebrow="couple.eyebrow" title="couple.title" />
        <div className="v2-couple-grid">
          <Reveal>
            <PersonCard person={first} />
          </Reveal>
          <div className="v2-couple-amp" aria-hidden="true">
            &amp;
          </div>
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
  const rows = [
    { label: "couple.nakshatram" as const, value: person.nakshatram },
    { label: "couple.parents" as const, value: person.parents },
    { label: "couple.tharavad" as const, value: person.tharavad },
    { label: "couple.nativePlace" as const, value: person.nativePlace },
  ].filter((r) => r.value); // empty config fields are simply not shown

  return (
    <article className="v2-person">
      <div className="v2-person-photo">
        <img src={person.photo} alt={person.fullNameEn} loading="lazy" width={400} height={500} />
      </div>
      <T k={person.role === "bride" ? "couple.bride" : "couple.groom"} as="p" className="v2-eyebrow" />
      <h3 className="v2-person-name">
        <span lang="ml">{person.fullNameMl}</span>
        <span lang="en">{person.fullNameEn}</span>
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
