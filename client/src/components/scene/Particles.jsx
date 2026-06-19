import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * Particles — ambient floating particles in the café atmosphere.
 * Dust motes, golden sparkles, confetti during celebrate mode.
 */
export default function Particles() {
  const celebrateActive = useStore(s => s.celebrateActive);

  return (
    <>
      <DustMotes />
      <GoldenSparkles />
      {celebrateActive && <CelebrateConfetti />}
    </>
  );
}

// Soft floating dust motes
function DustMotes() {
  const ref = useRef();
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = Math.random() * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      speed: 0.1 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2,
      amplitude: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const { speed, offset, amplitude } = speeds[i];
      pos[i * 3 + 1] += speed * 0.003;
      pos[i * 3 + 0] += Math.sin(state.clock.elapsedTime * speed + offset) * 0.001;
      if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = 0;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#FFD166"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </points>
  );
}

// Bright golden sparkles near the cake
function GoldenSparkles() {
  const ref = useRef();
  const count = 30;

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const offsets = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.8;
      positions[i * 3 + 0] = Math.sin(angle) * r;
      positions[i * 3 + 1] = 1.0 + Math.random() * 1.2;
      positions[i * 3 + 2] = Math.cos(angle) * r;
      offsets.push(Math.random() * Math.PI * 2);
    }
    return { positions, offsets };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.positions.slice(), 3));
    return g;
  }, [data]);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime + data.offsets[i];
      const angle = (i / count) * Math.PI * 2 + t * 0.5;
      const r = 0.3 + Math.sin(t) * 0.3;
      pos[i * 3 + 0] = Math.sin(angle) * r;
      pos[i * 3 + 1] = 1.2 + Math.sin(t * 1.5 + data.offsets[i]) * 0.4;
      pos[i * 3 + 2] = Math.cos(angle) * r;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#FFD166"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

// Celebration confetti burst
function CelebrateConfetti() {
  const ref = useRef();
  const count = 200;

  const colors = ['#FF6B9D', '#FFD166', '#56D8CD', '#5B86E5', '#F4A261', '#B06AB3'];

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const colorArr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = 5 + Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      velocities.push({
        vx: (Math.random() - 0.5) * 0.05,
        vy: -0.02 - Math.random() * 0.04,
        vz: (Math.random() - 0.5) * 0.05,
      });
      const c = new THREE.Color(colors[i % colors.length]);
      colorArr[i * 3 + 0] = c.r;
      colorArr[i * 3 + 1] = c.g;
      colorArr[i * 3 + 2] = c.b;
    }
    return { positions: positions.slice(), velocities, colorArr };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.positions.slice(), 3));
    g.setAttribute('color', new THREE.BufferAttribute(data.colorArr, 3));
    return g;
  }, [data]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const v = data.velocities[i];
      pos[i * 3 + 0] += v.vx;
      pos[i * 3 + 1] += v.vy;
      pos[i * 3 + 2] += v.vz;
      if (pos[i * 3 + 1] < -0.5) {
        pos[i * 3 + 1] = 5 + Math.random() * 2;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        vertexColors
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}
