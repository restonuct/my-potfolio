import React, { Suspense, lazy, useEffect, useState } from 'react';
import { TIER_NONE } from '../lib/deviceTier.js';
import { useDeferredMount, useDeviceTier, useDocumentVisible } from '../lib/hooks.js';
import { useScrollStage } from './ScrollController.jsx';

/**
 * SceneBackdrop - the fixed, non-blocking WebGL layer behind the whole story.
 *
 * Responsibilities:
 *   - lazy-load the three.js chunk off the critical path (React.lazy + idle),
 *   - choose the frame loop: 'always' while reading the story, 'never' when the
 *     tab is hidden or the story is finished, 'demand' for reduced-motion users,
 *   - never block the page: the layer is pointer-events-none, so scrolling,
 *     selection, drag and touch inertia all behave exactly as before,
 *   - degrade to a pure-CSS rendition of the same composition when there is no
 *     WebGL, the context is lost, or the three.js tree throws.
 */

const Scene3D = lazy(() => import('./Scene3D.jsx'));

class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('[SceneBackdrop] 3D layer disabled after an error:', error?.message || error);
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Theme-aware, asset-free stand-in for the 3D module. */
function StaticFallback({ isDark }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative -mt-[16vh] h-[46vmin] w-[46vmin] sm:h-[52vmin] sm:w-[52vmin]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 148deg, rgba(255,255,255,0.92), rgba(0,113,227,0.38) 26%, rgba(140,146,160,0.46) 52%, rgba(255,255,255,0.72) 78%, rgba(255,255,255,0.92))',
            boxShadow: isDark
              ? 'inset 0 1px 0 rgba(255,255,255,0.22), 0 60px 140px -60px rgba(41,151,255,0.42)'
              : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 50px 120px -60px rgba(0,0,0,0.28)',
            opacity: isDark ? 0.42 : 0.85,
          }}
        />
        <div
          className="absolute -inset-[18%] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(41,151,255,0.22), transparent 62%)'
              : 'radial-gradient(circle, rgba(0,113,227,0.16), transparent 64%)',
          }}
        />
      </div>
    </div>
  );
}

export default function SceneBackdrop({ isDark }) {
  const capability = useDeviceTier();
  const { sceneLocal, sceneOffsetX, sceneOpen, sceneSection, storyComplete } = useScrollStage();
  const deferredReady = useDeferredMount(1400);
  const documentVisible = useDocumentVisible();
  const [failure, setFailure] = useState(null);

  const webglAvailable = capability.tier !== TIER_NONE && !failure;

  const frameloop = !documentVisible || storyComplete
    ? 'never'
    : capability.reducedMotion
      ? 'demand'
      : 'always';

  const live = webglAvailable && deferredReady;
  const enableTilt = webglAvailable && !capability.isCoarsePointer && !capability.reducedMotion;

  /* Lets the stylesheet relax expensive backdrop blurs while a WebGL surface is
     compositing underneath - a documented, measurable win on mid-tier GPUs. */
  useEffect(() => {
    const root = document.documentElement;
    if (live) root.setAttribute('data-webgl', 'on');
    else root.removeAttribute('data-webgl');
    return () => root.removeAttribute('data-webgl');
  }, [live]);

  useEffect(() => {
    if (import.meta.env?.DEV) {
      console.info(
        '[SceneBackdrop] tier=%s reason=%s webgl=%s reducedMotion=%s tilt=%s',
        capability.tier,
        capability.reason,
        capability.webgl,
        capability.reducedMotion,
        enableTilt
      );
    }
  }, [capability.tier, capability.reason, capability.webgl, capability.reducedMotion, enableTilt]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* WebGL layer - fades in only once the chunk is parsed and a context exists. */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          live ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {live && (
          <SceneErrorBoundary fallback={<StaticFallback isDark={isDark} />}>
            <Suspense fallback={null}>
              <Scene3D
                tier={capability}
                isDark={isDark}
                reducedMotion={capability.reducedMotion}
                frameloop={frameloop}
                enableTilt={enableTilt}
                sceneSection={sceneSection}
                sceneLocal={sceneLocal}
                sceneOpen={sceneOpen}
                sceneOffsetX={sceneOffsetX}
                onFailure={(reason) => setFailure(reason)}
              />
            </Suspense>
          </SceneErrorBoundary>
        )}
      </div>

      {/* Static composition: loading poster, and the permanent fallback. */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          live ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <StaticFallback isDark={isDark} />
      </div>
    </div>
  );
}