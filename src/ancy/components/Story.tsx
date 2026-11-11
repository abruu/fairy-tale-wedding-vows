import React from "react";
import { SITE } from "../config";

/** Placeholder timeline — copy arrives later (see SITE.story). */
export const Story: React.FC = () => (
  <section id="story" className="aa-section">
    <header className="aa-head">
      <p className="aa-eyebrow" data-reveal>
        Our Story
      </p>
      <h2 className="aa-title" data-reveal style={{ "--d": "0.08s" } as React.CSSProperties}>
        A little <em>love story</em>
      </h2>
    </header>

    <ol className="aa-story-list" style={{ listStyle: "none", padding: 0, margin: "0 auto" }}>
      {SITE.story.map((s, i) => (
        <li className="aa-story" key={i} data-reveal>
          <span className="aa-story-dot" aria-hidden="true">
            {i + 1}
          </span>
          <div className="aa-story-body">
            <p className="aa-eyebrow">{s.label}</p>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);
