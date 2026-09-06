import React, { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DURATION, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';

interface GalleryImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen lightbox with keyboard navigation and touch support.
 */
export const Lightbox: React.FC<LightboxProps> = ({
  images,
  index,
  open,
  onClose,
  onNavigate,
}) => {
  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onNavigate(index === 0 ? images.length - 1 : index - 1);
  }, [index, images.length, onNavigate]);

  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onNavigate(index === images.length - 1 ? 0 : index + 1);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, prev, next, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="v2-lightbox"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: DURATION.fast, ease: EASE_IN_OUT }}
        >
          <button className="v2-lightbox-close" onClick={onClose} aria-label="Close gallery">
            <X size={20} />
          </button>

          <button className="v2-lightbox-nav v2-lightbox-nav-left" onClick={prev} aria-label="Previous photo">
            <ChevronLeft size={24} />
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index].src}
              alt={images[index].alt}
              className="v2-lightbox-img"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            />
          </AnimatePresence>

          <button className="v2-lightbox-nav v2-lightbox-nav-right" onClick={next} aria-label="Next photo">
            <ChevronRight size={24} />
          </button>

          <div className="v2-lightbox-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`v2-lightbox-dot ${i === index ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
