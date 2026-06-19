import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * RemoteAvatars — container for all online guest avatars.
 * Listens to the Zustand store's remote `users` map and renders a smooth 3D figure for each.
 */
export default function RemoteAvatars() {
  const users = useStore(s => s.users);

  return (
    <group name="remote-avatars">
      {Object.values(users).map(user => (
        <RemoteAvatar key={user.socketId} user={user} />
      ))}
    </group>
  );
}

/**
 * Individual Remote Avatar.
 * Interpolates positions and rotations smoothly to eliminate jitter from network ticks.
 * Features a cute stylized French-café-goer model with a colored beret and bobbing hands.
 */
function RemoteAvatar({ user }) {
  const groupRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  // Shared cozy materials
  const materials = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({ color: '#FCD5B5', roughness: 0.6 }),
    shirt: new THREE.MeshStandardMaterial({ color: '#F3F4F6', roughness: 0.8 }), // stripe-ready base
    pants: new THREE.MeshStandardMaterial({ color: '#1F2937', roughness: 0.7 }),
    shoes: new THREE.MeshStandardMaterial({ color: '#1E1B18', roughness: 0.8 }),
    beret: new THREE.MeshStandardMaterial({ color: user.color || '#FFD166', roughness: 0.7 }),
    stripes: new THREE.MeshStandardMaterial({ color: '#1F2937', roughness: 0.8 }), // dark stripes on shirt
  }), [user.color]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Smoothly interpolate position (lerp)
    const px = user.position?.x ?? 0;
    const py = user.position?.y ?? 0;
    const pz = user.position?.z ?? 0;
    targetPos.set(px, py, pz);

    const distanceSq = groupRef.current.position.distanceToSquared(targetPos);
    const isMoving = distanceSq > 0.005;

    // Apply linear interpolation
    groupRef.current.position.lerp(targetPos, Math.min(delta * 12, 1.0));

    // 2. Smoothly interpolate rotation (lerp angle to prevent 360-wrap jumps)
    const targetRotY = user.rotation?.y ?? 0;
    let diff = targetRotY - groupRef.current.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    groupRef.current.rotation.y += diff * Math.min(delta * 12, 1.0);

    // 3. Dynamic bobbing hands animation
    if (leftHandRef.current && rightHandRef.current) {
      const t = state.clock.elapsedTime;
      const bobSpeed = isMoving ? 15 : 3.5;
      const bobAmp = isMoving ? 0.08 : 0.025;
      
      leftHandRef.current.position.y = 0.8 + Math.sin(t * bobSpeed) * bobAmp;
      leftHandRef.current.position.x = 0.35 + (isMoving ? Math.sin(t * bobSpeed * 0.5) * 0.04 : 0);
      
      rightHandRef.current.position.y = 0.8 + Math.cos(t * bobSpeed) * bobAmp;
      rightHandRef.current.position.x = -0.35 - (isMoving ? Math.sin(t * bobSpeed * 0.5) * 0.04 : 0);
    }
  });

  return (
    <group ref={groupRef} position={[user.position?.x ?? 0, user.position?.y ?? 0, user.position?.z ?? 0]}>
      {/* ── Cute Stylized Body ── */}
      {/* Shoes */}
      <mesh position={[0.1, 0.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.14]} />
        <primitive object={materials.shoes} attach="material" />
      </mesh>
      <mesh position={[-0.1, 0.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.14]} />
        <primitive object={materials.shoes} attach="material" />
      </mesh>

      {/* Pants / Legs */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 10]} />
        <primitive object={materials.pants} attach="material" />
      </mesh>

      {/* Parisian striped shirt (Marinière) */}
      <group position={[0, 0.85, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.7, 12]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        {/* Navy stripes */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.222, 0.222, 0.03, 12]} />
          <primitive object={materials.stripes} attach="material" />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.218, 0.218, 0.03, 12]} />
          <primitive object={materials.stripes} attach="material" />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.212, 0.212, 0.03, 12]} />
          <primitive object={materials.stripes} attach="material" />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>

      {/* ── French Beret ── */}
      <group position={[0, 1.5, -0.02]} rotation={[0.1, 0, -0.18]}>
        {/* Main flat cap */}
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.2, 0.06, 16]} />
          <primitive object={materials.beret} attach="material" />
        </mesh>
        {/* Puffed upper part */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.23, 16, 8]} scale={[1, 0.2, 1]} />
          <primitive object={materials.beret} attach="material" />
        </mesh>
        {/* Stem (antenna/plume) */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.05, 4]} />
          <primitive object={materials.beret} attach="material" />
        </mesh>
      </group>

      {/* ── Bobbing Hands ── */}
      <mesh ref={leftHandRef} position={[0.35, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>
      <mesh ref={rightHandRef} position={[-0.35, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>

      {/* ── Soft shadow circle below player ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} blending={THREE.MultiplyBlending} />
      </mesh>

      {/* ── Glassmorphic 3D Name Tag ── */}
      <Html position={[0, 1.85, 0]} center distanceFactor={8}>
        <div style={{
          background: 'rgba(23, 15, 10, 0.78)',
          backdropFilter: 'blur(6px)',
          border: `1.5px solid ${user.color || '#FFD166'}`,
          boxShadow: `0 4px 15px rgba(0, 0, 0, 0.4), 0 0 10px ${(user.color || '#FFD166')}22`,
          color: '#FFF6E0',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '11px',
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.3s ease',
        }}>
          {/* Status dot */}
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: user.color || '#FFD166',
            boxShadow: `0 0 8px ${user.color || '#FFD166'}`,
          }} />
          {user.username}
        </div>
      </Html>
    </group>
  );
}
