import React from 'react';
import SVGCake from './SVGCake';
import styles from './LoadingScreen.module.css';

const MESSAGES = [
  'Setting the table…',
  'Lighting the candles…',
  'Chilling the champagne…',
  'Hanging the decorations…',
  'Waiting for the soufflé…',
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.center}>
        <SVGCake />
        <div className={styles.title}>Entrons au Café…</div>
        <div className={styles.bar}>
          <div className={styles.barFill} />
        </div>
        <div className={styles.message}>{MESSAGES[msgIndex]}</div>
      </div>
    </div>
  );
}
