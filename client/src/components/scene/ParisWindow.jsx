import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ParisWindow — renders the complete Parisian night street scene outside the café.
 * Outside views are now visible from RIGHT, BACK, and LEFT walls.
 * 
 * Right side (X > 10): Main street with cars, buildings
 * Back side (Z < -10): Parisian alley with buildings, bistro, trees
 * Left side (X < -10): Garden courtyard with trees and lights
 */
export default function ParisWindow() {
  return (
    <group name="paris-outside">
      {/* ════════════════════════════════════════════════
          RIGHT SIDE — Main Paris boulevard
          ════════════════════════════════════════════════ */}

      {/* ── Sky Background (placed far to the right, facing window) ── */}
      <mesh position={[30, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial
          color="#060C1E"
          roughness={1.0}
          emissive="#081026"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Stars ── */}
      <Stars />

      {/* ── Glowing Moon ── */}
      <mesh position={[28, 16, -14]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial
          color="#FFFDD0"
          emissive="#FFFFE0"
          emissiveIntensity={0.7}
          roughness={0.9}
        />
      </mesh>



      {/* ── Sidewalk (near wall) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[11.5, 0.005, 0]} receiveShadow>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#2B2B36" roughness={0.8} />
      </mesh>

      {/* ── Paved Street Road ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15.5, 0.001, 0]} receiveShadow>
        <planeGeometry args={[5, 50]} />
        <meshStandardMaterial color="#171724" roughness={0.9} />
      </mesh>

      {/* ── Far Sidewalk ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[19.0, 0.005, 0]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#24242E" roughness={0.8} />
      </mesh>

      {/* ── Street Lamps along sidewalk (X = 12.8) ── */}
      {[-16, -8, 0, 8, 16].map((z, i) => (
        <StreetLamp key={i} position={[12.8, 0, z]} />
      ))}

      {/* ── Animated Cars driving along Z-axis ── */}
      <AnimatedCars />

      {/* ── Haussmann-style Building block across the street ── */}
      <ParisBuildings />

      {/* ════════════════════════════════════════════════
          BACK SIDE — Parisian alley behind the café
          ════════════════════════════════════════════════ */}

      {/* Sky backdrop behind */}
      <mesh position={[0, 10, -30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial
          color="#080E20"
          roughness={1.0}
          emissive="#0A1228"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back alley ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -12]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#1E1E28" roughness={0.9} />
      </mesh>

      {/* Back alley buildings */}
      <BackAlleyBuildings />

      {/* Back alley street lamps */}
      {[-6, 0, 6].map((x, i) => (
        <StreetLamp key={`back-lamp-${i}`} position={[x, 0, -13]} />
      ))}

      {/* ════════════════════════════════════════════════
          LEFT SIDE — Garden courtyard
          ════════════════════════════════════════════════ */}

      {/* Sky backdrop left */}
      <mesh position={[-30, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial
          color="#070D1C"
          roughness={1.0}
          emissive="#091224"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Garden ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.003, 0]}>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#162216" roughness={0.95} />
      </mesh>

      {/* Garden elements */}
      <GardenCourtyard />
    </group>
  );
}

/**
 * Random star coordinates placed just in front of the far sky backdrop.
 */
function Stars() {
  const starsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      // Spread stars across all sky backdrops
      const side = Math.floor(Math.random() * 3);
      if (side === 0) {
        // Right sky
        positions[i * 3 + 0] = 29.0 + Math.random() * 0.5;
        positions[i * 3 + 1] = 1.0 + Math.random() * 20.0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 70.0;
      } else if (side === 1) {
        // Back sky
        positions[i * 3 + 0] = (Math.random() - 0.5) * 50.0;
        positions[i * 3 + 1] = 1.0 + Math.random() * 20.0;
        positions[i * 3 + 2] = -29.0 - Math.random() * 0.5;
      } else {
        // Left sky
        positions[i * 3 + 0] = -29.0 - Math.random() * 0.5;
        positions[i * 3 + 1] = 1.0 + Math.random() * 20.0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50.0;
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={starsGeo}>
      <pointsMaterial color="#FFFFFF" size={0.05} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}



/**
 * Street lamps standing on the near sidewalk.
 */
function StreetLamp({ position }) {
  return (
    <group position={position} name="street-lamp">
      {/* Post */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 3.6, 8]} />
        <meshStandardMaterial color="#1E202C" roughness={0.6} />
      </mesh>
      {/* Curved fixture arm */}
      <mesh position={[0.2, 3.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
        <meshStandardMaterial color="#1E202C" roughness={0.6} />
      </mesh>
      {/* Light head */}
      <mesh position={[0.45, 3.7, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial
          color="#FFF9D0"
          emissive="#FF8C00"
          emissiveIntensity={1.8}
          roughness={0.1}
        />
      </mesh>
      {/* Real illumination source */}
      <pointLight position={[0.45, 3.7, 0]} intensity={1.2} color="#FF8C00" distance={6} decay={2} />
    </group>
  );
}

/**
 * Cars driving along the Z-axis (road lanes).
 */
function AnimatedCars() {
  const carRef1 = useRef();
  const carRef2 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Car 1 in near lane (X=14.5) driving North (+Z)
    if (carRef1.current) {
      carRef1.current.position.z = ((t * 4.2) % 52) - 26;
    }
    // Car 2 in far lane (X=16.8) driving South (-Z)
    if (carRef2.current) {
      carRef2.current.position.z = 26 - ((t * 2.8) % 52);
    }
  });

  return (
    <>
      {/* Car 1: facing north (+Z) */}
      <group ref={carRef1} position={[14.5, 0.15, -26]} rotation={[0, 0, 0]}>
        <Car color="#D81E5B" />
      </group>
      {/* Car 2: facing south (-Z, rotated 180 degrees) */}
      <group ref={carRef2} position={[16.8, 0.15, 26]} rotation={[0, Math.PI, 0]}>
        <Car color="#2C5E8A" />
      </group>
    </>
  );
}

function Car({ color }) {
  // Oriented along Z-axis (length=0.9, width=0.45)
  return (
    <group name="car">
      {/* Chassis */}
      <mesh castShadow>
        <boxGeometry args={[0.45, 0.28, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>
      {/* Roof cabin */}
      <mesh position={[0, 0.22, -0.05]}>
        <boxGeometry args={[0.4, 0.18, 0.52]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>
      {/* Headlights (facing forward, +Z direction in local space) */}
      <mesh position={[0.15, 0, 0.46]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#FFFFEE" emissive="#FFFFCC" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-0.15, 0, 0.46]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#FFFFEE" emissive="#FFFFCC" emissiveIntensity={2.0} />
      </mesh>
      {/* Wheels */}
      {[[0.24, -0.14, 0.26], [-0.24, -0.14, 0.26], [0.24, -0.14, -0.26], [-0.24, -0.14, -0.26]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 10]} />
          <meshStandardMaterial color="#0F0F14" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Row of Parisian building facades flanking the street background (X = 20.5)
 */
function ParisBuildings() {
  const facades = [
    { z: -20.0, w: 5.5, h: 6.8, d: 2.5, color: '#D2C2A4' },
    { z: -14.0, w: 4.8, h: 5.8, d: 2.2, color: '#C5B698' },
    { z: -8.0,  w: 5.2, h: 6.2, d: 2.4, color: '#CCBC9E' },
    { z: -2.0,  w: 5.5, h: 5.0, d: 2.5, color: '#BEAF90' },
    { z: 4.0,   w: 5.0, h: 6.5, d: 2.3, color: '#D4C4A8' },
    { z: 10.0,  w: 5.2, h: 5.5, d: 2.4, color: '#C0B094' },
    { z: 16.0,  w: 4.8, h: 7.0, d: 2.2, color: '#C8B89C' },
    { z: 22.0,  w: 5.5, h: 6.0, d: 2.5, color: '#BEAF90' },
  ];

  return (
    <group name="paris-buildings">
      {facades.map((b, i) => (
        // Rotated -90 degrees so they face towards the café (-X)
        <group key={i} position={[20.5, b.h / 2, b.z]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Main structure */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.95} />
          </mesh>
          {/* Traditional dark blue mansard roof */}
          <mesh position={[0, b.h / 2 + 0.35, 0]}>
            <boxGeometry args={[b.w, 0.7, b.d]} />
            <meshStandardMaterial color="#3E3E4C" roughness={0.8} />
          </mesh>
          {/* Rows of lit glowing windows */}
          {Array.from({ length: Math.floor(b.h / 1.5) }, (_, row) =>
            [-0.8, -0.3, 0.3, 0.8].filter(wx => Math.abs(wx) < b.w * 0.45).map((wx, col) => (
              <mesh key={`${row}-${col}`} position={[wx, -b.h / 2 + row * 1.3 + 0.9, b.d / 2 + 0.015]}>
                <boxGeometry args={[0.24, 0.38, 0.02]} />
                <meshStandardMaterial
                  color="#FFFEE0"
                  emissive="#FFAA00"
                  emissiveIntensity={0.35}
                  roughness={0.2}
                />
              </mesh>
            ))
          )}
        </group>
      ))}
    </group>
  );
}

/**
 * Back alley buildings visible through the back wall windows.
 */
function BackAlleyBuildings() {
  const buildings = [
    { x: -7, w: 4.5, h: 5.5, d: 2.0, color: '#C0B098' },
    { x: -2, w: 3.8, h: 4.8, d: 1.8, color: '#BEAF8E' },
    { x:  3, w: 4.2, h: 6.0, d: 2.2, color: '#C8B89C' },
    { x:  8, w: 4.0, h: 5.0, d: 2.0, color: '#D2C2A4' },
  ];

  return (
    <group name="back-alley-buildings">
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, -16]}>
          {/* Building body */}
          <mesh castShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.95} />
          </mesh>
          {/* Mansard roof */}
          <mesh position={[0, b.h / 2 + 0.3, 0]}>
            <boxGeometry args={[b.w, 0.6, b.d]} />
            <meshStandardMaterial color="#3A3A48" roughness={0.85} />
          </mesh>
          {/* Lit windows */}
          {Array.from({ length: Math.floor(b.h / 1.6) }, (_, row) =>
            [-0.7, 0, 0.7].filter(wx => Math.abs(wx) < b.w * 0.4).map((wx, col) => (
              <mesh key={`${row}-${col}`} position={[wx, -b.h / 2 + row * 1.4 + 1.0, b.d / 2 + 0.01]}>
                <boxGeometry args={[0.22, 0.34, 0.02]} />
                <meshStandardMaterial
                  color="#FFF8D0"
                  emissive="#FF9500"
                  emissiveIntensity={0.3}
                  roughness={0.2}
                />
              </mesh>
            ))
          )}
        </group>
      ))}
      {/* Small bistro awning on one building */}
      <mesh position={[-2, 1.5, -14.8]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[3.0, 0.06, 1.2]} />
        <meshStandardMaterial color="#8B1A1A" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Garden courtyard visible through the left wall windows.
 */
function GardenCourtyard() {
  return (
    <group name="garden-courtyard">
      {/* Trees */}
      {[-4, 0, 4].map((z, i) => (
        <group key={i} position={[-14, 0, z]}>
          {/* Trunk */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 2.4, 8]} />
            <meshStandardMaterial color="#3D2810" roughness={0.8} />
          </mesh>
          {/* Canopy */}
          <mesh position={[0, 3.0, 0]}>
            <sphereGeometry args={[1.0, 12, 12]} />
            <meshStandardMaterial
              color="#1A3A12"
              roughness={0.9}
              emissive="#0A1A08"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Garden fairy lights (string lights between trees) */}
      {[-2, 2].map((z, i) => (
        <group key={`lights-${i}`}>
          {Array.from({ length: 6 }, (_, j) => (
            <mesh key={j} position={[-13 + j * 0.4, 3.5 + Math.sin(j * 0.8) * 0.2, z]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshStandardMaterial
                color="#FFE4B5"
                emissive="#FFD700"
                emissiveIntensity={1.5}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Garden bench */}
      <group position={[-12.5, 0, -2]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.4]} />
          <meshStandardMaterial color="#5C3D1E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.55, -0.18]}>
          <boxGeometry args={[1.2, 0.5, 0.04]} />
          <meshStandardMaterial color="#5C3D1E" roughness={0.7} />
        </mesh>
        {[[-0.5, 0], [0.5, 0]].map(([x, z], j) => (
          <mesh key={j} position={[x, 0.17, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.34, 6]} />
            <meshStandardMaterial color="#2A1A08" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Stone pathway */}
      {[-3, -1, 1, 3].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-11.5, 0.01, z]}>
          <circleGeometry args={[0.4, 8]} />
          <meshStandardMaterial color="#888880" roughness={0.95} />
        </mesh>
      ))}

      {/* Garden wall with ivy */}
      <mesh position={[-17, 2.0, 0]}>
        <boxGeometry args={[0.3, 4.0, 16]} />
        <meshStandardMaterial color="#A09080" roughness={0.95} />
      </mesh>
    </group>
  );
}
