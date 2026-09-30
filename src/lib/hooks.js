import { useEffect, useRef, useState } from 'react';
import { detectDeviceTier } from './deviceTier.js';

/**
 * Small, dependency-free hooks shared by the 3D layer and the sections that
 * feed it. Kept separate from the capability maths in ./deviceTier.js so the
 * detection logic stays pure and testable.
 */

/** Detects the rendering tier once per page load. */
export function useDeviceTier() {
  const [capability] = useState(() => detectDeviceTier());
  return capability;
}

/**
 * Viewport visibility, used to stop the render loop when the canvas scrolls
 * out of view. Defaults to `true` when IntersectionObserver is unavailable so
 * we never accidentally freeze the scene.
 */
export function useInViewport(ref, { rootMargin = '0px', threshold = 0.01, once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, once]);

  return inView;
}

/** True while the tab is visible - a hidden tab must never burn GPU cycles. */
export function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleChange = () => setVisible(document.visibilityState !== 'hidden');
    handleChange();
    document.addEventListener('visibilitychange', handleChange);
    return () => document.removeEventListener('visibilitychange', handleChange);
  }, []);

  return visible;
}

/**
 * Defers an expensive mount (the three.js chunk) until the browser is idle,
 * with a hard timeout so slow machines still get the scene - never blocking
 * the initial paint that the hero copy depends on.
 */
export function useDeferredMount(timeout = 1200) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers = [];
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      timers.push(['idle', window.requestIdleCallback(enable, { timeout })]);
    }
    timers.push(['timeout', window.setTimeout(enable, Math.min(timeout, 400))]);
    timers.push(['timeout', window.setTimeout(enable, timeout)]);

    return () => {
      cancelled = true;
      timers.forEach(([kind, handle]) => {
        if (kind === 'idle' && typeof window.cancelIdleCallback === 'function') {
          window.cancelIdleCallback(handle);
        } else {
          window.clearTimeout(handle);
        }
      });
    };
  }, [timeout]);

  return ready;
}

/** Convenience ref-based first-render flag for one-shot intro animations. */
export function useHasMounted() {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);
  return mounted;
}