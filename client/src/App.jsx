import React, { useEffect, Suspense, lazy } from 'react';
import useStore from './store/useStore';
import MenuScreen from './components/ui/MenuScreen';
import LoadingScreen from './components/ui/LoadingScreen';
import HUD from './components/ui/HUD';
import GuestBook from './components/ui/GuestBook';
import GalleryModal from './components/ui/GalleryModal';
import Notification from './components/ui/Notification';

// Lazy-load the heavy 3D scene
const Scene = lazy(() => import('./components/scene/Scene'));

export default function App() {
  const phase = useStore(s => s.phase);
  const activePanel = useStore(s => s.activePanel);
  const galleryOpen = useStore(s => s.galleryOpen);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* ── Main Menu ─── */}
      {phase === 'menu' && <MenuScreen />}

      {/* ── Loading ─── */}
      {phase === 'loading' && <LoadingScreen />}

      {/* ── 3D Scene ─── */}
      {(phase === 'scene' || phase === 'loading') && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}

      {/* ── HUD (overlaid on scene) ─── */}
      {phase === 'scene' && (
        <>
          <HUD />
          <Notification />
          {activePanel === 'guestbook' && <GuestBook />}
          {galleryOpen && <GalleryModal />}
        </>
      )}
    </div>
  );
}
