import React, { useState } from "react";
import { Expand } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useLang } from "../../lib/i18n";
import { Lightbox } from "../shared/Lightbox";
import { Px } from "../shared/Px";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/** Responsive square grid (2 → 3 → 4 columns), lazy-loaded, opens the lightbox. */
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
    <section id="gallery" className="v2-section v2-bg-sandal" aria-labelledby="gallery-title">
      <Px name="mural-corner" speed={0} className="v2-mural v2-mural--tl" />
      <Px name="mural-corner" speed={0} flip="x" className="v2-mural v2-mural--tr" />
      <Px name="mural-corner" speed={0} flip="y" className="v2-mural v2-mural--bl" />
      <Px name="mural-corner" speed={0} flip="xy" className="v2-mural v2-mural--br" />
      <Px name="chirathu" speed={0.1} className="v2-gallery-diya v2-gallery-diya--left" />
      <Px name="chirathu" speed={0.1} flip="x" className="v2-gallery-diya v2-gallery-diya--right" />

      <div className="v2-container">
        <SectionHeader id="gallery-title" eyebrow="gallery.eyebrow" title="gallery.title" />

        <ul className="v2-gallery-grid">
          {images.map((img, i) => (
            <li key={img.src}>
              <Reveal delay={(i % 4) * 0.06}>
                <button
                  type="button"
                  className="v2-gallery-item"
                  onClick={() => openLightbox(i)}
                  aria-label={`${t("gallery.open")}: ${img.alt}`}
                >
                  <img src={img.src} alt="" loading="lazy" decoding="async" width={480} height={600} />
                  <span className="v2-gallery-overlay" aria-hidden="true">
                    <Expand size={20} />
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
