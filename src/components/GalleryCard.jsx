import { motion } from 'framer-motion';
import SafeImage from './SafeImage';

export default function GalleryCard({ album, onViewAlbum }) {
  const { title, description, coverImage, images } = album;
  const imageCount = images?.length || 0;

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[2rem] bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <SafeImage
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          lazy
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Image count badge */}
        {imageCount > 1 && (
          <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur-sm">
            {imageCount} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {description}
          </p>
        )}

        <button
          type="button"
          onClick={() => onViewAlbum(album)}
          aria-label={`View ${title} photo album`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View More
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}
