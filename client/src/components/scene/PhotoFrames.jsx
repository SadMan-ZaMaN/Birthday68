import React, { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import useStore from '../../store/useStore';
import { PHOTOS, FRAME_POSITIONS } from '../../config/photos';

/**
 * PhotoFrames — decorative frames on café walls.
 * Click a frame to smoothly zoom the camera toward it and open the gallery.
 */
export default function PhotoFrames() {
  const { camera } = useThree();
  const openGallery = useStore(s => s.openGallery);

  const handleFrameClick = (index, position, normal) => {
    const [fx, fy, fz] = position;
    // Calculate a view position in front of the frame
    const viewOffset = 2.5;
    const targetX = fx + (normal[0] * viewOffset);
    const targetZ = fz + (normal[2] * viewOffset);

    // Smooth camera zoom
    gsap.to(camera.position, {
      x: targetX, y: fy, z: targetZ,
      duration: 1.2,
      ease: 'power2.inOut',
    });
    gsap.to(camera, {
      fov: 35,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => openGallery(index),
    });
  };

  return (
    <group name="photo-frames">
      {FRAME_POSITIONS.map((posRot, i) => {
        const [x, y, z, rotY] = posRot;
        const photo = PHOTOS[i % PHOTOS.length];
        // Wall normal (direction camera should be from the frame)
        const normal = [
          Math.round(Math.sin(rotY + Math.PI)),
          0,
          Math.round(Math.cos(rotY + Math.PI)),
        ];

        return (
          <PhotoFrame
            key={i}
            index={i}
            position={[x, y, z]}
            rotationY={rotY}
            photo={photo}
            normal={normal}
            onClick={() => handleFrameClick(i, [x, y, z], normal)}
          />
        );
      })}
    </group>
  );
}

function PhotoFrame({ position, rotationY, photo, onClick, index }) {
  const [hovered, setHovered] = useState(false);

  const frameW = 0.7;
  const frameH = 0.55;
  const frameDepth = 0.04;
  const borderW = 0.05;

  const frameMat = new THREE.MeshStandardMaterial({
    color: hovered ? '#E8C547' : '#B8860B',
    roughness: 0.3,
    metalness: 0.7,
  });

  const matMat = new THREE.MeshStandardMaterial({
    color: '#F5F0E8',
    roughness: 0.9,
  });

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      name={`frame-${index}`}
    >
      {/* Outer frame */}
      <mesh castShadow>
        <boxGeometry args={[frameW, frameH, frameDepth]} />
        <meshStandardMaterial
          color={hovered ? '#E8C547' : '#B8860B'}
          roughness={0.3}
          metalness={0.7}
          emissive={hovered ? '#E8C547' : '#8B6914'}
          emissiveIntensity={hovered ? 0.3 : 0.05}
        />
      </mesh>

      {/* Mat board */}
      <mesh position={[0, 0, frameDepth / 2 + 0.002]}>
        <boxGeometry args={[frameW - borderW * 2, frameH - borderW * 2, 0.01]} />
        <primitive object={matMat} attach="material" />
      </mesh>

      {/* Photo image plane */}
      <mesh position={[0, 0, frameDepth / 2 + 0.015]}>
        <planeGeometry args={[frameW - borderW * 3, frameH - borderW * 3]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.3}
          // In production: use useTexture(photo.src) here
        />
      </mesh>

      {/* Click hint */}
      {hovered && (
        <Html position={[0, -frameH / 2 - 0.1, 0.1]} center distanceFactor={5}>
          <div style={{
            padding: '4px 10px',
            background: 'rgba(13,7,33,0.85)',
            border: '1px solid rgba(255,209,102,0.4)',
            borderRadius: '20px',
            color: '#FFD166',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            🖼️ Click to view — {photo?.caption}
          </div>
        </Html>
      )}
    </group>
  );
}
