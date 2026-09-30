import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import GlassArchitecture, { BackdropGradient } from '../three/GlassArchitecture.jsx';

/**
 * Scene3D - the isolated WebGL layer.
 *
 * Owns exactly three responsibilities:
 *   1. Canvas configuration (adaptive DPR, MSAA budget, opaque background that
 *      matches the Apple theme so the transmission pass has something to bend).
 *   2. The lighting rig, which smoothly interpolates every light, the
 *      environment intensity and the tone-mapping exposure between Apple Light
 *      Mode (#F5F5F7) and Dark Mode (#000000) - never a hard cut.
 *   3. The camera rig, which reads scroll position from ScrollController and
 *      drives a keyframed dolly + subtle native-pointer tilt.
 *
 * Strict interaction constraint: there are no cursor trails, no pointer shadows
 * and no mouse-following particles anywhere in this file. The only pointer
 * input is a passive window listener that normalises clientX/clientY into a
 * gentle parallax on the camera.
 */

const LIGHT_BACKGROUND = '#F5F5F7';
const DARK_BACKGROUND = '#000000';

/* Key light: warm-neutral in light mode, cool and dimmer in dark mode. */
const KEY_LIGHT_LIGHT = new THREE.Color('#FFF4E4');
const KEY_LIGHT_DARK = new THREE.Color('#C3D6FF');

/* Camera keyframes, indexed by "story position" (section index + local
   progress). The rig eases between them, so the camera is always drifting. */
const CAMERA_KEYS = [
  { at: 0, position: [0, 0.12, 6.6], fov: 32 },
  { at: 1, position: [1.35, 0.5, 5.2], fov: 34 },
  { at: 2, position: [-1.25, -0.34, 4.7], fov: 36 },
  { at: 3, position: [0.24, 0.2, 4.9], fov: 33 },
  { at: 4, position: [0, 0.52, 5.6], fov: 31 },
];

const lerp = THREE.MathUtils.lerp;
const smoothStep = (t) => t * t * (3 - 2 * t);

function sampleKeys(keys, value) {
  if (value <= keys[0].at) return keys[0];
  const last = keys[keys.length - 1];
  if (value >= last.at) return last;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (value >= a.at && value <= b.at) {
      const t = smoothStep((value - a.at) / (b.at - a.at));
      return {
        position: [
          lerp(a.position[0], b.position[0], t),
          lerp(a.position[1], b.position[1], t),
          lerp(a.position[2], b.position[2], t),
        ],
        fov: lerp(a.fov, b.fov, t),
      };
    }
  }
  return last;
}

/**
 * Passive, normalised pointer coordinates. Deliberately window-level and
 * passive: the canvas stays `pointer-events: none`, so the 3D layer can never
 * swallow a click, a drag, selection or an inertial touch scroll.
 */
function useScenePointer(enabled) {
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!enabled) return undefined;

    const handleMove = (event) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      pointer.current.targetX = (event.clientX / innerWidth) * 2 - 1;
      pointer.current.targetY = (event.clientY / innerHeight) * 2 - 1;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [enabled]);

  return pointer;
}

/* ------------------------------------------------------------------- lights */

function LightingRig({ isDark, environmentResolution }) {
  const { gl, scene } = useThree();

  const ambient = useRef(null);
  const key = useRef(null);
  const rim = useRef(null);
  const bounce = useRef(null);

  const blend = useRef(isDark ? 1 : 0);
  const target = useRef(isDark ? 1 : 0);

  /* Three colours allocated once: the two endpoints and the live blend. The
     blend is mutated in place every frame - allocating colours inside useFrame
     would hand the GC a job it should never have. */
  const lightBackground = useMemo(() => new THREE.Color(LIGHT_BACKGROUND), []);
  const darkBackground = useMemo(() => new THREE.Color(DARK_BACKGROUND), []);
  const backgroundColor = useMemo(() => new THREE.Color(LIGHT_BACKGROUND), []);

  useEffect(() => {
    scene.background = backgroundColor;
    return () => {
      if (scene.background === backgroundColor) scene.background = null;
    };
  }, [scene, backgroundColor]);

  useEffect(() => {
    target.current = isDark ? 1 : 0;
  }, [isDark]);

  useFrame((_, delta) => {
    /* One shared theme blend keeps lights, environment and exposure in step. */
    blend.current = THREE.MathUtils.damp(blend.current, target.current, 2.6, delta);
    const d = blend.current;

    if (ambient.current) ambient.current.intensity = lerp(0.62, 0.3, d);

    if (key.current) {
      key.current.intensity = lerp(2.35, 1.4, d);
      key.current.color.copy(KEY_LIGHT_LIGHT).lerp(KEY_LIGHT_DARK, d);
    }

    /* Cool rim separating the silhouette from the background. */
    if (rim.current) rim.current.intensity = lerp(1.15, 2.05, d);
    if (bounce.current) bounce.current.intensity = lerp(0.5, 0.22, d);

    /* Environment exposure + tone mapping - the "adaptive 3D lighting" contract. */
    scene.environmentIntensity = lerp(1.05, 0.66, d);
    gl.toneMappingExposure = lerp(1, 1.16, d);

    /* The canvas background cross-fades with the theme, so the opaque layer the
       glass refracts is always the same colour the CSS page would have been. */
    backgroundColor.copy(lightBackground).lerp(darkBackground, d);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.62} />
      <directionalLight ref={key} position={[4.2, 6, 5]} intensity={2.35} />
      <directionalLight ref={rim} position={[-5, 2.4, -4.5]} intensity={1.15} color="#2997FF" />
      <directionalLight ref={bounce} position={[0, -4.5, 3]} intensity={0.5} color="#FFFFFF" />

      {/*
        A procedural studio instead of a CDN HDRI (`preset="city"`).
        Two reasons: it keeps the build fully offline (no runtime network fetch),
        and a baked HDRI cannot be re-exposed per theme - which the brief
        explicitly requires. Bake once (frames={1}), then animate
        `scene.environmentIntensity` above.
      */}
      <Environment resolution={environmentResolution} frames={1} background={false}>
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#FFFFFF"
          position={[0, 4.6, 2.2]}
          scale={[9, 4, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          color="#DCE9FF"
          position={[-4.6, 1.2, 1.6]}
          scale={[5, 3, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.35}
          color="#FFE7CB"
          position={[4.8, -1.1, 1.2]}
          scale={[4.5, 2.6, 1]}
          rotation={[0, -Math.PI / 3, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2.1}
          color="#8FC4FF"
          position={[-1.6, -3.4, -3.2]}
          scale={3}
        />
        <Lightformer form="circle" intensity={0.9} color="#FFFFFF" position={[2.4, 3.2, -3.6]} scale={2.2} />
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------- camera */

function CameraRig({ sceneSection, sceneLocal, pointerRef, enableTilt, reducedMotion }) {
  const camera = useThree((state) => state.camera);
  const story = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });

  const desired = useMemo(() => new THREE.Vector3(0, 0.12, 6.6), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const lastFov = useRef(CAMERA_KEYS[0].fov);

  useFrame((_, delta) => {
    const rawStory = THREE.MathUtils.clamp(sceneSection.get(), 0, 4) + THREE.MathUtils.clamp(sceneLocal.get(), 0, 1);

    /* Reduced motion still travels the same path, it just arrives sooner and
       without the long glide. */
    story.current = THREE.MathUtils.damp(story.current, rawStory, reducedMotion ? 8 : 2.2, delta);

    const keyframe = sampleKeys(CAMERA_KEYS, story.current);
    desired.set(keyframe.position[0], keyframe.position[1], keyframe.position[2]);

    if (enableTilt) {
      tilt.current.x = THREE.MathUtils.damp(tilt.current.x, pointerRef.current.targetX, 2, delta);
      tilt.current.y = THREE.MathUtils.damp(tilt.current.y, pointerRef.current.targetY, 2, delta);
      desired.x += tilt.current.x * 0.34;
      desired.y += -tilt.current.y * 0.2;
    }

    /* Frame-rate independent approach: reaches the keyframe in ~0.4s at any fps. */
    const alpha = reducedMotion ? 1 : 1 - Math.pow(0.0018, delta);
    camera.position.lerp(desired, alpha);

    const nextFov = THREE.MathUtils.damp(camera.fov, keyframe.fov, 2.4, delta);
    if (Math.abs(nextFov - lastFov.current) > 0.0005) {
      camera.fov = nextFov;
      lastFov.current = nextFov;
      camera.updateProjectionMatrix();
    }

    lookTarget.set(0, 0, 0);
    if (enableTilt) {
      lookTarget.x += tilt.current.x * 0.12;
      lookTarget.y += -tilt.current.y * 0.08;
    }
    camera.lookAt(lookTarget);
  });

  return null;
}

/**
 * In `frameloop="demand"` nothing renders unless we ask. This bridge asks on
 * every scroll-driven change so reduced-motion users still see an updated
 * frame, without paying for a permanent loop.
 */
function DemandInvalidator({ motionValues }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const unsubscribes = motionValues.map((value) =>
      typeof value.on === 'function' ? value.on('change', () => invalidate()) : null
    );
    invalidate();
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe?.());
  }, [motionValues, invalidate]);

  return null;
}

/* -------------------------------------------------------------------- canvas */

export default function Scene3D({
  tier,
  isDark,
  reducedMotion,
  frameloop,
  enableTilt,
  sceneSection,
  sceneLocal,
  sceneOpen,
  sceneOffsetX,
  onFailure,
}) {
  const pointerRef = useScenePointer(enableTilt);

  const motionValues = useMemo(
    () => [sceneSection, sceneLocal, sceneOpen, sceneOffsetX],
    [sceneOffsetX, sceneLocal, sceneOpen, sceneSection]
  );

  const handleCreated = ({ gl, scene }) => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    /* Transmission is the most expensive pass in the scene - halve its
       resolution when the tier does not need pixel-perfect refraction. */
    if ('transmissionResolutionScale' in gl) {
      gl.transmissionResolutionScale = tier.transmission ? 1 : 0.5;
    }
    scene.background = new THREE.Color(isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND);

    /* Losing the GPU mid-scroll must not leave a black rectangle behind. */
    gl.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      onFailure?.('webgl-context-lost');
    });
  };

  return (
    <Canvas
      dpr={[1, tier.maxDpr]}
      frameloop={frameloop}
      camera={{ fov: 32, position: [0, 0.12, 6.6], near: 0.1, far: 60 }}
      gl={{
        antialias: tier.antialias,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', touchAction: 'auto' }}
      onCreated={handleCreated}
    >
      <Suspense fallback={null}>
        <LightingRig isDark={isDark} environmentResolution={tier.environmentResolution} />
        <BackdropGradient isDark={isDark} />
        <GlassArchitecture
          tier={tier.tier}
          isDark={isDark}
          reducedMotion={reducedMotion}
          sceneOpen={sceneOpen}
          sceneLocal={sceneLocal}
          sceneSection={sceneSection}
          sceneOffsetX={sceneOffsetX}
        />
        <CameraRig
          sceneSection={sceneSection}
          sceneLocal={sceneLocal}
          pointerRef={pointerRef}
          enableTilt={enableTilt}
          reducedMotion={reducedMotion}
        />
        {frameloop === 'demand' && <DemandInvalidator motionValues={motionValues} />}
      </Suspense>
    </Canvas>
  );
}