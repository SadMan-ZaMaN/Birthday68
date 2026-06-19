import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import { PHOTOS } from '../../config/photos';
import styles from './CelebrateOverlay.module.css';

// Generate confetti pieces
const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  color: ['#FFD166','#FF6B9D','#F4A261','#56D8CD','#5B86E5','#B06AB3','#4ade80'][i % 7],
  size: `${6 + Math.random() * 10}px`,
  delay: `${Math.random() * 3}s`,
  duration: `${3 + Math.random() * 4}s`,
  rotation: `${Math.random() * 360}deg`,
}));

const FIREWORKS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  top: `${10 + Math.random() * 50}%`,
  color: ['#FFD166','#FF6B9D','#56D8CD','#F4A261'][i % 4],
  delay: `${Math.random() * 2}s`,
}));

export default function CelebrateOverlay() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'slides' | 'message'
  const setCelebrateActive = useStore(s => s.setCelebrateActive);

  // Phase progression
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('slides'), 2000);
    const t2 = setTimeout(() => setPhase('message'), 2000 + PHOTOS.length * 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (phase !== 'slides') return;
    const interval = setInterval(() => {
      setSlideIndex(i => (i + 1) % PHOTOS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase]);

  const handleClose = () => {
    setCelebrateActive(false);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-label="Birthday Celebration" aria-modal="true">
      {/* Confetti */}
      <div className={styles.confettiLayer} aria-hidden="true">
        {CONFETTI.map(c => (
          <div
            key={c.id}
            className={styles.confetti}
            style={{
              left: c.left,
              width: c.size,
              height: c.size,
              background: c.color,
              animationDelay: c.delay,
              animationDuration: c.duration,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      {/* Fireworks */}
      <div className={styles.fireworksLayer} aria-hidden="true">
        {FIREWORKS.map(f => (
          <div
            key={f.id}
            className={styles.firework}
            style={{
              left: f.left,
              top: f.top,
              background: `radial-gradient(circle, ${f.color} 0%, transparent 70%)`,
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>

      {/* INTRO PHASE */}
      {phase === 'intro' && (
        <div className={styles.intro}>
          <div className={styles.introEmoji}>🎊</div>
          <h2 className={styles.introTitle}>Surprise!</h2>
          <p className={styles.introSub}>A special moment, just for you…</p>
        </div>
      )}

      {/* SLIDESHOW PHASE */}
      {phase === 'slides' && (
        <div className={styles.slideshow}>
          <div className={styles.projectorFrame}>
            <img
              key={slideIndex}
              src={PHOTOS[slideIndex].src}
              alt={PHOTOS[slideIndex].caption}
              className={styles.slideImage}
              onError={e => { e.target.src = PHOTOS[slideIndex].placeholder; }}
            />
            <div className={styles.slideCaption}>{PHOTOS[slideIndex].caption}</div>
          </div>
          <div className={styles.slideDots}>
            {PHOTOS.map((_, i) => (
              <div key={i} className={`${styles.slideDot} ${i === slideIndex ? styles.slideDotActive : ''}`} />
            ))}
          </div>
        </div>
      )}

      {/* FINAL MESSAGE PHASE */}
      {phase === 'message' && (
        <div className={styles.message}>
          <div className={styles.messageEmoji}>🎂</div>
          <h2 className={styles.messageTitle}>Happy Birthday!</h2>
          <p className={styles.messageText}>
            Wishing you a day filled with joy, laughter, and all things beautiful.
            <br />
            <em>With love, always. 💛</em>
          </p>
          <div className={styles.messageEmojis} aria-hidden="true">
            {['🥂','🌹','✨','🎈','💛','🗼','🎊','🌟'].map((e, i) => (
              <span key={i} className={styles.floatingEmoji} style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
            ))}
          </div>
          <button
            id="celebrate-close-btn"
            className="btn btn-gold"
            onClick={handleClose}
            style={{ marginTop: 32 }}
          >
            💌 Thank You!
          </button>
        </div>
      )}
    </div>
  );
}
