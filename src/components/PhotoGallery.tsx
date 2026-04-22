
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { ANIMATION_CONFIG } from '@/config/animations';
import { useScrollReveal, staggerDelay } from '@/hooks/useScrollReveal';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef(0);
  const scrollPos = useRef(0);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dragMovedPx = useRef(0);

  const galleryCfg = ANIMATION_CONFIG.gallery;

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

  // Horizontal auto-slide
  useEffect(() => {
    if (!galleryCfg.autoSlide.enabled) return;
    const el = scrollRef.current;
    if (!el) return;

    const speed = galleryCfg.autoSlide.speed;
    const dir = galleryCfg.autoSlide.direction === 'left' ? 1 : -1;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (!isPaused.current) {
        const dt = (now - lastTime) / 1000;
        scrollPos.current += speed * dir * dt;

        // Loop: when scrolled past half (duplicated content), reset
        const maxScroll = el.scrollWidth / 2;
        if (scrollPos.current >= maxScroll) scrollPos.current -= maxScroll;
        if (scrollPos.current < 0) scrollPos.current += maxScroll;

        el.scrollLeft = scrollPos.current;
      }
      lastTime = now;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [galleryCfg.autoSlide]);

  // Cleanup resume timer
  useEffect(() => {
    return () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); };
  }, []);

  const handleMouseEnter = () => {
    if (galleryCfg.autoSlide.pauseOnHover && !isDragging.current) isPaused.current = true;
  };
  const handleMouseLeave = () => {
    if (galleryCfg.autoSlide.pauseOnHover && !isDragging.current) isPaused.current = false;
  };

  // ── Manual drag / touch scroll ──
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragMovedPx.current = 0;
    dragStartX.current = e.clientX;
    dragScrollStart.current = scrollPos.current;
    scrollRef.current.setPointerCapture(e.pointerId);
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    const delta = dragStartX.current - e.clientX;
    dragMovedPx.current = Math.abs(delta);
    const maxScroll = scrollRef.current.scrollWidth / 2;
    const newPos = ((dragScrollStart.current + delta) % maxScroll + maxScroll) % maxScroll;
    scrollPos.current = newPos;
    scrollRef.current.scrollLeft = newPos;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Resume auto-scroll 1.5 s after the user releases
    resumeTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, 1500);
  };

  // Responsive grid: vary the aspect ratio for a more dynamic feel
  const aspectRatios = ['3/4', '4/5', '3/4', '4/3', '3/4', '4/5', '3/4'];

  // Duplicate images for seamless loop
  const displayImages = galleryCfg.autoSlide.enabled
    ? [...images, ...images]
    : images;

  return (
    <div className="w-full">
      {/* Auto-sliding horizontal gallery */}
      {galleryCfg.autoSlide.enabled ? (
        <div
          ref={scrollRef}
          className="gallery-autoslide"
          style={{ cursor: 'grab' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="gallery-autoslide-track">
            {displayImages.map((image, index) => {
              const depthOffset = galleryCfg.parallaxDepth.enabled
                ? (index % images.length) * galleryCfg.parallaxDepth.speedVariance
                : 0;
              return (
                <div
                  key={`slide-${index}`}
                  className="gallery-autoslide-item gallery-item-enhanced"
                  onClick={() => { if (dragMovedPx.current < 6) openLightbox(index % images.length); }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View photo: ${image.alt}`}
                  onKeyDown={e => e.key === 'Enter' && openLightbox(index % images.length)}
                  style={{
                    transform: depthOffset ? `translateY(${depthOffset * 20}px)` : undefined,
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {galleryCfg.shimmerOverlay && (
                    <div className="gallery-shimmer-overlay" />
                  )}
                  <div className="gallery-overlay">
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-medium"
                      style={{ background: 'rgba(30,50,100,0.6)', backdropFilter: 'blur(6px)' }}
                    >
                      <Expand size={12} />
                      View Photo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Static grid fallback */
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((image, index) => (
            <GalleryGridItem
              key={index}
              image={image}
              index={index}
              aspectRatio={aspectRatios[index % aspectRatios.length]}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-screen-lg w-full p-0 border-none"
          style={{ background: 'rgba(10,5,5,0.95)', borderRadius: '1rem' }}
        >
          <div className="relative w-full flex items-center justify-center min-h-[60vh]">
            <button
              className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X size={18} className="text-white" />
            </button>

            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={prev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>

            <div className="w-full flex justify-center p-4">
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
              />
            </div>

            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={next}
              aria-label="Next photo"
            >
              <ChevronRight size={22} className="text-white" />
            </button>

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
                    background: i === currentIndex ? '#A8C9E6' : 'rgba(255,255,255,0.3)',
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

/** Individual grid item with scroll-reveal */
const GalleryGridItem: React.FC<{
  image: GalleryImage;
  index: number;
  aspectRatio: string;
  onOpen: () => void;
}> = ({ image, index, aspectRatio, onOpen }) => {
  const { ref, style } = useScrollReveal<HTMLDivElement>({
    animation: 'scale-in',
    delay: staggerDelay(index),
  });

  return (
    <div
      ref={ref}
      className="gallery-item gallery-item-enhanced"
      style={{ ...style, aspectRatio }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${image.alt}`}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {ANIMATION_CONFIG.gallery.shimmerOverlay && (
        <div className="gallery-shimmer-overlay" />
      )}
      <div className="gallery-overlay">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-medium"
          style={{ background: 'rgba(30,50,100,0.6)', backdropFilter: 'blur(6px)' }}
        >
          <Expand size={12} />
          View Photo
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
