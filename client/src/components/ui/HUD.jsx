import React from 'react';
import useStore from '../../store/useStore';
import styles from './HUD.module.css';

export default function HUD() {
  const localUser       = useStore(s => s.localUser);
  const candlesLit      = useStore(s => s.candlesLit);
  const cakeCut         = useStore(s => s.cakeCut);
  const celebrateActive = useStore(s => s.celebrateActive);
  const cameraMode      = useStore(s => s.cameraMode);
  const setCameraMode   = useStore(s => s.setCameraMode);
  const setCinematicTarget = useStore(s => s.setCinematicTarget);
  const setActivePanel  = useStore(s => s.setActivePanel);
  const audioEnabled    = useStore(s => s.audioEnabled);
  const toggleAudio     = useStore(s => s.toggleAudio);
  const setCandlesLit   = useStore(s => s.setCandlesLit);
  const setCakeCut      = useStore(s => s.setCakeCut);
  const setCelebrateActive = useStore(s => s.setCelebrateActive);
  const showNotification = useStore(s => s.showNotification);

  const handleBlowCandles = () => {
    setCandlesLit(false);
    showNotification('You blew out the candles! 🕯️');
  };

  const handleRelightCandles = () => {
    setCandlesLit(true);
    showNotification('Candles relit! ✨');
  };

  const handleCutCake = () => {
    setCakeCut(true);
    showNotification('You cut the cake! 🎂');
  };

  const handleResetCake = () => {
    setCakeCut(false);
    showNotification('Cake reset — ready to cut again! 🎂');
  };

  const handleCelebrate = () => {
    setCelebrateActive(true);
    showNotification('✨ Surprise Celebration! ✨');
  };

  const handleResetCelebrate = () => {
    setCelebrateActive(false);
  };

  const handleCinematic = (target) => {
    setCameraMode('cinematic');
    setCinematicTarget(target);
  };

  return (
    <div className={styles.hud} role="region" aria-label="Controls">
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.roomInfo}>
          <span className={styles.dot} aria-hidden="true" />
          <span>Welcome to the Café</span>
        </div>
        {localUser && (
          <div className={styles.userBadge} style={{ borderColor: localUser.color + '80' }}>
            <span
              className={styles.userDot}
              style={{ background: localUser.color }}
              aria-hidden="true"
            />
            {localUser.username}
          </div>
        )}
        <button
          id="audio-toggle-btn"
          className="btn btn-glass"
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute audio' : 'Enable audio'}
          aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* ── Action buttons ── */}
      <div className={styles.actions}>
        {/* Cake interactions */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>🎂 Cake</div>
          <button
            id="blow-candles-btn"
            className="btn btn-glass"
            onClick={handleBlowCandles}
            disabled={!candlesLit}
            title="Blow out the candles"
          >
            🕯️ Blow Candles
          </button>
          <button
            id="relight-candles-btn"
            className="btn btn-glass"
            onClick={handleRelightCandles}
            disabled={candlesLit}
            title="Relight the candles"
          >
            ✨ Relight
          </button>
          <button
            id="cut-cake-btn"
            className="btn btn-glass"
            onClick={handleCutCake}
            disabled={cakeCut}
            title="Cut the birthday cake"
          >
            🔪 Cut Cake
          </button>
          <button
            id="reset-cake-btn"
            className="btn btn-glass"
            onClick={handleResetCake}
            disabled={!cakeCut}
            title="Reset the cake to cut again"
          >
            🔄 Reset Cake
          </button>
        </div>

        {/* Camera modes */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>📷 Camera</div>
          <button
            id="camera-orbit-btn"
            className={`btn btn-glass ${cameraMode === 'orbit' ? styles.active : ''}`}
            onClick={() => { setCameraMode('orbit'); setCinematicTarget(null); }}
          >
            🔄 Orbit
          </button>
          <button
            id="camera-explore-btn"
            className={`btn btn-glass ${cameraMode === 'explore' ? styles.active : ''}`}
            onClick={() => setCameraMode('explore')}
          >
            🚶 Explore
          </button>
          <div className={styles.cinematic}>
            <div className={styles.groupLabel} style={{ marginTop: 4, fontSize: '0.7rem' }}>Cinematic Views</div>
            <button id="cam-cake-btn" className="btn btn-glass" onClick={() => handleCinematic('cake')}>🎂 Cake</button>
            <button id="cam-overview-btn" className="btn btn-glass" onClick={() => handleCinematic('overview')}>🌃 Overview</button>
          </div>
        </div>

        {/* UI Panels */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>✨ Features</div>
          <button
            id="guestbook-btn"
            className="btn btn-glass"
            onClick={() => setActivePanel('guestbook')}
          >
            💌 Guest Book
          </button>
          <button
            id="gallery-btn"
            className="btn btn-glass"
            onClick={() => useStore.getState().openGallery(0)}
          >
            🖼️ Gallery
          </button>
        </div>

        {/* Celebrate */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>🎊 Surprise</div>
          {!celebrateActive ? (
            <button
              id="celebrate-btn"
              className="btn btn-gold"
              onClick={handleCelebrate}
              title="Trigger the celebration sequence"
            >
              🎊 Celebrate!
            </button>
          ) : (
            <button
              id="reset-celebrate-btn"
              className="btn btn-glass"
              onClick={handleResetCelebrate}
            >
              🔄 Reset Celebration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
