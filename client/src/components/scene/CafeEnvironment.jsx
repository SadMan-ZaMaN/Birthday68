import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * CafeEnvironment — builds the complete Paris café room:
 * wooden floor, plaster walls, ceiling with hanging lamps,
 * wainscoting, decorative details, and Parisian café props.
 * 
 * The right wall (X=+10) has large panoramic windows looking
 * out to the Paris boulevard. Additional windows on back and left walls.
 */
export default function CafeEnvironment() {
  // Shared materials (memoized to avoid recreation)
  const materials = useMemo(() => ({
    floor: new THREE.MeshStandardMaterial({
      color: '#5C3D1E',
      roughness: 0.7,
      metalness: 0.0,
    }),
    floorStripe: new THREE.MeshStandardMaterial({
      color: '#4A2E10',
      roughness: 0.7,
    }),
    wall: new THREE.MeshStandardMaterial({
      color: '#E8DCC8',
      roughness: 0.9,
    }),
    wallAccent: new THREE.MeshStandardMaterial({
      color: '#C4A882',
      roughness: 0.8,
    }),
    ceiling: new THREE.MeshStandardMaterial({
      color: '#F5EDD8',
      roughness: 1.0,
    }),
    wainscoting: new THREE.MeshStandardMaterial({
      color: '#8B6914',
      roughness: 0.6,
      metalness: 0.1,
    }),
    darkWood: new THREE.MeshStandardMaterial({
      color: '#3D1F0A',
      roughness: 0.5,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: '#D4A017',
      roughness: 0.3,
      metalness: 0.8,
    }),
    lamp: new THREE.MeshStandardMaterial({
      color: '#FFF8DC',
      roughness: 0.2,
      emissive: '#FF9F00',
      emissiveIntensity: 0.6,
    }),
    lampShade: new THREE.MeshStandardMaterial({
      color: '#D4730A',
      roughness: 0.6,
      side: THREE.DoubleSide,
    }),
    windowGlass: new THREE.MeshStandardMaterial({
      color: '#88AADD',
      roughness: 0.0,
      metalness: 0.1,
      transparent: true,
      opacity: 0.3,
    }),
    windowFrame: new THREE.MeshStandardMaterial({
      color: '#F5F0E8',
      roughness: 0.5,
    }),
    banner: new THREE.MeshStandardMaterial({
      color: '#FF6B9D',
      roughness: 0.8,
    }),
    bannerGold: new THREE.MeshStandardMaterial({
      color: '#FFD166',
      roughness: 0.7,
      emissive: '#FFD166',
      emissiveIntensity: 0.1,
    }),
    chalkboard: new THREE.MeshStandardMaterial({
      color: '#2D4A2D',
      roughness: 0.9,
    }),
  }), []);

  return (
    <group name="cafe-environment">
      {/* ── Floor ─────────────────────────────────────────── */}
      <Floor materials={materials} />

      {/* ── Ceiling ───────────────────────────────────────── */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <primitive object={materials.ceiling} attach="material" />
      </mesh>

      {/* ── Walls ─────────────────────────────────────────── */}
      <Walls materials={materials} />

      {/* ── Wainscoting panels ────────────────────────────── */}
      <Wainscoting materials={materials} />

      {/* ── Windows (right wall — panoramic Eiffel view) ─── */}
      <RightWallWindows materials={materials} />

      {/* ── Windows (back wall) ───────────────────────────── */}
      <BackWallWindows materials={materials} />

      {/* ── Windows (left wall) ──────────────────────────── */}
      <LeftWallWindows materials={materials} />

      {/* ── Hanging lamps ─────────────────────────────────── */}
      <HangingLamps materials={materials} />

      {/* ── Birthday decorations ──────────────────────────── */}
      <BirthdayBanner materials={materials} />

      {/* ── Café props ────────────────────────────────────── */}
      <ChalkMenu materials={materials} />
      <WineRack materials={materials} />
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Floor with wooden plank pattern
// ─────────────────────────────────────────────────────
function Floor({ materials }) {
  const planks = useMemo(() => {
    const result = [];
    for (let i = -9; i <= 9; i++) {
      result.push(i);
    }
    return result;
  }, []);

  return (
    <group name="floor">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <primitive object={materials.floor} attach="material" />
      </mesh>
      {/* Plank lines */}
      {planks.map(x => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x * 0.8, 0.001, 0]} receiveShadow>
          <planeGeometry args={[0.04, 20]} />
          <primitive object={materials.floorStripe} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Walls — right wall is now mostly windows for Eiffel view
// ─────────────────────────────────────────────────────
function Walls({ materials }) {
  return (
    <group name="walls">
      {/* Back wall — split into sections with window openings */}
      {/* Left portion of back wall (x = -10 to -6) */}
      <mesh position={[-8, 2.5, -10]} castShadow receiveShadow>
        <boxGeometry args={[4, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Right portion of back wall (x = 6 to 10) */}
      <mesh position={[8, 2.5, -10]} castShadow receiveShadow>
        <boxGeometry args={[4, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Back wall above window */}
      <mesh position={[0, 4.4, -10]} castShadow receiveShadow>
        <boxGeometry args={[12, 1.2, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Back wall below window */}
      <mesh position={[0, 0.5, -10]} castShadow receiveShadow>
        <boxGeometry args={[12, 1.0, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Front wall (with opening for entrance) */}
      <mesh position={[-5, 2.5, 10]} castShadow receiveShadow>
        <boxGeometry args={[10, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      <mesh position={[5, 2.5, 10]} castShadow receiveShadow>
        <boxGeometry args={[10, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Left wall — split into sections with window openings */}
      {/* Front portion of left wall (z = 4 to 10) */}
      <mesh position={[-10, 2.5, 7]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Back portion of left wall (z = -10 to -4) */}
      <mesh position={[-10, 2.5, -7]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Left wall above window */}
      <mesh position={[-10, 4.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 1.2, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Left wall below window */}
      <mesh position={[-10, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 1.0, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Right wall — WIDE OPEN for panoramic Eiffel view */}
      {/* Only small corner pillars and a thin strip above/below */}
      {/* Far back corner (z = -10 to -8) */}
      <mesh position={[10, 2.5, -9]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Front corner (z = 8 to 10) */}
      <mesh position={[10, 2.5, 9]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 5, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Right wall above windows — thin header strip */}
      <mesh position={[10, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 1.0, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Right wall below windows — sill area */}
      <mesh position={[10, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 0.8, 0.15]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Wainscoting (decorative wood panels at base of walls)
// ─────────────────────────────────────────────────────
function Wainscoting({ materials }) {
  const panels = [
    { pos: [-8, 0.65, -9.92],   rot: [0, 0, 0],            size: [4, 1.3, 0.1] },  // back-left
    { pos: [8, 0.65, -9.92],    rot: [0, 0, 0],            size: [4, 1.3, 0.1] },  // back-right
    { pos: [-9.92, 0.65, 7],   rot: [0, Math.PI / 2, 0],  size: [6, 1.3, 0.1] },  // left-front
    { pos: [-9.92, 0.65, -7],  rot: [0, Math.PI / 2, 0],  size: [6, 1.3, 0.1] },  // left-back
    { pos: [9.92, 0.65, -9],   rot: [0, Math.PI / 2, 0],  size: [2, 1.3, 0.1] },  // right-back corner
    { pos: [9.92, 0.65, 9],    rot: [0, Math.PI / 2, 0],  size: [2, 1.3, 0.1] },  // right-front corner
  ];

  return (
    <group name="wainscoting">
      {panels.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} castShadow>
          <boxGeometry args={p.size} />
          <primitive object={materials.wainscoting} attach="material" />
        </mesh>
      ))}
      {/* Cap rail */}
      {panels.map((p, i) => (
        <mesh key={`cap-${i}`} position={[p.pos[0], 1.32, p.pos[2]]} rotation={p.rot}>
          <boxGeometry args={[p.size[0], 0.08, 0.15]} />
          <primitive object={materials.gold} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Right Wall Windows — PANORAMIC view of Paris / Eiffel Tower
// 4 large windows spanning from z=-8 to z=8
// ─────────────────────────────────────────────────────
function RightWallWindows({ materials }) {
  const windowFrames = [
    { z: -6, label: 'window-right-1' },
    { z: -2, label: 'window-right-2' },
    { z:  2, label: 'window-right-3' },
    { z:  6, label: 'window-right-4' },
  ];

  return (
    <group name="right-windows">
      {windowFrames.map(({ z, label }) => (
        <group key={label} position={[9.9, 2.5, z]}>
          {/* Outer frame - hollowed out using four border bars */}
          {/* Top border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 0.2, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Bottom border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, -1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 0.2, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Left border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, -1.7]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 3.4, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Right border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 1.7]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 3.4, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Glass pane — very transparent for view */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.05, 0, 0]}>
            <boxGeometry args={[3.2, 3.4, 0.04]} />
            <primitive object={materials.windowGlass} attach="material" />
          </mesh>
          {/* Vertical muntin */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.1, 0, 0]}>
            <boxGeometry args={[0.06, 3.4, 0.08]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Horizontal muntin */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.1, 0, 0]}>
            <boxGeometry args={[3.2, 0.06, 0.08]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Thin column dividers between windows */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 3.8, 0.18]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
        </group>
      ))}
      {/* Window sill — continuous elegant sill across all windows */}
      <mesh position={[9.7, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16, 0.1, 0.35]} />
        <primitive object={materials.windowFrame} attach="material" />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Back Wall Windows — view of the Parisian street
// ─────────────────────────────────────────────────────
function BackWallWindows({ materials }) {
  const windowFrames = [
    { x: -3, label: 'window-back-1' },
    { x:  0, label: 'window-back-2' },
    { x:  3, label: 'window-back-3' },
  ];

  return (
    <group name="back-windows">
      {windowFrames.map(({ x, label }) => (
        <group key={label} position={[x, 2.5, -9.9]}>
          {/* Outer frame - hollowed out using four border bars */}
          {/* Top border */}
          <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.2, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Bottom border */}
          <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.2, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Left border */}
          <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 2.4, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Right border */}
          <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 2.4, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Glass pane */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[2.8, 2.4, 0.04]} />
            <primitive object={materials.windowGlass} attach="material" />
          </mesh>
          {/* Muntin cross */}
          <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[2.8, 0.06, 0.06]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[0.06, 2.4, 0.06]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Left Wall Windows — additional outside views
// ─────────────────────────────────────────────────────
function LeftWallWindows({ materials }) {
  const windowFrames = [
    { z: -2, label: 'window-left-1' },
    { z:  2, label: 'window-left-2' },
  ];

  return (
    <group name="left-windows">
      {windowFrames.map(({ z, label }) => (
        <group key={label} position={[-9.9, 2.5, z]}>
          {/* Outer frame - hollowed out using four border bars */}
          {/* Top border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 1.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.4, 0.2, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Bottom border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, -1.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.4, 0.2, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Left border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, -1.6]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 2.4, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Right border */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 1.6]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 2.4, 0.12]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          {/* Glass pane */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.05, 0, 0]}>
            <boxGeometry args={[3.0, 2.4, 0.04]} />
            <primitive object={materials.windowGlass} attach="material" />
          </mesh>
          {/* Muntin cross */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.1, 0, 0]}>
            <boxGeometry args={[3.0, 0.06, 0.06]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.06, 2.4, 0.06]} />
            <primitive object={materials.windowFrame} attach="material" />
          </mesh>
        </group>
      ))}
      {/* Window sill */}
      {windowFrames.map(({ z, label }) => (
        <mesh key={`sill-${label}`} position={[-9.7, 1.0, z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[3.4, 0.1, 0.35]} />
          <primitive object={materials.windowFrame} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Hanging Lamps
// ─────────────────────────────────────────────────────
function HangingLamps({ materials }) {
  const positions = [
    [-3, 0, -3], [3, 0, -3], [0, 0, 3],
    [-4, 0, 2], [4, 0, 2],
  ];

  return (
    <group name="lamps">
      {positions.map(([x, , z], i) => (
        <group key={i} position={[x, 4.8, z]}>
          {/* Cord */}
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 1.2, 6]} />
            <primitive object={materials.darkWood} attach="material" />
          </mesh>
          {/* Shade */}
          <mesh position={[0, -0.9, 0]}>
            <coneGeometry args={[0.25, 0.4, 12, 1, true]} />
            <primitive object={materials.lampShade} attach="material" />
          </mesh>
          {/* Bulb */}
          <mesh position={[0, -0.7, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <primitive object={materials.lamp} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Birthday Banner (string of triangular flags)
// ─────────────────────────────────────────────────────
function BirthdayBanner({ materials }) {
  const letters = 'JOYEUX ANNIVERSAIRE'.split('');
  const colors = ['#FF6B9D', '#FFD166', '#F4A261', '#56D8CD', '#5B86E5'];

  return (
    <group name="banner" position={[0, 4.5, -9.5]}>
      {/* String */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 16, 4]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={materials.darkWood} attach="material" />
      </mesh>
      {/* Flags */}
      {letters.map((letter, i) => {
        const x = (i / (letters.length - 1)) * 14 - 7;
        return (
          <group key={i} position={[x, -0.25, 0]}>
            <mesh>
              <coneGeometry args={[0.2, 0.4, 3, 1]} />
              <meshStandardMaterial
                color={colors[i % colors.length]}
                roughness={0.7}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Chalk Menu Board (on back wall)
// ─────────────────────────────────────────────────────
function ChalkMenu({ materials }) {
  return (
    <group position={[-8, 2.5, -9.85]} name="chalk-menu">
      {/* Board frame */}
      <mesh>
        <boxGeometry args={[2.4, 2, 0.1]} />
        <primitive object={materials.darkWood} attach="material" />
      </mesh>
      {/* Chalk surface */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.1, 1.7, 0.02]} />
        <primitive object={materials.chalkboard} attach="material" />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Wine Rack (decorative, back corner)
// ─────────────────────────────────────────────────────
function WineRack({ materials }) {
  return (
    <group position={[8, 0, -9]} name="wine-rack">
      {[0, 1, 2].map(row =>
        [0, 1].map(col => (
          <mesh key={`${row}-${col}`} position={[col * 0.28, row * 0.35 + 0.2, 0]} rotation={[Math.PI / 12, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.8, 8]} />
            <meshStandardMaterial color={`hsl(${20 + row * 30},40%,${20 + col * 15}%)`} roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  );
}
