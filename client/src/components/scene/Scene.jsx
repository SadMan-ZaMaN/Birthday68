import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import useStore from '../../store/useStore';

// Scene components
import CafeEnvironment from './CafeEnvironment';
import BirthdayTable from './BirthdayTable';
import Balloons from './Balloons';
import PhotoFrames from './PhotoFrames';
import ParisWindow from './ParisWindow';
import CameraController from './CameraController';
import AudioManager from './AudioManager';
import Particles from './Particles';

export default function Scene() {
  const setPhase = useStore(s => s.setPhase);

  useEffect(() => {
    // Ensure we're in scene phase
    const t = setTimeout(() => setPhase('scene'), 100);
    return () => clearTimeout(t);
  }, [setPhase]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <Canvas
        camera={{ position: [0, 4, 8], fov: 60, near: 0.1, far: 200 }}
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Performance adaptation */}
        <PerformanceMonitor
          onIncline={() => useStore.getState().setPhase('scene')}
          onDecline={() => {}}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </PerformanceMonitor>

        {/* Suspense fallback (invisible — LoadingScreen covers this) */}
        <Suspense fallback={null}>
          {/* ── Lighting ── */}
          <SceneLighting />

          {/* ── Environment ── */}
          <CafeEnvironment />
          <BirthdayTable />
          <Balloons />
          <PhotoFrames />
          <ParisWindow />
          <Particles />

          {/* ── Camera ── */}
          <CameraController />

          {/* ── Audio ── */}
          <AudioManager />

          {/* ── Post-processing ── */}
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.3} darkness={0.6} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Scene Lighting — warm Parisian café atmosphere
 */
function SceneLighting() {
  const candlesLit = useStore(s => s.candlesLit);

  return (
    <>
      {/* Ambient — very warm and dim for atmosphere */}
      <ambientLight intensity={0.25} color="#FFA040" />

      {/* Main directional — soft moonlight from window */}
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.4}
        color="#B8D4FF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Warm ceiling lamps */}
      <pointLight position={[-3, 4, -3]} intensity={1.5} color="#FF9F45" distance={10} decay={2} castShadow />
      <pointLight position={[ 3, 4, -3]} intensity={1.5} color="#FF9F45" distance={10} decay={2} castShadow />
      <pointLight position={[ 0, 4,  3]} intensity={1.2} color="#FFA940" distance={10} decay={2} />

      {/* Candle glow on table */}
      {candlesLit && (
        <>
          <pointLight position={[-0.3, 1.1, 0]} intensity={0.8} color="#FF6B1A" distance={4} decay={2} />
          <pointLight position={[ 0.3, 1.1, 0]} intensity={0.8} color="#FF8C42" distance={4} decay={2} />
          <pointLight position={[ 0,   1.1, 0.3]} intensity={0.6} color="#FFAA44" distance={3} decay={2} />
        </>
      )}

      {/* Window fill — cool blue from street */}
      <pointLight position={[8, 2, 0]} intensity={0.5} color="#6699FF" distance={15} decay={2} />
    </>
  );
}
