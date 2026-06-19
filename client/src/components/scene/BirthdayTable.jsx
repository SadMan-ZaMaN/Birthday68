import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * BirthdayTable — the centerpiece of the café.
 * Contains: round table, chairs, birthday cake with candles,
 * gift boxes, flowers, champagne, and plates.
 */
export default function BirthdayTable() {
  const candlesLit = useStore(s => s.candlesLit);
  const cakeCut    = useStore(s => s.cakeCut);

  const materials = useMemo(() => ({
    tableTop: new THREE.MeshStandardMaterial({ color: '#2C1503', roughness: 0.4, metalness: 0.05 }),
    tableLeg: new THREE.MeshStandardMaterial({ color: '#1A0D02', roughness: 0.5 }),
    tableCloth: new THREE.MeshStandardMaterial({ color: '#F8F0DC', roughness: 0.9 }),
    cakeBase: new THREE.MeshStandardMaterial({ color: '#FFF5E6', roughness: 0.7 }),
    cakeIcing: new THREE.MeshStandardMaterial({ color: '#FFC8D6', roughness: 0.5, metalness: 0.1 }),
    cakeChoc: new THREE.MeshStandardMaterial({ color: '#4E2F1D', roughness: 0.8 }),
    cakeSlice: new THREE.MeshStandardMaterial({ color: '#FFF5E6', roughness: 0.7, side: THREE.DoubleSide }),
    candleBody: new THREE.MeshStandardMaterial({ color: '#FFD166', roughness: 0.6 }),
    candleWick: new THREE.MeshStandardMaterial({ color: '#1A0D02', roughness: 1.0 }),
    flame: new THREE.MeshStandardMaterial({
      color: '#FF8C00', roughness: 0.0,
      emissive: '#FF6B00', emissiveIntensity: 1.5,
      transparent: true, opacity: 0.9,
    }),
    chairWood: new THREE.MeshStandardMaterial({ color: '#3D1F0A', roughness: 0.5 }),
    chairSeat: new THREE.MeshStandardMaterial({ color: '#8B1A1A', roughness: 0.8 }),
    gift1: new THREE.MeshStandardMaterial({ color: '#FF6B9D', roughness: 0.7 }),
    gift2: new THREE.MeshStandardMaterial({ color: '#5B86E5', roughness: 0.7 }),
    gift3: new THREE.MeshStandardMaterial({ color: '#56D8CD', roughness: 0.7 }),
    ribbon: new THREE.MeshStandardMaterial({ color: '#FFD166', roughness: 0.4, metalness: 0.3 }),
    plate: new THREE.MeshStandardMaterial({ color: '#FEFEFE', roughness: 0.3, metalness: 0.1 }),
    champagne: new THREE.MeshStandardMaterial({ color: '#F0B429', roughness: 0.2, metalness: 0.6, transparent: true, opacity: 0.85 }),
    flower: new THREE.MeshStandardMaterial({ color: '#FF6B9D', roughness: 0.8, emissive: '#FF1A6B', emissiveIntensity: 0.1 }),
  }), []);

  return (
    <group name="birthday-table" position={[0, 0, 0]} scale={[1.35, 1.35, 1.35]}>
      {/* ── Table Structure ── */}
      <Table materials={materials} />

      {/* ── Chairs ── */}
      {[0, 1, 2, 3, 4].map(i => (
        <Chair key={i} index={i} materials={materials} />
      ))}

      {/* ── Tablecloth ── */}
      <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.15, 32]} />
        <primitive object={materials.tableCloth} attach="material" />
      </mesh>

      {/* ── Cake ── */}
      <BirthdayCake materials={materials} candlesLit={candlesLit} cakeCut={cakeCut} />

      {/* ── Gift boxes ── */}
      <GiftBoxes materials={materials} />

      {/* ── Champagne ── */}
      <ChampagneBottle materials={materials} />

      {/* ── Flower centerpiece ── */}
      <FlowerVase materials={materials} />

      {/* ── Plates ── */}
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2;
        const r = 0.9;
        return (
          <mesh key={i} position={[Math.sin(angle) * r, 0.82, Math.cos(angle) * r]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 16]} />
            <primitive object={materials.plate} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Table ────────────────────────────────────────────
function Table({ materials }) {
  return (
    <group name="table">
      {/* Top */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.07, 32]} />
        <primitive object={materials.tableTop} attach="material" />
      </mesh>
      {/* Pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 12]} />
        <primitive object={materials.tableLeg} attach="material" />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 16]} />
        <primitive object={materials.tableLeg} attach="material" />
      </mesh>
    </group>
  );
}

// ─── Chair ────────────────────────────────────────────
function Chair({ index, materials }) {
  const angle = (index / 5) * Math.PI * 2;
  const r = 1.9;
  const x = Math.sin(angle) * r;
  const z = Math.cos(angle) * r;

  return (
    <group position={[x, 0, z]} rotation={[0, -angle, 0]} name={`chair-${index}`}>
      {/* Seat */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <primitive object={materials.chairSeat} attach="material" />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.78, -0.22]} castShadow>
        <boxGeometry args={[0.46, 0.62, 0.05]} />
        <primitive object={materials.chairWood} attach="material" />
      </mesh>
      {/* Legs */}
      {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.24, lz]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.48, 6]} />
          <primitive object={materials.chairWood} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Piped Frosting / Cream Stars ─────────────────────
function FrostingPiping({ radius, y, count, cakeCut, color = '#FEFEFE' }) {
  const points = useMemo(() => {
    const arr = [];
    const limit = cakeCut ? Math.floor(count * 0.875) : count;
    for (let i = 0; i < limit; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr.push([Math.sin(angle) * radius, y, Math.cos(angle) * radius, angle]);
    }
    return arr;
  }, [radius, y, count, cakeCut]);

  return (
    <group>
      {points.map(([px, py, pz, angle], idx) => (
        <mesh key={idx} position={[px, py, pz]} rotation={[0, -angle, 0]} castShadow>
          <dodecahedronGeometry args={[0.016]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Cherries on top of Frosting ──────────────────────
function Cherries({ radius, y, count, cakeCut }) {
  const points = useMemo(() => {
    const arr = [];
    const limit = cakeCut ? Math.floor(count * 0.875) : count;
    for (let i = 0; i < limit; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.PI / count); // offset slightly
      if (cakeCut && angle > Math.PI * 1.75) continue;
      arr.push([Math.sin(angle) * radius, y, Math.cos(angle) * radius]);
    }
    return arr;
  }, [radius, y, count, cakeCut]);

  return (
    <group>
      {points.map(([px, py, pz], idx) => (
        <group key={idx} position={[px, py + 0.012, pz]}>
          <mesh castShadow>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#C21807" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0.003, 0.024, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.0015, 0.0015, 0.03, 4]} />
            <meshStandardMaterial color="#556B2F" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Sprinkles ────────────────────────────────────────
function Sprinkles({ cakeCut }) {
  const sprinkles = useMemo(() => {
    const arr = [];
    const colors = ['#FF6B9D', '#FFD166', '#56D8CD', '#5B86E5', '#FFFFFF', '#B06AB3'];
    const tiers = [
      { rInner: 0.32, rOuter: 0.38, y: 0.20, count: 35 },
      { rInner: 0.20, rOuter: 0.28, y: 0.345, count: 25 },
      { rInner: 0.0,  rOuter: 0.14, y: 0.46, count: 15 },
    ];
    let id = 0;
    for (const tier of tiers) {
      for (let i = 0; i < tier.count; i++) {
        const r = Math.sqrt(Math.random() * (tier.rOuter * tier.rOuter - tier.rInner * tier.rInner) + tier.rInner * tier.rInner);
        const theta = Math.random() * Math.PI * 2;
        if (cakeCut && theta > Math.PI * 1.75) continue;
        const px = Math.sin(theta) * r;
        const pz = Math.cos(theta) * r;
        const rx = Math.random() * Math.PI;
        const ry = Math.random() * Math.PI;
        const rz = Math.random() * Math.PI;
        const color = colors[Math.floor(Math.random() * colors.length)];
        arr.push({
          id: id++,
          pos: [px, tier.y + 0.002, pz],
          rot: [rx, ry, rz],
          color
        });
      }
    }
    return arr;
  }, [cakeCut]);

  return (
    <group>
      {sprinkles.map(s => (
        <mesh key={s.id} position={s.pos} rotation={s.rot}>
          <boxGeometry args={[0.006, 0.006, 0.018]} />
          <meshStandardMaterial color={s.color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Individual Cake Tier ─────────────────────────────
function CakeTier({ position, radius, height, cakeCut, materials }) {
  const thetaLength = cakeCut ? Math.PI * 1.75 : Math.PI * 2;

  return (
    <group position={position}>
      {/* Sponge tier */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32, 1, false, 0, thetaLength]} />
        <primitive object={materials.cakeIcing} attach="material" />
      </mesh>

      {/* Internal filling layer detail on cut faces */}
      {cakeCut && (
        <>
          {/* Side 1 (along Z+) */}
          <mesh position={[0, 0, radius / 2]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.004, height - 0.002, radius]} />
            <primitive object={materials.cakeChoc} attach="material" />
          </mesh>

          {/* Side 2 (along Z-rotated at 1.75 PI) */}
          <mesh
            position={[Math.sin(Math.PI * 1.75) * radius / 2, 0, Math.cos(Math.PI * 1.75) * radius / 2]}
            rotation={[0, Math.PI * 1.75, 0]}
          >
            <boxGeometry args={[0.004, height - 0.002, radius]} />
            <primitive object={materials.cakeChoc} attach="material" />
          </mesh>
        </>
      )}
    </group>
  );
}

// ─── Plated Cake Wedge Slice ─────────────────────────
function CakeSlice({ position, rotation, materials }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Bottom tier wedge */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.1, 8, 1, false, 0, Math.PI * 0.25]} />
        <primitive object={materials.cakeIcing} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, 0.07]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.002, 0.098, 0.14]} />
        <primitive object={materials.cakeChoc} attach="material" />
      </mesh>
      <mesh
        position={[Math.sin(Math.PI * 0.25) * 0.07, 0.05, Math.cos(Math.PI * 0.25) * 0.07]}
        rotation={[0, Math.PI * 0.25, 0]}
      >
        <boxGeometry args={[0.002, 0.098, 0.14]} />
        <primitive object={materials.cakeChoc} attach="material" />
      </mesh>

      {/* Middle tier wedge */}
      <mesh position={[0, 0.125, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 0.075, 8, 1, false, 0, Math.PI * 0.25]} />
        <primitive object={materials.cakeIcing} attach="material" />
      </mesh>
      <mesh position={[0, 0.125, 0.05]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.002, 0.073, 0.10]} />
        <primitive object={materials.cakeChoc} attach="material" />
      </mesh>
      <mesh
        position={[Math.sin(Math.PI * 0.25) * 0.05, 0.125, Math.cos(Math.PI * 0.25) * 0.05]}
        rotation={[0, Math.PI * 0.25, 0]}
      >
        <boxGeometry args={[0.002, 0.073, 0.10]} />
        <primitive object={materials.cakeChoc} attach="material" />
      </mesh>

      {/* Top tier wedge */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 8, 1, false, 0, Math.PI * 0.25]} />
        <primitive object={materials.cakeIcing} attach="material" />
      </mesh>
      <mesh position={[0, 0.18, 0.03]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.002, 0.048, 0.06]} />
        <primitive object={materials.cakeChoc} attach="material" />
      </mesh>
      <mesh
        position={[Math.sin(Math.PI * 0.25) * 0.03, 0.18, Math.cos(Math.PI * 0.25) * 0.03]}
        rotation={[0, Math.PI * 0.25, 0]}
      >
        <boxGeometry args={[0.002, 0.048, 0.06]} />
        <primitive object={materials.cakeChoc} attach="material" />
      </mesh>
    </group>
  );
}

// ─── Birthday Cake with candles ───────────────────────
function BirthdayCake({ materials, candlesLit, cakeCut }) {
  const flameRef = useRef([]);

  useFrame((state) => {
    if (!candlesLit) return;
    flameRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime + i * 0.5;
      mesh.scale.x = 0.9 + Math.sin(t * 8) * 0.1;
      mesh.scale.y = 0.9 + Math.sin(t * 6 + 1) * 0.12;
      mesh.position.y = 0.22 + Math.sin(t * 7) * 0.01;
    });
  });

  const candlePositions = [
    [0, 0], [0.18, 0.1], [-0.18, 0.1],
    [0.08, -0.2], [-0.08, -0.2],
    [0.28, 0], [-0.28, 0],
  ];

  const getCandleSurfaceY = (cx, cz) => {
    const r = Math.sqrt(cx * cx + cz * cz);
    if (r <= 0.18) return 0.46;
    if (r <= 0.30) return 0.345;
    return 0.20;
  };

  return (
    <group name="cake" position={[0, 0.87, 0]}>
      {/* ── Cake Stand ── */}
      <group name="cake-stand">
        {/* Base */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
          <meshStandardMaterial color="#D4A574" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Pillar */}
        <mesh position={[0, -0.02, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.06, 12]} />
          <meshStandardMaterial color="#D4A574" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Plate */}
        <mesh position={[0, 0.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.02, 32]} />
          <meshStandardMaterial color="#D4A574" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Cake Tiers ── */}
      <CakeTier position={[0, 0.1, 0]} radius={0.4} height={0.2} cakeCut={cakeCut} materials={materials} />
      <CakeTier position={[0, 0.27, 0]} radius={0.3} height={0.15} cakeCut={cakeCut} materials={materials} />
      <CakeTier position={[0, 0.41, 0]} radius={0.18} height={0.1} cakeCut={cakeCut} materials={materials} />

      {/* ── Frosting / Piping Borders ── */}
      <FrostingPiping radius={0.37} y={0.20} count={24} cakeCut={cakeCut} color="#FEFEFE" />
      <FrostingPiping radius={0.27} y={0.345} count={18} cakeCut={cakeCut} color="#FEFEFE" />
      <FrostingPiping radius={0.15} y={0.46} count={12} cakeCut={cakeCut} color="#FEFEFE" />

      {/* ── Cherry Toppings ── */}
      <Cherries radius={0.37} y={0.20} count={8} cakeCut={cakeCut} />
      <Cherries radius={0.27} y={0.345} count={6} cakeCut={cakeCut} />
      <Cherries radius={0.15} y={0.46} count={4} cakeCut={cakeCut} />

      {/* ── Colorful Sprinkles ── */}
      <Sprinkles cakeCut={cakeCut} />

      {/* ── Icing drips (cylinder rings, cut aligned) ── */}
      {[
        { y: 0.20, rTop: 0.403, rBot: 0.401, h: 0.02 },
        { y: 0.345, rTop: 0.303, rBot: 0.301, h: 0.02 },
        { y: 0.46, rTop: 0.183, rBot: 0.181, h: 0.02 }
      ].map((drip, i) => (
        <mesh key={i} position={[0, drip.y, 0]}>
          <cylinderGeometry
            args={[drip.rTop, drip.rBot, drip.h, 32, 1, false, 0, cakeCut ? Math.PI * 1.75 : Math.PI * 2]}
          />
          <primitive object={materials.cakeIcing} attach="material" />
        </mesh>
      ))}

      {/* ── Candles (perfectly positioned on tier surfaces) ── */}
      {candlePositions.map(([cx, cz], i) => {
        const surfaceY = getCandleSurfaceY(cx, cz);
        return (
          <group key={i} position={[cx, surfaceY + 0.09, cz]}>
            {/* Candle body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.18, 8]} />
              <meshStandardMaterial
                color={['#FF6B9D','#FFD166','#56D8CD','#5B86E5','#F4A261','#B06AB3','#FF8C42'][i % 7]}
                roughness={0.6}
              />
            </mesh>
            {/* Wick */}
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.05, 4]} />
              <primitive object={materials.candleWick} attach="material" />
            </mesh>
            {/* Flame */}
            {candlesLit && (
              <mesh
                ref={el => { flameRef.current[i] = el; }}
                position={[0, 0.22, 0]}
              >
                <coneGeometry args={[0.025, 0.07, 8]} />
                <primitive object={materials.flame} attach="material" />
              </mesh>
            )}
            {/* Smoke when blown out */}
            {!candlesLit && (
              <mesh position={[0, 0.18, 0]}>
                <sphereGeometry args={[0.02, 4, 4]} />
                <meshStandardMaterial color="#AAAAAA" transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* ── Wedge slice removed to the plate ── */}
      {cakeCut && (
        <CakeSlice position={[0, -0.045, 0.9]} rotation={[0, -Math.PI / 8 - Math.PI, 0]} materials={materials} />
      )}

      {/* Label */}
      <Html position={[0, 0.7, 0]} center distanceFactor={6}>
        <div style={{
          color: '#FFD166',
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          textShadow: '0 0 10px rgba(255,209,102,0.8)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          🎂 Joyeux Anniversaire
        </div>
      </Html>
    </group>
  );
}

// ─── Gift Boxes ───────────────────────────────────────
function GiftBoxes({ materials }) {
  const boxes = [
    { pos: [1.4, 0.87, 0.3],  size: [0.22, 0.22, 0.22], mat: 'gift1' },
    { pos: [1.6, 0.87, -0.2], size: [0.18, 0.28, 0.18], mat: 'gift2' },
    { pos: [1.3, 0.87, -0.5], size: [0.28, 0.18, 0.25], mat: 'gift3' },
    { pos: [-1.4, 0.87, 0.4], size: [0.20, 0.20, 0.20], mat: 'gift1' },
    { pos: [-1.5, 0.87, -0.3],size: [0.25, 0.15, 0.22], mat: 'gift2' },
  ];

  return (
    <group name="gifts">
      {boxes.map((b, i) => (
        <group key={i} position={b.pos}>
          {/* Box */}
          <mesh castShadow>
            <boxGeometry args={b.size} />
            <primitive object={materials[b.mat]} attach="material" />
          </mesh>
          {/* Ribbon horizontal */}
          <mesh position={[0, b.size[1] / 2 + 0.001, 0]}>
            <boxGeometry args={[b.size[0] + 0.002, 0.025, 0.04]} />
            <primitive object={materials.ribbon} attach="material" />
          </mesh>
          {/* Ribbon vertical */}
          <mesh position={[0, b.size[1] / 2 + 0.001, 0]}>
            <boxGeometry args={[0.04, 0.025, b.size[2] + 0.002]} />
            <primitive object={materials.ribbon} attach="material" />
          </mesh>
          {/* Bow */}
          <mesh position={[0, b.size[1] / 2 + 0.03, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <primitive object={materials.ribbon} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Champagne Bottle ─────────────────────────────────
function ChampagneBottle({ materials }) {
  return (
    <group position={[-0.7, 0.87, 0.5]} name="champagne">
      {/* Bottle body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.55, 12]} />
        <meshStandardMaterial color="#2D5016" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.33, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.06, 0.18, 10]} />
        <meshStandardMaterial color="#2D5016" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Foil */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 10]} />
        <primitive object={materials.champagne} attach="material" />
      </mesh>
      {/* Cork */}
      <mesh position={[0, 0.47, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
        <meshStandardMaterial color="#D4A574" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ─── Flower Vase ──────────────────────────────────────
function FlowerVase({ materials }) {
  return (
    <group position={[0.6, 0.87, -0.5]} name="flowers">
      {/* Vase */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.04, 0.2, 12]} />
        <meshStandardMaterial color="#D4A017" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Stems */}
      {[0, 1, 2, 3, 4].map(i => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.03, 0.2, Math.cos(a) * 0.03]}>
            <cylinderGeometry args={[0.005, 0.005, 0.25, 4]} />
            <meshStandardMaterial color="#2D5016" roughness={0.9} />
          </mesh>
        );
      })}
      {/* Flower heads */}
      {[0, 1, 2, 3, 4].map(i => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.07, 0.35, Math.cos(a) * 0.07]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={['#FF6B9D','#FFD166','#FF8C42','#FF6B9D','#FFD166'][i]}
              roughness={0.7}
              emissive={['#FF6B9D','#FFD166','#FF8C42','#FF6B9D','#FFD166'][i]}
              emissiveIntensity={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}
