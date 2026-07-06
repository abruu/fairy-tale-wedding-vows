import React, { useState } from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useReveal } from "../../hooks/useReveal";
import { SectionHeader } from "../shared/SectionHeader";
import { Lightbox } from "../shared/Lightbox";

/**
 * Masonry-style gallery with lightbox.
 * Images in varying heights with hover effects.
 */
export const GallerySection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = WEDDING_CONFIG.gallery.images;

  // Varying heights for masonry effect
  const heights = [
    "320px",
    "260px",
    "380px",
    "300px",
    "340px",
    "280px",
    "360px",
    "290px",
    "330px",
    "270px",
    "350px",
  ];

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      className="v2-bg-cream"
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
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <SectionHeader
          eyebrow="Our Gallery"
          title="Moments in Time"
          subtitle="Captured memories of our journey together"
        />

        {/* Masonry grid */}
        <div
          className="v2-gallery-masonry"
          style={{
            marginTop: "3rem",
            columns: "3",
            columnGap: "1rem",
          }}
        >
          {images.map((img, i) => (
            <GalleryItem
              key={i}
              src={img.src}
              alt={img.alt}
              height={heights[i % heights.length]}
              index={i}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
};

interface GalleryItemProps {
  src: string;
  alt: string;
  height: string;
  index: number;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  src,
  alt,
  height,
  index,
  onClick,
}) => {
  const { ref, revealed, className } = useReveal<HTMLDivElement>({
    type: "scale",
    delay: (index % 3) * 100,
  });

  return (
    <div
      ref={ref}
      className={`v2-gallery-item ${className} ${revealed ? "revealed" : ""}`}
      onClick={onClick}
      style={{
        breakInside: "avoid",
        marginBottom: "1rem",
        height,
        cursor: "pointer",
      }}
    >
      <img src={src} alt={alt} loading="lazy" />
      <div className="v2-gallery-overlay">
        <span
          style={{
            color: "var(--v2-ivory)",
            fontFamily: "var(--v2-font-display)",
            fontStyle: "italic",
            fontSize: "0.85rem",
          }}
        >
          View
        </span>
      </div>
    </div>
  );
};
