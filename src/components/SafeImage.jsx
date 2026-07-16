import { useState } from 'react';

export default function SafeImage({
  src,
  alt,
  className = '',
  lazy = false,
  priority = false,
  fallbackClassName = 'bg-slate-200',
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={`flex items-center justify-center text-sm text-slate-500 ${fallbackClassName} ${className}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      loading={priority ? 'eager' : lazy ? 'lazy' : undefined}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}
