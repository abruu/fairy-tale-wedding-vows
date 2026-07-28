import React, { useState } from "react";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { SectionHeader } from "../shared/SectionHeader";
import { Lightbox } from "../shared/Lightbox";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Editorial gallery — a simple masonry grid, fewer/bigger tiles with
 * generous gutters, click any tile to open the lightbox.
 */
export const GallerySection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = WEDDING_CONFIG.gallery.images;

  const heights = [
    "380px",
    "300px",
    "440px",
    "340px",
    "400px",
    "320px",
    "420px",
    "340px",
    "360px",
    "300px",
    "400px",
    "340px",
  ];

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      style={{
        position: "relative",
        background: "var(--v2-deep-charcoal)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
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
          variant="dark"
        />

        <div className="v2-gallery-masonry" style={{ marginTop: "4rem" }}>
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
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="v2-gallery-item"
      onClick={onClick}
      initial={prefersReduced ? undefined : { opacity: 0, scale: 0.94 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        breakInside: "avoid",
        marginBottom: "1.75rem",
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
    </motion.div>
  );
};
