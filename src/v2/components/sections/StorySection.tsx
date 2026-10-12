import React from "react";
import { T } from "../../lib/i18n";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** Ivory welcome: a short, warm note in the active language. */
export const StorySection: React.FC = () => (
  <section id="story" className="v2-section v2-bg-ivory v2-grain" aria-labelledby="story-title">
    <Px name="olive-branch" speed={0.2} className="v2-story-olive" />
    <Px name="soft-petals" speed={0.35} rotate={0.04} className="v2-story-petals" />

    <div className="v2-container v2-narrow">
      <SectionHeader id="story-title" eyebrow="story.eyebrow" title="story.title" />
      <Reveal>
        <T k="story.body" as="p" className="v2-story-body" />
      </Reveal>
    </div>
  </section>
);
