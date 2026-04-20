
import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next]);

  // Responsive grid: vary the aspect ratio for a more dynamic feel
  const aspectRatios = ['3/4', '4/5', '3/4', '4/3', '3/4', '4/5', '3/4'];

  return (
    <div className="w-full">
      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            style={{ aspectRatio: aspectRatios[index % aspectRatios.length] }}
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            aria-label={`View photo: ${image.alt}`}
            onKeyDown={e => e.key === 'Enter' && openLightbox(index)}
            data-aos="zoom-in"
            data-aos-delay={index * 60}
            data-aos-duration="500"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="gallery-overlay">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-medium"
                style={{ background: 'rgba(75,56,50,0.6)', backdropFilter: 'blur(6px)' }}
              >
                <Expand size={12} />
                View Photo
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-screen-lg w-full p-0 border-none"
          style={{ background: 'rgba(10,5,5,0.95)', borderRadius: '1rem' }}
        >
          <div className="relative w-full flex items-center justify-center min-h-[60vh]">
            {/* Close */}
            <button
              className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X size={18} className="text-white" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={prev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>

            {/* Image */}
            <div className="w-full flex justify-center p-4">
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
              />
            </div>

            {/* Next */}
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={next}
              aria-label="Next photo"
            >
              <ChevronRight size={22} className="text-white" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className="rounded-full transition-all"
                  style={{
                    width: i === currentIndex ? 20 : 6,
                    height: 6,
                    background: i === currentIndex ? '#E6CBA8' : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoGallery;
