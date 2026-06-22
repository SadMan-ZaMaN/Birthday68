import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { PHOTOS } from '../../config/photos';
import styles from './GalleryModal.module.css';

export default function GalleryModal() {
  const galleryIndex = useStore(s => s.galleryIndex);
  const closeGallery = useStore(s => s.closeGallery);
  const setGalleryIndex = useStore(s => s.setGalleryIndex);
  const [imgError, setImgError] = useState(false);

  const photo = PHOTOS[galleryIndex] || PHOTOS[0];
  const total = PHOTOS.length;

  const prev = useCallback(() => {
    setImgError(false);
    setGalleryIndex((galleryIndex - 1 + total) % total);
  }, [galleryIndex, total, setGalleryIndex]);

  const next = useCallback(() => {
    setImgError(false);
    setGalleryIndex((galleryIndex + 1) % total);
  }, [galleryIndex, total, setGalleryIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeGallery();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, closeGallery]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label="Photo Gallery"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && closeGallery()}
    >
      <div className={styles.modal}>
        {/* Close */}
        <button
          id="gallery-close-btn"
          className={styles.closeBtn}
          onClick={closeGallery}
          aria-label="Close gallery"
        >
          ✕
        </button>

        {/* Navigation */}
        <button
          id="gallery-prev-btn"
          className={`${styles.navBtn} ${styles.prevBtn}`}
          onClick={prev}
          aria-label="Previous photo"
        >
          ‹
        </button>

        {/* Image */}
        <div className={styles.imageWrapper}>
          <div className={styles.frame}>
            <img
              key={photo.id}
              src={imgError ? photo.placeholder : photo.src}
              alt={photo.caption}
              className={styles.image}
              onError={() => setImgError(true)}
              loading="eager"
            />
          </div>
        </div>

        <button
          id="gallery-next-btn"
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={next}
          aria-label="Next photo"
        >
          ›
        </button>

        {/* Dots */}
        <div className={styles.dots} role="tablist" aria-label="Photo navigation">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              id={`gallery-dot-${i}`}
              className={`${styles.dot} ${i === galleryIndex ? styles.dotActive : ''}`}
              onClick={() => { setImgError(false); setGalleryIndex(i); }}
              role="tab"
              aria-selected={i === galleryIndex}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>

        <div className={styles.counter}>{galleryIndex + 1} / {total}</div>
      </div>
    </div>
  );
}
