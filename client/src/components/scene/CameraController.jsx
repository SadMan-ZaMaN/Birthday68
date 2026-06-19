import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * CameraController — coordinates camera modes and targets:
 * - Orbit mode: standard R3F OrbitControls around the table
 * - Explore mode: WASD/Arrows walking around with table collisions and drag rotation
 * - Cinematic mode: smooth panning and looking at key focus targets
 */
export default function CameraController() {
  const { camera, gl } = useThree();
  
  const cameraMode = useStore(s => s.cameraMode);
  const cinematicTarget = useStore(s => s.cinematicTarget);

  const localPos = useRef(new THREE.Vector3(0, 1.6, 5.5)); // Start at human height
  const rotation = useRef({ yaw: 0, pitch: 0.0 });
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });

  // Key tracking
  const keys = useRef({ w: false, a: false, s: false, d: false });

  // Camera lookAt tracking target
  const currentLookAt = useRef(new THREE.Vector3(0, 1.1, 0));

  // ── Explore Mode Event Listeners ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (useStore.getState().cameraMode !== 'explore') return;
      const key = e.key.toLowerCase();
      if (key === 'w' || e.key === 'ArrowUp') keys.current.w = true;
      if (key === 's' || e.key === 'ArrowDown') keys.current.s = true;
      if (key === 'a' || e.key === 'ArrowLeft') keys.current.a = true;
      if (key === 'd' || e.key === 'ArrowRight') keys.current.d = true;
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || e.key === 'ArrowUp') keys.current.w = false;
      if (key === 's' || e.key === 'ArrowDown') keys.current.s = false;
      if (key === 'a' || e.key === 'ArrowLeft') keys.current.a = false;
      if (key === 'd' || e.key === 'ArrowRight') keys.current.d = false;
    };

    const handlePointerDown = (e) => {
      if (useStore.getState().cameraMode !== 'explore') return;
      isDragging.current = true;
      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current || useStore.getState().cameraMode !== 'explore') return;
      const dx = e.clientX - previousPointer.current.x;
      const dy = e.clientY - previousPointer.current.y;

      // Update looking angles (yaw and pitch)
      rotation.current.yaw -= dx * 0.0035;
      rotation.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.current.pitch - dy * 0.0035));

      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // ── Sync exploration start to current camera position ──
  useEffect(() => {
    if (cameraMode === 'explore') {
      localPos.current.copy(camera.position);
      localPos.current.y = 1.6; // Keep constant human height

      // Set initial yaw/pitch pointing towards table center
      const dir = new THREE.Vector3(0, 1.1, 0).sub(localPos.current).normalize();
      rotation.current.yaw = Math.atan2(dir.x, dir.z);
      rotation.current.pitch = Math.asin(dir.y);
    }
  }, [cameraMode, camera]);

  useFrame((state, delta) => {
    const mode = useStore.getState().cameraMode;

    if (mode === 'explore') {
      // 1. Calculate walking direction vectors
      const yaw = rotation.current.yaw;
      const pitch = rotation.current.pitch;

      const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
      // Right = forward × up (cross product in right-handed coordinate system)
      const right = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw)).normalize();

      const moveDir = new THREE.Vector3();
      if (keys.current.w) moveDir.add(forward);
      if (keys.current.s) moveDir.sub(forward);
      if (keys.current.d) moveDir.add(right);
      if (keys.current.a) moveDir.sub(right);

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        const speed = 4.0; // cozy walking pace
        localPos.current.addScaledVector(moveDir, speed * delta);

        // ── Room Collisions ──
        // Keep within café wood flooring (walls are at x=±10, z=±10)
        localPos.current.x = Math.max(-9.2, Math.min(9.2, localPos.current.x));
        localPos.current.z = Math.max(-9.2, Math.min(9.2, localPos.current.z));

        // ── Table Collision ──
        // Avoid clipping inside the cake table
        const distToTable = Math.sqrt(localPos.current.x * localPos.current.x + localPos.current.z * localPos.current.z);
        if (distToTable < 1.9) {
          const angle = Math.atan2(localPos.current.z, localPos.current.x);
          localPos.current.x = Math.cos(angle) * 1.9;
          localPos.current.z = Math.sin(angle) * 1.9;
        }
      }

      // 2. Set camera position and look point
      camera.position.copy(localPos.current);

      const lookTarget = new THREE.Vector3(
        localPos.current.x + Math.sin(yaw) * Math.cos(pitch),
        localPos.current.y + Math.sin(pitch),
        localPos.current.z + Math.cos(yaw) * Math.cos(pitch)
      );

      // Smoothly look at target
      currentLookAt.current.lerp(lookTarget, Math.min(delta * 15, 1.0));
      camera.lookAt(currentLookAt.current);
    } 
    
    else if (mode === 'cinematic') {
      // Predefined target focus parameters
      const targetCamPos = new THREE.Vector3();
      const targetCamLook = new THREE.Vector3();

      switch (cinematicTarget) {
        case 'cake':
          targetCamPos.set(0.65, 1.3, 0.75);
          targetCamLook.set(0.0, 1.12, 0.0);
          break;
        case 'decorations':
          targetCamPos.set(0.0, 2.5, -3.2);
          targetCamLook.set(0.0, 4.3, -9.8);
          break;
        case 'overview':
        default:
          targetCamPos.set(-7.2, 4.2, 7.2);
          targetCamLook.set(0.0, 1.2, 0.0);
          break;
      }

      // Smooth frame-rate independent camera panning
      camera.position.lerp(targetCamPos, Math.min(delta * 3.5, 1.0));
      currentLookAt.current.lerp(targetCamLook, Math.min(delta * 3.5, 1.0));
      camera.lookAt(currentLookAt.current);
    }
  });

  return (
    <>
      {cameraMode === 'orbit' && (
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          target={[0, 1.1, 0]}
          minDistance={1.8}
          maxDistance={13.5}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.04}
          makeDefault
        />
      )}
    </>
  );
}
