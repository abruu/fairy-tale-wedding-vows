import React, { useState } from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";
import { Lightbox } from "../shared/Lightbox";

/**
 * Featured gallery with overlapping polaroid-style frames.
 * Uses a subset of gallery images for a curated "special moments" display.
 */
export const SpecialMomentsSection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { ref, revealed, className } = useReveal<HTMLDivElement>({
    type: "scale",
  });

  const allImages = WEDDING_CONFIG.gallery.images;
  // Pick 5 featured images spread across the gallery
  const featuredIndices = [0, 2, 4, 6, 8].filter((i) => i < allImages.length);
  const featured = featuredIndices.map((i) => allImages[i]);

  const openLightbox = (idx: number) => {
    setLightboxIndex(featuredIndices[idx]);
    setLightboxOpen(true);
  };

  // Rotations for polaroid effect
  const rotations = [-4, 3, -2, 4, -3];

  return (
    <section
      id="moments"
      className="v2-bg-gradient-gold"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "60rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="Cherished Memories"
          title="Special Moments"
          subtitle="A collection of moments that tell our story"
        />

        {/* Polaroid cluster */}
        <div
          ref={ref}
          className={`v2-polaroid-cluster ${className} ${revealed ? "revealed" : ""}`}
          style={{
            marginTop: "3rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.5rem",
            perspective: "1000px",
          }}
        >
          {featured.map((img, i) => (
            <div
              key={i}
              className="v2-polaroid"
              onClick={() => openLightbox(i)}
              style={{
                width: i === 2 ? "240px" : "200px",
                transform: `rotate(${rotations[i] || 0}deg)`,
                cursor: "pointer",
                animation: `v2-float-slow ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  borderRadius: "2px",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontFamily: "var(--v2-font-display)",
                  fontStyle: "italic",
                  fontSize: "0.75rem",
                  color: "rgba(44,44,44,0.4)",
                  marginTop: "0.5rem",
                }}
              >
                {[
                  "First Meeting",
                  "Growing Closer",
                  "Our Proposal",
                  "Family Blessing",
                  "Forever Begins",
                ][i] || "Cherished"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        images={allImages}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
};
