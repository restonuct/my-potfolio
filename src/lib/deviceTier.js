/**
 * Device capability detection for the WebGL storytelling layer.
 *
 * The portfolio must remain fully usable when there is no GPU, when the OS asks
 * for reduced motion, or on low-tier phones. Every consumer of this module
 * degrades gracefully instead of assuming a capable device.
 *
 * QA escape hatches (documented in README.md):
 *   ?quality=high | low | off   - force a specific rendering tier
 */

export const TIER_HIGH = 'high';
export const TIER_LOW = 'low';
export const TIER_NONE = 'none';

const isBrowser = typeof window !== 'undefined';

function matches(query) {
  if (!isBrowser || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(query).matches;
}

/** Probes for a real WebGL context (detection only - the context is released). */
export function detectWebGLSupport() {
  if (!isBrowser) return false;
  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!context) return false;
    const loseContext = context.getExtension('WEBGL_lose_context');
    if (loseContext) loseContext.loseContext();
    return true;
  } catch {
    return false;
  }
}

function readQualityOverride() {
  if (!isBrowser) return null;
  try {
    const value = new URLSearchParams(window.location.search).get('quality');
    return value === 'high' || value === 'low' || value === 'off' ? value : null;
  } catch {
    return null;
  }
}

export function prefersReducedMotion() {
  return matches('(prefers-reduced-motion: reduce)');
}

/**
 * Resolves a rendering tier plus the concrete budgets that go with it.
 * Consumers should read `tier` for branching and the individual budgets for
 * configuring the Canvas and the mesh assembly.
 */
export function detectDeviceTier() {
  const override = readQualityOverride();
  const reducedMotion = prefersReducedMotion();
  const isCoarsePointer = matches('(pointer: coarse)');
  const webgl = detectWebGLSupport();

  if (!webgl || override === 'off') {
    return {
      tier: TIER_NONE,
      webgl,
      reducedMotion,
      isCoarsePointer,
      maxDpr: 1,
      antialias: false,
      transmission: false,
      environmentResolution: 0,
      panelCount: 0,
      reason: webgl ? 'forced-off' : 'no-webgl',
    };
  }

  const cores = (isBrowser && navigator.hardwareConcurrency) || 4;
  const memory = (isBrowser && navigator.deviceMemory) || 4;
  const lowPower = override === 'low' || isCoarsePointer || cores <= 4 || memory <= 4;

  if (lowPower) {
    return {
      tier: TIER_LOW,
      webgl,
      reducedMotion,
      isCoarsePointer,
      maxDpr: 1.5,
      /* MSAA is the first thing to go on mobile - fill rate is the bottleneck. */
      antialias: false,
      transmission: false,
      environmentResolution: 128,
      panelCount: 4,
      reason: override === 'low' ? 'forced-low' : 'low-power-device',
    };
  }

  return {
    tier: TIER_HIGH,
    webgl,
    reducedMotion,
    isCoarsePointer,
    maxDpr: 2,
    antialias: true,
    transmission: true,
    environmentResolution: 256,
    panelCount: 8,
    reason: 'capable-device',
  };
}