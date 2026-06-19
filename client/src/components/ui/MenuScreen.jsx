import React, { useState, useCallback, useMemo } from 'react';
import useStore from '../../store/useStore';
import SVGCake from './SVGCake';
import styles from './MenuScreen.module.css';

// Generate random sparkle positions once
const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${3 + Math.random() * 9}px`,
  delay: `${Math.random() * 5}s`,
  duration: `${2 + Math.random() * 3}s`,
}));

/**
 * The birthday person's name — used for the interactive detection feature.
 * When any prefix of this name is typed (case-insensitive), a special
 * notification appears recognizing the birthday person.
 */
const BIRTHDAY_NAME = 'mahdiat tarannum';

export default function MenuScreen() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const setPhase = useStore(s => s.setPhase);
  const setLocalUser = useStore(s => s.setLocalUser);
  const showNotification = useStore(s => s.showNotification);

  // ── Birthday name detection ──
  // Check if what the user is typing is a prefix of "Mahdiat Tarannum".
  // We require at least 3 characters to avoid false positives on short strings.
  const isTypingBirthdayName = useMemo(() => {
    const typed = username.trim().toLowerCase();
    if (typed.length < 3) return false;
    return BIRTHDAY_NAME.startsWith(typed) || typed === BIRTHDAY_NAME;
  }, [username]);

  const handleChange = (e) => {
    setUsername(e.target.value);
    setError(''); // clear errors on typing
  };

  const handleJoin = useCallback(async () => {
    let name = username.trim();
    if (!name) { setError('Please enter your name to join 💛'); return; }

    // Check if the user started writing 'mahdiat tarannum' but didn't complete it
    const lowerName = name.toLowerCase();
    if (lowerName.length >= 3 && BIRTHDAY_NAME.startsWith(lowerName) && lowerName !== BIRTHDAY_NAME) {
      name = 'Tara';
      setUsername('Tara');
    }

    if (name.length < 2) { setError('Name must be at least 2 characters'); return; }
    if (name.length > 30) { setError('Name too long (max 30 characters)'); return; }

    setJoining(true);
    setError('');

    // Set local user and transition to scene
    const AVATAR_COLORS = [
      '#FF6B9D', '#FF8C42', '#FFC947', '#A8E063',
      '#56D8CD', '#5B86E5', '#B06AB3', '#FF4E50',
    ];
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    setLocalUser({ username: name, color });

    // Start loading, then show scene
    setPhase('loading');

    // Give assets time to load, then show scene
    setTimeout(() => {
      setPhase('scene');
      showNotification(`Welcome to the Café, ${name}! 🥂`);
    }, 2500);
  }, [username, setPhase, setLocalUser, showNotification]);

  const handleKey = (e) => e.key === 'Enter' && handleJoin();

  return (
    <div className={styles.wrapper}>
      {/* Animated sparkles background */}
      <div className={styles.sparkles} aria-hidden="true">
        {SPARKLES.map(s => (
          <div
            key={s.id}
            className={styles.sparkle}
            style={{
              left: s.left, top: s.top,
              width: s.size, height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      {/* Hero card */}
      <div className={styles.card}>
        <SVGCake />

        <div className={styles.subtitle}>Happiest Birthday</div>
        <h1 className={styles.title}>Mahdiat Tarannum</h1>

        {/* Decorative divider */}
        <hr className={styles.divider} />

        {/* Tagline */}
        <p className={styles.tagline}>
          Step into a magical virtual café and celebrate — blow candles, cut the cake, pop balloons, and more!
        </p>

        <div className={styles.form}>
          <label className={styles.label} htmlFor="username-input">
            Your Name
          </label>
          <input
            id="username-input"
            className={`${styles.input} ${isTypingBirthdayName ? styles.inputMatch : ''}`}
            type="text"
            placeholder="Enter your name…"
            value={username}
            onChange={handleChange}
            onKeyDown={handleKey}
            maxLength={30}
            autoFocus
            autoComplete="off"
          />

          {/* Birthday name detection notification */}
          {isTypingBirthdayName && (
            <div className={styles.birthdayNotice} role="status">
              🎉 It&apos;s <strong>Mahdiat Tarannum</strong> obviously right? It&apos;s your birthday! 🎂
            </div>
          )}

          {error && <div className={styles.error} role="alert">{error}</div>}

          <button
            id="join-btn"
            className={`btn btn-gold ${styles.joinBtn}`}
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Entering the Café…
              </>
            ) : (
              <>
                <span>🥂</span>
                Click to Enter
              </>
            )}
          </button>
        </div>

        <div className={styles.features}>
          {['🎈 Balloons', '🎂 Birthday Cake', '🖼️ Photo Frames', '💌 Albums', '🎊 Surprise Sequence'].map(f => (
            <span key={f} className={styles.feature}>{f}</span>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        Made with love 💛 · Three.js + React
      </div>
    </div>
  );
}
