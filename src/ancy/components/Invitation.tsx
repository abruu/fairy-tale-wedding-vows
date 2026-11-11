import React from "react";
import { SITE } from "../config";
import { Corner, Cross } from "./Botanicals";

/** The printed invitation, set as a framed paper card — wording verbatim. */
export const Invitation: React.FC = () => {
  const { brideFamily: bf, groomFamily: gf, invitation: inv, betrothal: ev } = SITE;
  const step = (i: number) => ({ "--d": `${i * 0.09}s` }) as React.CSSProperties;

  return (
    <section id="invitation" className="aa-section aa-invite">
      <article className="aa-card" data-reveal="zoom">
        <Corner className="aa-card-corner aa-card-corner--tl" />
        <Corner className="aa-card-corner aa-card-corner--br" />

        <Cross className="aa-card-cross" />

        <p className="aa-card-hosts" data-reveal style={step(1)}>
          {inv.hosts}
        </p>
        <p className="aa-card-addr" data-reveal style={step(2)}>
          {bf.house}, {bf.address}.
        </p>

        <p className="aa-card-body" data-reveal style={step(3)}>
          {inv.body}
        </p>

        <h2 className="aa-card-name aa-script" data-reveal="blur" style={step(4)}>
          {SITE.couple.bride}
        </h2>
        <p className="aa-card-with" data-reveal style={step(5)}>
          with
        </p>
        <h2 className="aa-card-name aa-script" data-reveal="blur" style={step(6)}>
          {SITE.couple.groom}
        </h2>

        <p className="aa-card-son" data-reveal style={step(7)}>
          ({gf.relation} {gf.parents})
          <br />
          {gf.house}, {gf.address}.
        </p>

        <hr className="aa-card-rule" />

        <p className="aa-eyebrow" data-reveal>
          {inv.blessedLine}
        </p>
        <p className="aa-card-when" data-reveal style={step(1)}>
          {ev.dateLabel}
          <small>{ev.time}</small>
        </p>

        <div className="aa-card-where" data-reveal style={step(2)}>
          <div>
            <p className="aa-eyebrow">Venue</p>
            <p>{ev.venue}</p>
          </div>
          <div>
            <p className="aa-eyebrow">Lunch</p>
            <p>{ev.lunch}</p>
          </div>
        </div>
      </article>
    </section>
  );
};
