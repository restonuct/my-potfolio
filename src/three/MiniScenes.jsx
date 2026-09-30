import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// MiniScenes - deliberately small procedural vignettes used as the live
// previews on project cards and inside the expanded project modal.
//
// Budget rules (these render four-at-a-time on the projects grid):
//   - no textures, no transmission, no environment map, no shadows,
//   - a few hundred triangles per scene, flat meshStandardMaterial only,
//   - the canvas stays pointer-events: none and only animates while the card
//     is hovered or focused; otherwise it renders a single poster frame.

/* ------------------------------------------------------------ Ganesan Run */

function RunnerScene({ accent = '#FFB340' }) {
  const runner = useRef(null);
  const coins = useRef([]);
  const markers = useRef([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (runner.current) {
      // A jump arc, not a sine wobble - reads as gameplay at a glance.
      const cycle = (t * 1.35) % 1;
      const arc = Math.sin(Math.min(1, cycle * 1.6) * Math.PI);
      runner.current.position.y = 0.34 + Math.max(0, arc) * 0.46;
      runner.current.rotation.z = Math.sin(t * 3.2) * 0.1;
    }

    coins.current.forEach((coin, index) => {
      if (!coin) return;
      const travel = (t * 0.9 + index * 0.34) % 1;
      coin.position.z = 1.7 - travel * 3.6;
      coin.position.y = 0.62 + Math.sin((t + index) * 2.1) * 0.1;
      coin.rotation.y += delta * 3.2;
    });

    markers.current.forEach((marker, index) => {
      if (!marker) return;
      const travel = (t * 1.5 + index * 0.25) % 1;
      marker.position.z = 1.9 - travel * 3.9;
    });
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 9]} />
        <meshStandardMaterial color="#2A2E39" roughness={0.6} metalness={0.25} />
      </mesh>

      {[-1.18, 1.18].map((x) => (
        <mesh key={`edge-${x}`} position={[x, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 9]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
        </mesh>
      ))}

      {[0, 1, 2, 3, 4].map((index) => (
        <mesh
          key={`marker-${index}`}
          ref={(el) => {
            markers.current[index] = el;
          }}
          position={[0, 0.04, 1.9 - index * 0.85]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.075, 0.42]} />
          <meshStandardMaterial color="#F5F5F7" opacity={0.34} transparent />
        </mesh>
      ))}

      {/* Runner */}
      <group ref={runner} position={[0, 0.34, 0.15]}>
        <mesh position={[0, 0.18, 0]}>
          <capsuleGeometry args={[0.15, 0.3, 6, 14]} />
          <meshStandardMaterial color="#F7F8FA" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <sphereGeometry args={[0.115, 14, 14]} />
          <meshStandardMaterial color={accent} roughness={0.35} />
        </mesh>
      </group>

      {/* Collectibles */}
      {[0, 1, 2].map((index) => (
        <mesh
          key={`coin-${index}`}
          ref={(el) => {
            coins.current[index] = el;
          }}
          position={[index % 2 === 0 ? -0.42 : 0.42, 0.62, 1.2 - index * 1.1]}
        >
          <torusGeometry args={[0.13, 0.045, 8, 18]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.55}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ B.A.D.I. */

function AiScene({ accent = '#2E7DFF' }) {
  const shell = useRef(null);
  const core = useRef(null);
  const nodes = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.34;
      shell.current.rotation.x = Math.sin(t * 0.5) * 0.14;
    }
    if (nodes.current) nodes.current.rotation.y -= delta * 0.5;
    if (core.current) {
      core.current.scale.setScalar(0.82 + Math.sin(t * 1.9) * 0.08);
      core.current.material.emissiveIntensity = 1.1 + Math.sin(t * 1.9) * 0.45;
    }
  });

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color={accent}
          wireframe
          emissive={accent}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2}
          roughness={0.28}
          metalness={0.35}
        />
      </mesh>

      <group ref={nodes} rotation={[0.2, 0, 0.12]}>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          const radius = 1.32;
          return (
            <mesh
              key={`node-${index}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(index * 1.9) * 0.24,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.055, 10, 10]} />
              <meshStandardMaterial
                color="#5AC8FA"
                emissive="#5AC8FA"
                emissiveIntensity={1.5}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>

      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.5, 0.012, 6, 72]} />
        <meshStandardMaterial color="#9AA3B2" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------- Student Grade Calculator */

function GradesScene({ accent = '#34C759' }) {
  const bars = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    bars.current.forEach((bar, index) => {
      if (!bar) return;
      const base = 0.45 + index * 0.34;
      const animated = base + Math.sin(t * 1.4 + index * 0.7) * 0.07;
      bar.scale.y = animated;
      bar.position.y = animated / 2 - 0.62;
    });
  });

  return (
    <group>
      {/* Baseline plinth */}
      <mesh position={[0, -0.66, 0]}>
        <boxGeometry args={[2.5, 0.06, 0.7]} />
        <meshStandardMaterial color="#9AA3B2" metalness={0.85} roughness={0.28} />
      </mesh>

      {[0, 1, 2, 3, 4].map((index) => (
        <mesh
          key={`bar-${index}`}
          ref={(el) => {
            bars.current[index] = el;
          }}
          position={[-0.96 + index * 0.48, 0, 0]}
        >
          <boxGeometry args={[0.3, 1, 0.42]} />
          <meshStandardMaterial
            color={index >= 3 ? accent : '#F0F1F4'}
            emissive={index >= 3 ? accent : '#000000'}
            emissiveIntensity={index >= 3 ? 0.28 : 0}
            roughness={0.32}
            metalness={0.35}
          />
        </mesh>
      ))}

      {/* Grade badge ring */}
      <mesh position={[0.72, 0.82, 0.1]} rotation={[0.4, 0.6, 0]}>
        <torusGeometry args={[0.2, 0.035, 8, 24]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------ Voting Eligibility Verification */

function VoteScene({ accent = '#2E7DFF' }) {
  const scan = useRef(null);
  const ring = useRef(null);
  const check = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (scan.current) {
      scan.current.position.y = 0.5 - ((t * 0.7) % 1);
    }
    if (ring.current) ring.current.rotation.z += delta * 0.6;
    if (check.current) {
      check.current.position.y = 0.02 + Math.sin(t * 1.7) * 0.05;
      check.current.material.emissiveIntensity = 0.9 + Math.sin(t * 2.2) * 0.35;
    }
  });

  return (
    <group>
      {/* Ballot body */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.92, 1.1, 0.34]} />
        <meshStandardMaterial color="#EDEFF3" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Verified check */}
      <group ref={check} position={[0, 0.02, 0.19]}>
        <mesh position={[-0.07, -0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.09, 0.22, 0.06]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0.08, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.09, 0.38, 0.06]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1}
            roughness={0.35}
          />
        </mesh>
      </group>

      {/* Policy scan sweep */}
      <mesh ref={scan} position={[0, 0.3, 0.21]}>
        <planeGeometry args={[0.9, 0.05]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ring} position={[0, -0.05, -0.05]}>
        <torusGeometry args={[0.86, 0.014, 6, 64]} />
        <meshStandardMaterial color="#9AA3B2" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- registry */

export const MINI_SCENES = {
  runner: {
    Component: RunnerScene,
    accent: '#FFB340',
    camera: { position: [0, 1.05, 3.2], fov: 42 },
  },
  ai: {
    Component: AiScene,
    accent: '#2E7DFF',
    camera: { position: [0, 0.35, 3.4], fov: 40 },
  },
  grades: {
    Component: GradesScene,
    accent: '#34C759',
    camera: { position: [0, 0.5, 2.9], fov: 40 },
  },
  vote: {
    Component: VoteScene,
    accent: '#2E7DFF',
    camera: { position: [0, 0.15, 2.6], fov: 40 },
  },
};

/** Canvas wrapper shared by the card preview and the expanded modal view. */
export default function MiniScene({ sceneKey, isDark, active = false }) {
  const config = MINI_SCENES[sceneKey] ?? MINI_SCENES.ai;
  const Scene = config.Component;

  return (
    <Canvas
      dpr={[1, 1.5]}
      /* One poster frame when idle, a real loop only while hovered/focused. */
      frameloop={active ? 'always' : 'demand'}
      camera={{ position: config.camera.position, fov: config.camera.fov, near: 0.1, far: 30 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power', stencil: false }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', touchAction: 'auto' }}
    >
      <ambientLight intensity={isDark ? 0.55 : 0.95} />
      <directionalLight position={[2.6, 4, 3]} intensity={isDark ? 1.8 : 2.2} />
      <directionalLight position={[-3, -1.4, -2]} intensity={0.65} color="#5AC8FA" />
      <Scene accent={config.accent} />
    </Canvas>
  );
}