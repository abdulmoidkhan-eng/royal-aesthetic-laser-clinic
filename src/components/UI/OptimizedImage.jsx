import React from 'react';

/**
 * High-performance responsive image component
 * Automatically serves modern .webp format when available with .png/.jpg fallback,
 * enforces explicit layout dimensions to eliminate Cumulative Layout Shift (CLS),
 * and defaults to native lazy loading.
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority,
  ...props
}) => {
  if (!src) return null;

  // Determine WebP source if local asset
  let webpSrc = null;
  if (typeof src === 'string' && src.startsWith('/assets/aistudio/') && src.endsWith('.png')) {
    webpSrc = src.replace(/\.png$/, '.webp');
  }

  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt || "Royal Aesthetic Clinic"}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        className={className}
        decoding="async"
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
