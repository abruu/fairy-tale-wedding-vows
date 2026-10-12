import React, { useState } from "react";
import { Expand } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useLang } from "../../lib/i18n";
import { Lightbox } from "../shared/Lightbox";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** Masonry grid (2 → 3 columns), lazy-loaded, opens the lightbox. */
export const GallerySection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { t } = useLang();
  const images = WEDDING_CONFIG.gallery;

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="v2-section v2-bg-blush" aria-labelledby="gallery-title">
      <Px name="peony-cluster" speed={0.15} className="v2-gallery-peony v2-gallery-peony--tl" />
      <Px name="peony-cluster" speed={0.15} flip="xy" className="v2-gallery-peony v2-gallery-peony--br" />

      <div className="v2-container">
        <SectionHeader id="gallery-title" eyebrow="gallery.eyebrow" title="gallery.title" />

        <ul className="v2-gallery-grid">
          {images.map((img, i) => (
            <li key={img.src}>
              <Reveal>
                <button
                  type="button"
                  className="v2-gallery-item"
                  onClick={() => openLightbox(i)}
                  aria-label={`${t("gallery.open")}: ${img.alt}`}
                >
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={img.w}
                    height={img.h}
                    style={{ aspectRatio: `${img.w} / ${img.h}` }}
                  />
                  <span className="v2-gallery-overlay" aria-hidden="true">
                    <Expand size={18} />
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
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
