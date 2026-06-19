import React from 'react';
import useStore from '../../store/useStore';
import styles from './Notification.module.css';

export default function Notification() {
  const notification = useStore(s => s.notification);
  if (!notification) return null;

  return (
    <div className={styles.notification} role="status" aria-live="polite">
      {notification}
    </div>
  );
}
