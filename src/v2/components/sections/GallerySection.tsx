import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLang } from "../../lib/i18n";
import { GALLERY_PHOTOS } from "../../lib/gallery";
import { Reveal } from "../shared/Reveal";
import { SectionHeader } from "../shared/SectionHeader";

/**
 * Blush band with the couple's photos in a tidy grid; tapping one opens it
 * full-size in a lightbox (arrows / swipe / keyboard to browse). The photos
 * are decorative to a screen reader — each button carries "View photo 3 of 10".
 */
export const GallerySection: React.FC = () => {
  const { t } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const total = GALLERY_PHOTOS.length;

  return (
    <section id="gallery" className="v2-section v2-bg-blush" aria-labelledby="gallery-title">
      <div className="v2-container">
        <SectionHeader id="gallery-title" eyebrow="gallery.eyebrow" title="gallery.title" subtitle="gallery.subtitle" />
        <ul className="v2-gallery">
          {GALLERY_PHOTOS.map((p, i) => (
            <li key={p.thumb} className="v2-gallery-cell">
              <Reveal delay={(i % 4) * 0.08}>
                <button
                  type="button"
                  className="v2-gallery-item"
                  aria-label={`${t("gallery.open")} ${i + 1} ${t("gallery.of")} ${total}`}
                  onClick={() => setActive(i)}
                >
                  <img src={p.thumb} width={p.width} height={p.height} alt="" loading="lazy" decoding="async" />
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {active !== null && <Lightbox index={active} onIndex={setActive} onClose={() => setActive(null)} />}
    </section>
  );
};

const SWIPE_PX = 50;

const Lightbox: React.FC<{ index: number; onIndex: (i: number) => void; onClose: () => void }> = ({ index, onIndex, onClose }) => {
  const { t } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const total = GALLERY_PHOTOS.length;

  const go = useCallback((dir: -1 | 1) => onIndex((index + dir + total) % total), [index, total, onIndex]);

  // Focus moves in on open and back to the photo that was tapped on close; the page behind doesn't scroll.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Tab") {
        // Keep Tab inside the dialog
        const els = Array.from(document.querySelectorAll<HTMLElement>(".v2-lightbox button"));
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Warm the neighbours so next/previous feels instant
  useEffect(() => {
    [-1, 1].forEach((d) => {
      const img = new Image();
      img.src = GALLERY_PHOTOS[(index + d + total) % total].full;
    });
  }, [index, total]);

  const photo = GALLERY_PHOTOS[index];

  // Portalled out of the section: its stacking context would otherwise keep the nav and buttons above the overlay.
  // Into .v2-root (not <body>) so the theme variables and fonts still apply.
  return createPortal(
    <div
      className="v2-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${t("gallery.open")} ${index + 1} ${t("gallery.of")} ${total}`}
      // Lenis must ignore wheel/touch over the overlay
      data-lenis-prevent
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeRef} type="button" className="v2-lightbox-btn is-close" aria-label={t("gallery.close")} onClick={onClose}>
        <X size={22} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="v2-lightbox-btn is-prev"
        aria-label={t("gallery.prev")}
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
      >
        <ChevronLeft size={26} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="v2-lightbox-btn is-next"
        aria-label={t("gallery.next")}
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
      >
        <ChevronRight size={26} aria-hidden="true" />
      </button>

      {/* keyed so each photo fades in fresh; the thumbnail underneath is already cached, so there's no blank flash */}
      <img
        key={photo.full}
        className="v2-lightbox-img"
        src={photo.full}
        alt=""
        style={{ backgroundImage: `url(${photo.thumb})` }}
        onClick={(e) => e.stopPropagation()}
      />
      <p className="v2-lightbox-count" aria-hidden="true" lang="en">
        {index + 1} / {total}
      </p>
    </div>,
    document.querySelector(".v2-root") ?? document.body,
  );
};
