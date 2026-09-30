import React, { Suspense, lazy, useRef } from 'react';
import { TIER_NONE } from '../lib/deviceTier.js';
import { useDeviceTier, useInViewport } from '../lib/hooks.js';

const MiniScene = lazy(() => import('../three/MiniScenes.jsx'));

// ProjectPreview - the live canvas band on a project card.
//
// Three gates keep this cheap no matter how many cards are on screen:
//   1. capability gate - no WebGL, or reduced motion, renders a CSS poster,
//   2. viewport gate - the three.js chunk and the canvas only mount once the
//      card has actually been seen (rootMargin preloads just ahead of view),
//   3. interaction gate - the scene animates only while hovered or focused
//      (frameloop='always'); otherwise it holds a single poster frame.

export default function ProjectPreview({
  sceneKey,
  isDark,
  active = false,
  poster,
  className = '',
}) {
  const capability = useDeviceTier();
  const containerRef = useRef(null);
  const seen = useInViewport(containerRef, { rootMargin: '200px 0px', once: true });

  const canRenderCanvas = capability.tier !== TIER_NONE && !capability.reducedMotion;
  const showCanvas = canRenderCanvas && seen;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} aria-hidden="true">
      {/* The poster doubles as the loading state, so there is never an empty band. */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showCanvas ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {poster}
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showCanvas ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {showCanvas && (
          <Suspense fallback={null}>
            <MiniScene sceneKey={sceneKey} isDark={isDark} active={active} />
          </Suspense>
        )}
      </div>
    </div>
  );
}