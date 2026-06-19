import React, { useState, useRef, useEffect } from 'react';
import useStore from '../../store/useStore';
import styles from './GuestBook.module.css';

export default function GuestBook() {
  const messages    = useStore(s => s.messages);
  const localUser   = useStore(s => s.localUser);
  const closePanel  = useStore(s => s.closePanel);
  const addMessage  = useStore(s => s.addMessage);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  // Auto-scroll to top (newest messages first)
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [messages]);

  const handleSubmit = () => {
    const msg = text.trim();
    if (!msg || msg.length < 2) return;
    if (msg.length > 500) return;
    setSending(true);

    addMessage({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      username: localUser?.username || 'Guest',
      message: msg,
      color: localUser?.color || '#FFD166',
      timestamp: new Date().toISOString(),
    });

    setText('');
    setTimeout(() => setSending(false), 500);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-label="Guest Book" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span aria-hidden="true">💌</span>
            <div>
              <h2 className={styles.title}>Guest Book</h2>
              <div className={styles.subtitle}>Leave your birthday wishes</div>
            </div>
          </div>
          <button
            id="guestbook-close-btn"
            className="btn btn-glass"
            onClick={closePanel}
            aria-label="Close guest book"
          >
            ✕
          </button>
        </div>

        {/* Message composer */}
        <div className={styles.composer}>
          {localUser && (
            <div className={styles.composerUser}>
              <span
                className={styles.dot}
                style={{ background: localUser.color }}
                aria-hidden="true"
              />
              Writing as <strong>{localUser.username}</strong>
            </div>
          )}
          <textarea
            id="guestbook-textarea"
            className={styles.textarea}
            placeholder="Write a birthday message… 🎂"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            maxLength={500}
            rows={3}
          />
          <div className={styles.composerFooter}>
            <span className={styles.charCount}>{text.length}/500</span>
            <button
              id="guestbook-submit-btn"
              className="btn btn-gold"
              onClick={handleSubmit}
              disabled={sending || text.trim().length < 2}
            >
              {sending ? '✓ Sent!' : '✉️ Send Wish'}
            </button>
          </div>
        </div>

        {/* Message list */}
        <div className={styles.list} ref={listRef}>
          {messages.length === 0 ? (
            <div className={styles.empty}>
              <span aria-hidden="true">💛</span>
              <p>Be the first to leave a birthday wish!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg.id || i} className={styles.message}>
                <div className={styles.msgHeader}>
                  <span
                    className={styles.dot}
                    style={{ background: msg.color || '#FFD166' }}
                    aria-hidden="true"
                  />
                  <span className={styles.msgName}>{msg.username}</span>
                  <span className={styles.msgTime}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={styles.msgText}>{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
