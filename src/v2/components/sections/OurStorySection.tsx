import React from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";

/**
 * Journey path timeline with alternating left-right layout on desktop,
 * stacked on mobile. Interactive milestone dots.
 */
export const OurStorySection: React.FC = () => {
  const items = WEDDING_CONFIG.story.items;

  return (
    <section
      id="story"
      className="v2-bg-gradient-rose"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Watercolor accents */}
      <div
        className="v2-watercolor"
        style={{
          width: 300,
          height: 300,
          top: "10%",
          right: "-5%",
          background: "var(--v2-rose-gold)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "60rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="Our Journey"
          title="How it all began"
          subtitle="Every love story is beautiful, but ours is our favorite"
        />

        {/* Timeline */}
        <div className="v2-timeline">
          {/* Center line (desktop) / Left line (mobile) */}
          <div className="v2-timeline-line" />

          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <StoryItem
                key={i}
                date={item.date}
                content={item.content}
                index={i}
                isLeft={isLeft}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface StoryItemProps {
  date: string;
  content: string;
  index: number;
  isLeft: boolean;
}

const StoryItem: React.FC<StoryItemProps> = ({
  date,
  content,
  index,
  isLeft,
}) => {
  const { ref, revealed, className } = useReveal<HTMLDivElement>({
    type: isLeft ? "left" : "right",
    delay: index * 80,
  });

  return (
    <div
      ref={ref}
      className={`v2-timeline-item ${className} ${revealed ? "revealed" : ""} ${isLeft ? "v2-timeline-left" : "v2-timeline-right"}`}
    >
      {/* Timeline dot */}
      <div className="v2-timeline-dot" />

      {/* Content card */}
      <div className="v2-timeline-card v2-luxury-card">
        <p className="v2-eyebrow" style={{ marginBottom: "0.75rem" }}>
          {date}
        </p>
        <p
          style={{
            fontFamily: "var(--v2-font-display)",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "var(--v2-charcoal)",
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
};
