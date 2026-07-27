import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/dates";
import { SectionHeader } from "../shared/SectionHeader";
import { Lightbox } from "../shared/Lightbox";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const CAPTIONS = ["First Meeting", "Growing Closer", "Our Proposal", "Family Blessing", "Forever Begins"];
// Per-card scroll-linked drift range (px) — each polaroid moves at its own depth
const DRIFT_RANGES: [number, number][] = [
  [-40, 20],
  [30, -30],
  [-25, 35],
  [35, -25],
  [-30, 25],
];

/**
 * Special Moments — a deliberate tonal break to the warm-light "photo
 * spread" band (like a magazine switching paper stock), with each
 * polaroid drifting at its own scroll-linked depth.
 */
export const SpecialMomentsSection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const allImages = WEDDING_CONFIG.gallery.images;
  const featuredIndices = [0, 2, 4, 6, 8].filter((i) => i < allImages.length);
  const featured = featuredIndices.map((i) => allImages[i]);
  const rotations = [-4, 3, -2, 4, -3];

  const openLightbox = (idx: number) => {
    setLightboxIndex(featuredIndices[idx]);
    setLightboxOpen(true);
  };

  return (
    <section
      id="moments"
      ref={sectionRef}
      className="v2-on-light"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, var(--v2-warm-white) 0%, var(--v2-cream) 50%, var(--v2-ivory) 100%)",
        padding: "clamp(5rem, 12vh, 8rem) 1.5rem",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 2, maxWidth: "68rem", margin: "0 auto" }}>
        <SectionHeader eyebrow="Cherished Memories" title="Special Moments" subtitle="A collection of moments that tell our story" variant="light" />

        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          {featured.map((img, i) => (
            <PolaroidCard
              key={i}
              src={img.src}
              alt={img.alt}
              caption={CAPTIONS[i] || "Cherished"}
              rotation={rotations[i] || 0}
              featured={i === 2}
              driftRange={DRIFT_RANGES[i]}
              scrollYProgress={scrollYProgress}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      </div>

      <Lightbox images={allImages} index={lightboxIndex} open={lightboxOpen} onClose={() => setLightboxOpen(false)} onNavigate={setLightboxIndex} />
    </section>
  );
};

interface PolaroidCardProps {
  src: string;
  alt: string;
  caption: string;
  rotation: number;
  featured?: boolean;
  driftRange: [number, number];
  scrollYProgress: MotionValue<number>;
  onClick: () => void;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({ src, alt, caption, rotation, featured, driftRange, scrollYProgress, onClick }) => {
  const prefersReduced = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : driftRange);

  return (
    <motion.div
      className="v2-polaroid"
      onClick={onClick}
      style={{
        width: featured ? 240 : 200,
        rotate: rotation,
        y,
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.04, rotate: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", borderRadius: "2px" }}>
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <p
        style={{
          textAlign: "center",
          fontFamily: "var(--v2-font-display)",
          fontStyle: "italic",
          fontSize: "0.75rem",
          color: "rgba(28,26,22,0.5)",
          marginTop: "0.5rem",
        }}
      >
        {caption}
      </p>
    </motion.div>
  );
};
