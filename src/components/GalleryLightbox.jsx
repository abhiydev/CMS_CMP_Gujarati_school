import { AnimatePresence, motion } from 'framer-motion';
import SafeImage from './SafeImage';

export default function GalleryLightbox({ src, onClose }) {
  return (
    <AnimatePresence>
      {src ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-soft"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close gallery preview"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 min-h-[44px] rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white"
            >
              Close
            </button>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SafeImage src={src} alt="Gallery preview" className="h-[70vh] w-full object-cover" />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
