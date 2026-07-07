import { motion } from 'framer-motion';
import SafeImage from './SafeImage';

export default function ThumbnailStrip({ images, currentIndex, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {images.map((image, index) => (
        <motion.button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={`relative flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
            index === currentIndex
              ? 'border-indigo-500 ring-2 ring-indigo-500/50'
              : 'border-transparent hover:border-slate-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeImage
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="h-20 w-20 object-cover"
          />
          {index === currentIndex && (
            <div className="absolute inset-0 bg-indigo-500/20" />
          )}
        </motion.button>
      ))}
    </div>
  );
}
