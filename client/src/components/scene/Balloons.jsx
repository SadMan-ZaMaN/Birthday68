import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * Balloons — colorful helium balloons floating around the café.
 * Click to pop → plays pop particle effect and syncs to all users.
 */
const BALLOON_DATA = [
  // Original positions — spread around room
  { id: 'balloon_0',  pos: [-3, 3.5, -2],   color: '#FF6B9D', swayOffset: 0 },
  { id: 'balloon_1',  pos: [ 3, 3.8, -2],   color: '#FFD166', swayOffset: 0.7 },
  { id: 'balloon_2',  pos: [-4, 3.2,  2],   color: '#56D8CD', swayOffset: 1.2 },
  { id: 'balloon_3',  pos: [ 4, 3.6,  2],   color: '#5B86E5', swayOffset: 0.3 },
  { id: 'balloon_4',  pos: [-2, 4.0, -5],   color: '#F4A261', swayOffset: 1.8 },
  { id: 'balloon_5',  pos: [ 2, 3.9, -5],   color: '#B06AB3', swayOffset: 0.9 },
  { id: 'balloon_6',  pos: [-6, 3.4,  0],   color: '#FF8C42', swayOffset: 1.5 },
  { id: 'balloon_7',  pos: [ 6, 3.7,  0],   color: '#FF6B9D', swayOffset: 2.1 },
  // New balloons — corners and cluster fills
  { id: 'balloon_8',  pos: [-7, 3.6, -6],   color: '#FFD166', swayOffset: 0.4 },
  { id: 'balloon_9',  pos: [ 7, 3.3, -6],   color: '#56D8CD', swayOffset: 1.1 },
  { id: 'balloon_10', pos: [-7, 3.9,  5],   color: '#FF6B9D', swayOffset: 2.5 },
  { id: 'balloon_11', pos: [ 7, 4.0,  5],   color: '#5B86E5', swayOffset: 0.6 },
  { id: 'balloon_12', pos: [ 0, 4.2,  0],   color: '#F4A261', swayOffset: 1.3 },
  { id: 'balloon_13', pos: [-5, 3.5, -7],   color: '#B06AB3', swayOffset: 2.0 },
  { id: 'balloon_14', pos: [ 5, 3.8, -7],   color: '#FF8C42', swayOffset: 0.8 },
  { id: 'balloon_15', pos: [-1, 3.6,  6],   color: '#FFD166', swayOffset: 1.7 },
  { id: 'balloon_16', pos: [ 1, 3.4,  6],   color: '#FF6B9D', swayOffset: 2.3 },
  { id: 'balloon_17', pos: [-8, 3.7, -1],   color: '#56D8CD', swayOffset: 0.2 },
  { id: 'balloon_18', pos: [ 8, 3.5, -4],   color: '#5B86E5', swayOffset: 1.6 },
  { id: 'balloon_19', pos: [ 0, 4.1, -8],   color: '#F4A261', swayOffset: 2.8 },
];

export default function Balloons() {
  const balloons = useStore(s => s.balloons);

  return (
    <group name="balloons">
      {BALLOON_DATA.map(b => (
        balloons[b.id] && (
          <Balloon key={b.id} data={b} />
        )
      ))}
    </group>
  );
}

function Balloon({ data }) {
  const groupRef = useRef();
  const popParticlesRef = useRef([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + data.swayOffset;
    groupRef.current.position.y = data.pos[1] + Math.sin(t * 0.8) * 0.12;
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.04;
    groupRef.current.rotation.x = Math.cos(t * 0.5) * 0.03;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    useStore.getState().popBalloon(data.id);
    useStore.getState().showNotification('You popped a balloon! 🎈');
  };

  return (
    <group
      ref={groupRef}
      position={data.pos}
      name={`balloon-${data.id}`}
      onClick={handleClick}
    >
      {/* Balloon body */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.1}
          metalness={0.0}
          emissive={data.color}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Knot at bottom */}
      <mesh position={[0, -0.26, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={data.color} roughness={0.8} />
      </mesh>

      {/* String to floor */}
      <BalloonString startY={-0.29} endY={data.pos[1] * -1 + 0.1} />

      {/* Hover indicator */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0} />
      </mesh>
    </group>
  );
}

function BalloonString({ startY, endY }) {
  const points = [];
  const segments = 8;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const sway = Math.sin(t * Math.PI) * 0.05;
    points.push(new THREE.Vector3(sway, startY - t * Math.abs(endY), 0));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.006, 4, false);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color="#CCCCCC" roughness={0.9} />
    </mesh>
  );
}
