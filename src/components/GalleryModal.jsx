import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SafeImage from './SafeImage';
import ThumbnailStrip from './ThumbnailStrip';

export default function GalleryModal({ album, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = album?.images || [];

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative h-full w-full max-w-7xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 min-h-[44px] rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
          >
            Close
          </button>

          {/* Album title */}
          {album.title && (
            <div className="absolute left-4 top-4 z-20">
              <h2 className="text-lg font-semibold text-white drop-shadow-lg">{album.title}</h2>
              {album.description && (
                <p className="mt-1 text-sm text-white/80 drop-shadow-md">{album.description}</p>
              )}
            </div>
          )}

          {/* Image counter */}
          <div className="absolute right-4 top-16 z-20 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-slate-900 backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image */}
          <div className="flex h-full flex-col items-center justify-center">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[70vh] w-full"
            >
              <SafeImage
                src={currentImage}
                alt={`${album.title} - Image ${currentIndex + 1}`}
                className="h-full w-full object-contain"
              />
            </motion.div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] rounded-full bg-white/90 p-3 text-slate-900 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] rounded-full bg-white/90 p-3 text-slate-900 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4">
              <ThumbnailStrip
                images={images}
                currentIndex={currentIndex}
                onSelect={goToImage}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
