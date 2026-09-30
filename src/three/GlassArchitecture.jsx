import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { TIER_HIGH } from '../lib/deviceTier.js';

/**
 * GlassArchitecture - the abstract hardware module that carries the storyline.
 *
 * It is deliberately asset-free (no GLB, no HDR fetch): every surface is
 * procedurally generated so the scene boots instantly, works offline and stays
 * themeable. The shell is a physical glass material (transmission 0.95,
 * roughness 0.1, clearcoat) wrapped around a machined metallic core, six
 * swappable module panels and an orbital sensor ring.
 *
 * Motion is driven entirely by the motion values published by
 * ScrollController. We read them with `.get()` inside useFrame and damp toward
 * them, which means:
 *   - zero React re-renders while scrolling (no reconciliation cost),
 *   - section changes glide instead of snapping, even on a trackpad flick,
 *   - reduced-motion users get the same poses but without idle spin.
 */

/* Pose per story section: hero -> projects -> skills -> about -> contact.
   The 3D subject reconfigures and re-stages itself to match section content. */
const SECTION_POSES = [
  /* Hero: lifted and slightly smaller so the intact shell frames the headline
     instead of competing with it for contrast. */
  { spin: 0.22, tiltX: 0.05, tiltZ: 0, scale: 0.92, glow: 0.6, offsetXScale: 1, offsetY: 0.42 },
  { spin: 0.52, tiltX: -0.03, tiltZ: 0.05, scale: 0.92, glow: 0.85, offsetXScale: 1, offsetY: 0.04 },
  { spin: 0.86, tiltX: 0.11, tiltZ: -0.07, scale: 0.98, glow: 1, offsetXScale: 1, offsetY: -0.04 },
  { spin: 0.3, tiltX: 0.02, tiltZ: 0.02, scale: 0.84, glow: 0.85, offsetXScale: 0.5, offsetY: 0.12 },
  { spin: 0.42, tiltX: 0.04, tiltZ: 0.01, scale: 0.7, glow: 0.7, offsetXScale: 0.4, offsetY: 0.85 },
];

const ACCENT = '#2E7DFF';
const ACCENT_SOFT = '#5AC8FA';
const WARM = '#FFB340';

const lerp = THREE.MathUtils.lerp;

/** Resolves a pose for a fractional section index (smooth section blending). */
function poseAt(poses, index) {
  const max = poses.length - 1;
  const clamped = THREE.MathUtils.clamp(index, 0, max);
  const lower = Math.floor(clamped);
  const upper = Math.min(max, lower + 1);
  const t = clamped - lower;
  const a = poses[lower];
  const b = poses[upper];
  if (t === 0 || a === b) return a;
  return {
    spin: lerp(a.spin, b.spin, t),
    tiltX: lerp(a.tiltX, b.tiltX, t),
    tiltZ: lerp(a.tiltZ, b.tiltZ, t),
    scale: lerp(a.scale, b.scale, t),
    glow: lerp(a.glow, b.glow, t),
    offsetXScale: lerp(a.offsetXScale, b.offsetXScale, t),
    offsetY: lerp(a.offsetY, b.offsetY, t),
  };
}

/** Theme blend 0 (light) -> 1 (dark), animated so the transition is never a cut. */
function useThemeBlend(isDark) {
  const target = useRef(isDark ? 1 : 0);
  const blend = useRef(isDark ? 1 : 0);

  useEffect(() => {
    target.current = isDark ? 1 : 0;
  }, [isDark]);

  return { blend, target };
}

/* ------------------------------------------------------------------ backdrop */

/**
 * A soft radial "light pool" the glass can actually refract. Without a backdrop
 * the transmission pass has nothing to sample and glass reads as flat black.
 * The gradient fades to alpha 0 at the edges so it dissolves into the scene
 * background instead of showing as a rectangle.
 */
export function BackdropGradient({ isDark }) {
  const { blend, target } = useThemeBlend(isDark);
  const material = useRef(null);

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    if (isDark) {
      gradient.addColorStop(0, 'rgba(96, 118, 158, 0.5)');
      gradient.addColorStop(0.35, 'rgba(44, 54, 74, 0.32)');
      gradient.addColorStop(0.72, 'rgba(16, 18, 24, 0.12)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(0.4, 'rgba(240, 242, 247, 0.6)');
      gradient.addColorStop(0.75, 'rgba(224, 228, 238, 0.22)');
      gradient.addColorStop(1, 'rgba(245, 245, 247, 0)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    return canvasTexture;
  }, [isDark]);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((_, delta) => {
    blend.current = THREE.MathUtils.damp(blend.current, target.current, 3, delta);
    if (material.current) {
      /* Dark mode keeps more of the pool visible so glass still has contrast. */
      material.current.opacity = lerp(0.82, 1, blend.current);
    }
  });

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -5.2]} scale={[17, 11, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={material}
        map={texture}
        transparent
        opacity={0.9}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ----------------------------------------------------------------- materials */

function GlassShellMaterial({ tier }) {
  const isLow = tier !== TIER_HIGH;

  /* Low tier trades optical refraction for a cheap, still-premium clearcoat
     finish: transmission costs an entire extra render pass. */
  if (isLow) {
    return (
      <meshPhysicalMaterial
        color="#D9DCE3"
        metalness={0.72}
        roughness={0.24}
        clearcoat={1}
        clearcoatRoughness={0.16}
        envMapIntensity={1.1}
        side={THREE.FrontSide}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      color="#FFFFFF"
      metalness={0}
      roughness={0.1}
      transmission={0.95}
      thickness={1.25}
      ior={1.5}
      clearcoat={1}
      clearcoatRoughness={0.08}
      envMapIntensity={1.5}
      specularIntensity={1}
      attenuationColor="#DCE6FF"
      attenuationDistance={4.5}
      side={THREE.DoubleSide}
    />
  );
}

function MetalMaterial({ color = '#C9CCD4', roughness = 0.22, envMapIntensity = 1.2 }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.96}
      roughness={roughness}
      envMapIntensity={envMapIntensity}
    />
  );
}

/* -------------------------------------------------------------------- module */

const SIDE_PANEL_COUNT = 6;

export default function GlassArchitecture({
  tier,
  isDark,
  reducedMotion,
  sceneOpen,
  sceneLocal,
  sceneSection,
  sceneOffsetX,
}) {
  const { viewport } = useThree();
  const isLow = tier !== TIER_HIGH;
  const panelCount = isLow ? 4 : SIDE_PANEL_COUNT;

  const root = useRef(null);
  const coreRef = useRef(null);
  const coreInsetRef = useRef(null);
  const panelRefs = useRef([]);
  const capRefs = useRef([]);
  const ringRefs = useRef([]);
  const nodesGroupRef = useRef(null);
  const instancedNodesRef = useRef(null);
  const ledRef = useRef(null);
  const glowRef = useRef(null);
  const cageRef = useRef(null);

  const idle = useRef(0);
  const smooth = useRef({
    section: 0,
    local: 0,
    open: 0,
    offsetX: 0,
    spin: 0,
    tiltX: 0,
    tiltZ: 0,
    scale: 1,
    glow: 0.6,
  });
  const { blend, target } = useThemeBlend(isDark);

  /* Panels are distributed around the vertical axis; the low tier gets a
     four-panel variant so the silhouette stays closed with fewer draws. */
  const panels = useMemo(
    () =>
      Array.from({ length: panelCount }, (_, index) => {
        const angle = (index / panelCount) * Math.PI * 2;
        return {
          angle,
          jitter: ((index % 3) - 1) * 0.06,
          twist: index % 2 === 0 ? 1 : -1,
        };
      }),
    [panelCount]
  );

  const nodeCount = isLow ? 0 : 24;
  const nodeMatrices = useMemo(() => {
    if (!nodeCount) return null;
    const dummy = new THREE.Object3D();
    const matrices = [];
    for (let i = 0; i < nodeCount; i += 1) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.62 + Math.sin(i * 1.7) * 0.05;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(i * 2.3) * 0.16, Math.sin(angle) * radius);
      const scale = 0.028 + (i % 4) * 0.006;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, [nodeCount]);

  /* Instance matrices must be written imperatively - R3F has no declarative
     equivalent for `setMatrixAt`, and re-rendering 24 transforms through React
     every frame would defeat the point of instancing. */
  useLayoutEffect(() => {
    const mesh = instancedNodesRef.current;
    if (!mesh || !nodeMatrices) return;
    nodeMatrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodeMatrices]);

  /* Responsive framing: on phones the world is ~1.9 units wide, so the module
     is scaled and lifted clear of the copy rather than clipped. */
  const framing = useMemo(() => {
    const width = viewport.width || 6;
    const narrow = width < 5.6;
    return {
      scale: narrow ? THREE.MathUtils.clamp(width / 5.4, 0.4, 1) : 1,
      xFactor: narrow ? 0.22 : 1,
      yOffset: narrow ? 0.72 : 0,
    };
  }, [viewport.width]);

  useFrame((state, delta) => {
    if (!root.current) return;

    const s = smooth.current;
    const pose = poseAt(SECTION_POSES, sceneSection.get());
    const local = sceneLocal.get();
    const open = sceneOpen.get();
    const offsetX = sceneOffsetX.get();
    const time = state.clock.elapsedTime;

    /* Damping constants: fast enough to feel attached to the scroll, slow enough
       to read as physical inertia. */
    s.section = THREE.MathUtils.damp(s.section, sceneSection.get(), 3.2, delta);
    s.local = THREE.MathUtils.damp(s.local, local, 3.4, delta);
    s.open = THREE.MathUtils.damp(s.open, open, 2.6, delta);
    s.offsetX = THREE.MathUtils.damp(s.offsetX, offsetX, 2.4, delta);
    s.spin = THREE.MathUtils.damp(s.spin, pose.spin, 2.4, delta);
    s.tiltX = THREE.MathUtils.damp(s.tiltX, pose.tiltX, 2.4, delta);
    s.tiltZ = THREE.MathUtils.damp(s.tiltZ, pose.tiltZ, 2.4, delta);
    s.scale = THREE.MathUtils.damp(s.scale, pose.scale * framing.scale, 2.6, delta);
    s.glow = THREE.MathUtils.damp(s.glow, pose.glow, 2.6, delta);
    blend.current = THREE.MathUtils.damp(blend.current, target.current, 3, delta);

    const darkness = blend.current;
    const opened = s.open;

    if (!reducedMotion) idle.current += delta * 0.055;

    root.current.rotation.y =
      s.spin * Math.PI * 0.45 + s.local * Math.PI * 0.6 + idle.current;
    root.current.rotation.x = s.tiltX + Math.sin(time * 0.18) * 0.02;
    root.current.rotation.z = s.tiltZ;
    root.current.position.x = s.offsetX * framing.xFactor;
    root.current.position.y = pose.offsetY * (framing.yOffset ? 0.4 : 1) + framing.yOffset;
    root.current.scale.setScalar(s.scale);

    /* --- shell panels: slide out along their own radial axis --- */
    const pristineRadius = 0.94;
    const radius = pristineRadius + opened * 1.05;
    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      const config = panels[index];
      if (!config) return;
      panel.position.set(
        Math.sin(config.angle) * radius,
        config.jitter * (1 + opened * 1.6),
        Math.cos(config.angle) * radius
      );
      panel.rotation.y = config.angle;
      panel.rotation.z = opened * config.twist * 0.14;
      panel.rotation.x = opened * config.jitter * 0.5;
    });

    /* --- top / bottom caps hinge away vertically --- */
    capRefs.current.forEach((cap, index) => {
      if (!cap) return;
      const direction = index === 0 ? 1 : -1;
      cap.position.y = direction * (0.74 + opened * 0.86);
      cap.rotation.x = Math.PI / 2;
      cap.rotation.z = opened * direction * 0.34;
    });

    /* --- machined core --- */
    if (coreRef.current) {
      const coreScale = 0.74 + opened * 0.42;
      coreRef.current.scale.setScalar(coreScale);
      coreRef.current.rotation.y += (0.16 + opened * 0.8) * delta;
      coreRef.current.rotation.x = Math.sin(time * 0.35) * 0.12;
    }

    if (coreInsetRef.current) {
      coreInsetRef.current.emissiveIntensity = (0.9 + opened * 2.6) * s.glow * lerp(1, 1.35, darkness);
    }

    if (cageRef.current) {
      cageRef.current.rotation.y -= 0.22 * delta;
      cageRef.current.scale.setScalar(0.86 + opened * 0.2);
    }

    /* --- orbital sensor ring --- */
    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;
      const ringScale = 1 + opened * (index === 0 ? 0.5 : 0.72);
      ring.scale.setScalar(ringScale);
      ring.rotation.z += (index === 0 ? 0.14 : -0.2) * delta;
    });

    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y += (0.05 + opened * 0.16) * delta;
      nodesGroupRef.current.scale.setScalar(1 + opened * 0.34);
    }

    /* --- status LED: dims while the shell is intact, flares when exposed --- */
    if (ledRef.current) {
      const pulse = 0.6 + Math.sin(time * 2.4) * 0.4;
      ledRef.current.emissiveIntensity = lerp(pulse * 1.1, 2.2 + pulse * 1.6, opened);
    }

    /* --- additive core bloom, only while the architecture is open --- */
    if (glowRef.current) {
      const material = glowRef.current.material;
      material.opacity = THREE.MathUtils.clamp(opened * 0.22 * (0.7 + s.glow), 0, 0.4);
      glowRef.current.scale.setScalar(0.75 + opened * 0.75);
      glowRef.current.rotation.y -= 0.12 * delta;
    }

  });

  return (
    <group ref={root}>
      {/* Interchangeable module panels */}
      {panels.map((config, index) => (
        <RoundedBox
          key={`panel-${index}`}
          ref={(el) => {
            panelRefs.current[index] = el;
          }}
          args={[1.02, 1.34, 0.11]}
          radius={0.045}
          smoothness={isLow ? 2 : 4}
          castShadow={false}
          receiveShadow={false}
          position={[Math.sin(config.angle) * 0.94, 0, Math.cos(config.angle) * 0.94]}
          rotation={[0, config.angle, 0]}
        >
          <GlassShellMaterial tier={tier} />
        </RoundedBox>
      ))}

      {/* End caps */}
      {[0, 1].map((index) => (
        <RoundedBox
          key={`cap-${index}`}
          ref={(el) => {
            capRefs.current[index] = el;
          }}
          args={[1.16, 1.16, 0.1]}
          radius={0.05}
          smoothness={isLow ? 2 : 4}
          position={[0, index === 0 ? 0.74 : -0.74, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <GlassShellMaterial tier={tier} />
        </RoundedBox>
      ))}

      {/* Machined core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.44, isLow ? 1 : 2]} />
        <MetalMaterial color={isDark ? '#6E7481' : '#B9BEC8'} roughness={0.18} />
      </mesh>

      <mesh ref={coreInsetRef} scale={0.78}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.2}
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Thermal spine cage */}
      <group ref={cageRef}>
        {[0, 1, 2].map((index) => (
          <mesh
            key={`spine-${index}`}
            rotation={[0, (index / 3) * Math.PI, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.012, 0.012, 1.5, 8]} />
            <MetalMaterial color="#8E929B" roughness={0.35} />
          </mesh>
        ))}
      </group>

      {/* Orbital sensor rings */}
      {[0, 1].map((index) => (
        <mesh
          key={`ring-${index}`}
          ref={(el) => {
            ringRefs.current[index] = el;
          }}
          rotation={[index === 0 ? Math.PI / 2 : Math.PI / 3, index === 0 ? 0 : 0.4, 0]}
        >
          <torusGeometry args={[1.3, 0.011, isLow ? 6 : 14, isLow ? 64 : 144]} />
          <meshStandardMaterial
            color={isDark ? '#7C8593' : '#AEB4BF'}
            metalness={1}
            roughness={0.24}
            envMapIntensity={1.4}
          />
        </mesh>
      ))}

      {/* Sensor nodes */}
      {nodeMatrices && (
        <group ref={nodesGroupRef} rotation={[0.16, 0, 0.08]}>
          <instancedMesh
            ref={instancedNodesRef}
            args={[undefined, undefined, nodeCount]}
            frustumCulled={false}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={ACCENT_SOFT}
              emissive={ACCENT_SOFT}
              emissiveIntensity={1.4}
              metalness={0.2}
              roughness={0.4}
            />
          </instancedMesh>
        </group>
      )}

      {/* Status LED */}
      <mesh position={[0.72, 0.82, 0.72]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          ref={ledRef}
          color={WARM}
          emissive={WARM}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Additive core bloom */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}