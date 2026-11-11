import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SITE, photoSrc } from "../config";

/**
 * Masonry gallery driven by SITE.photos — add more ids there (and files in
 * /public/ancy-ashish) and the grid grows. Tap a photo for the lightbox.
 */
export const Gallery: React.FC = () => {
  const photos = SITE.photos;
  const [open, setOpen] = useState<number | null>(null);

  const go = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, go]);

  return (
    <section id="gallery" className="aa-section aa-gallery">
      <header className="aa-head">
        <p className="aa-eyebrow" data-reveal>
          Gallery
        </p>
        <h2 className="aa-title" data-reveal style={{ "--d": "0.08s" } as React.CSSProperties}>
          Moments <em>we treasure</em>
        </h2>
      </header>

      <div className="aa-gallery-grid">
        {photos.map((p, i) => {
          const src = photoSrc(p.id, "sm");
          return (
            <button
              type="button"
              key={p.id}
              className="aa-gallery-item"
              onClick={() => setOpen(i)}
              data-reveal="zoom"
              style={{ "--d": `${(i % 3) * 0.1}s` } as React.CSSProperties}
              aria-label={`Open photo ${i + 1}: ${p.alt}`}
            >
              <picture>
                <source type="image/webp" srcSet={src.webp} />
                <img src={src.jpg} alt={p.alt} loading="lazy" decoding="async" width={560} height={840} />
              </picture>
            </button>
          );
        })}
      </div>
      <p className="aa-gallery-more">More photographs coming soon</p>

      {open !== null && (
        <div className="aa-lightbox" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setOpen(null)}>
          <picture onClick={(e) => e.stopPropagation()}>
            <source type="image/webp" srcSet={photoSrc(photos[open].id).webp} />
            <img src={photoSrc(photos[open].id).jpg} alt={photos[open].alt} />
          </picture>
          <button className="aa-lb-close" onClick={() => setOpen(null)} aria-label="Close" autoFocus>
            <X size={20} />
          </button>
          {photos.length > 1 && (
            <>
              <button className="aa-lb-prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous photo">
                <ChevronLeft size={22} />
              </button>
              <button className="aa-lb-next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next photo">
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <p className="aa-lb-count">
            {open + 1} / {photos.length}
          </p>
        </div>
      )}
    </section>
  );
};
