import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

/**
 * ScrollController - the single source of truth for scroll orchestration.
 *
 * Why one authority: mixing Framer Motion scroll values with GSAP ScrollTrigger
 * gives you two independent ideas of "where the page is", which desyncs pinned
 * sections and double-fires under React 18 StrictMode. Native scroll + CSS
 * `sticky` + Framer Motion motion values gives the same Apple-grade pinned
 * scrubbing with zero scroll hijacking and no layout thrash.
 *
 * How the 3D storyline is linked to the DOM:
 *   1. Every story section carries `data-stage-section="<id>"` (see
 *      STORY_SECTIONS below) and the pinned beat track carries
 *      `data-story-beats`.
 *   2. On mount/resize/font-load we measure the pixel range each of those
 *      elements owns: [top - viewportHeight, top + height].
 *   3. On every scroll frame (no React re-render) we resolve which section the
 *      reader is in, how far through it they are, and how open the 3D shell
 *      should be, then publish that as motion values.
 *   4. The three.js scene damps toward those values inside `useFrame`, so
 *      section changes glide instead of snapping - even on fast flicks.
 *
 * If you ever want a GSAP ScrollTrigger pass instead, this file is the only
 * place that needs to change: swap the `useMotionValueEvent(scrollY, ...)`
 * handler for `ScrollTrigger.create({ onUpdate })` and keep `applyScroll`
 * writing into the same motion values.
 */

/** DOM order matters - indices are the 3D scene's pose keys. */
export const STORY_SECTIONS = ['hero', 'projects', 'skills', 'about', 'contact'];

/** The pinned, three-beat narrative showcasing Ganesan Run, B.A.D.I., and the developer journey. */
export const STORY_BEATS = [
  {
    id: 'ganesan',
    label: '01 — Ganesan Run 3D',
    title: 'High-speed browser game engine',
    body: 'A 3D endless runner engineered with Three.js and WebGL 2.0. Featuring procedural highway chunks, dynamic camera physics, and zero-asset procedural Web Audio frequency synthesis running at 60 FPS.',
  },
  {
    id: 'badi',
    label: '02 — B.A.D.I. AI Framework',
    title: 'Privacy-first autonomous intelligence',
    body: 'Balanced Autonomous Digital Intelligence — built on a local-first philosophy. Runs local LLM inference via llama.cpp and ChromaDB vector retrieval, protected by a strict human consent-gating policy.',
  },
  {
    id: 'journey',
    label: '03 — The Builder Journey',
    title: 'Foundations, problem solving & AI',
    body: 'Starting from core computer science foundations — Python, modern web standards, and computational mathematics — while harnessing AI tools to build, iterate, and deliver real software with high efficiency.',
  },
];

/** Horizontal staging of the 3D subject per story section, in world units. */
const SECTION_OFFSET_X = [0, 1.15, 1.3, 0, 0];

const PAGE_SPRING = { stiffness: 120, damping: 30, restDelta: 0.0005 };
const BEAT_OPEN_START = 0.08;
const BEAT_OPEN_SPAN = 0.72;

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Hermite ease - used so the subject starts sliding before the beats land. */
const smoothStep = (t) => t * t * (3 - 2 * t);

const ScrollStageContext = createContext(null);

export function ScrollControllerProvider({ children }) {
  const { scrollY, scrollYProgress } = useScroll();

  /* Published to the 3D scene. Motion values = zero re-renders while scrolling. */
  const sceneSection = useMotionValue(0);
  const sceneLocal = useMotionValue(0);
  const sceneOpen = useMotionValue(0);
  const sceneOffsetX = useMotionValue(0);
  const beatsProgress = useMotionValue(0);

  const boundsRef = useRef({ sections: [], beats: null });
  const [activeSection, setActiveSection] = useState(STORY_SECTIONS[0]);
  /* Flips once the reader is past the story - used to stop the render loop. */
  const [storyComplete, setStoryComplete] = useState(false);

  /* Smoothed page progress for the Dynamic Island indicator. */
  const pageProgress = useSpring(scrollYProgress, PAGE_SPRING);
  const scrollVelocity = useVelocity(scrollY);

  const applyScroll = useCallback(
    (y) => {
      const viewportHeight = window.innerHeight;
      const { sections, beats } = boundsRef.current;

      if (beats) {
        const span = Math.max(1, beats.exit - beats.enter);
        beatsProgress.set(clamp01((y - beats.enter) / span));
      }

      if (!sections.length) return;

      /* A focal line at 45% of the viewport decides which section "owns" the
         screen - matching where the eye actually sits while scrolling. */
      const probe = y + viewportHeight * 0.45;
      let index = 0;
      for (let i = 0; i < sections.length; i += 1) {
        if (probe >= sections[i].enter) index = i;
      }

      const active = sections[index];
      const span = Math.max(1, active.exit - active.enter);
      const beatProgress = beatsProgress.get();
      const beatOpen = clamp01((beatProgress - BEAT_OPEN_START) / BEAT_OPEN_SPAN);

      sceneSection.set(index);
      sceneLocal.set(clamp01((y - active.enter) / span));
      /* hero -> projects -> skills hold the shell open, then About reassembles it. */
      sceneOpen.set(index < 3 ? beatOpen : Math.min(beatOpen, 0.1));
      /* The subject glides right as the beat captions need the left column. */
      const beatShift = 1.15 * smoothStep(clamp01((beatProgress - 0.02) / 0.34));
      sceneOffsetX.set(Math.max(SECTION_OFFSET_X[index] ?? 0, beatShift));

      /* State update happens only on an actual section change (React bails out
         when the reducer returns the same string), so the nav never re-renders
         mid-scroll. */
      setActiveSection((prev) => (prev === active.id ? prev : active.id));

      const last = sections[sections.length - 1];
      const storyDone = Boolean(last) && y > last.enter + viewportHeight * 0.7;
      setStoryComplete((prev) => (prev === storyDone ? prev : storyDone));
    },
    [beatsProgress, sceneLocal, sceneOffsetX, sceneSection, sceneOpen]
  );

  const measure = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    const sections = STORY_SECTIONS.map((id) => {
      const el = document.querySelector(`[data-stage-section="${id}"]`);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = rect.top + scrollTop;
      const height = el.offsetHeight || rect.height;
      return { id, enter: top - viewportHeight, exit: top + height };
    }).filter(Boolean);

    const beatsEl = document.querySelector('[data-story-beats]');
    let beats = null;
    if (beatsEl) {
      const rect = beatsEl.getBoundingClientRect();
      const top = rect.top + scrollTop;
      beats = { enter: top - viewportHeight, exit: top + (beatsEl.offsetHeight || rect.height) };
    }

    boundsRef.current = { sections, beats };

    if (import.meta.env?.DEV && sections.length !== STORY_SECTIONS.length) {
      console.warn(
        '[ScrollController] Expected %d story sections but measured %d. Each id needs a `data-stage-section` attribute:',
        STORY_SECTIONS.length,
        sections.length,
        STORY_SECTIONS
      );
    }

    /* Re-apply immediately so the first frame after resize is already correct. */
    applyScroll(window.scrollY);
  }, [applyScroll]);

  useMotionValueEvent(scrollY, 'change', applyScroll);

  useEffect(() => {
    measure();

    let frame = 0;
    let measuring = false;
    const scheduleMeasure = () => {
      if (measuring) return;
      measuring = true;
      frame = window.requestAnimationFrame(() => {
        measuring = false;
        measure();
      });
    };

    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('load', scheduleMeasure);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleMeasure);
      observer.observe(document.body);
    }

    /* Web fonts change metrics -> section offsets move. Re-measure once they land. */
    if (document.fonts?.ready) document.fonts.ready.then(scheduleMeasure).catch(() => {});
    const settleTimer = window.setTimeout(scheduleMeasure, 800);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('load', scheduleMeasure);
      observer?.disconnect();
    };
  }, [measure]);

  const value = useMemo(
    () => ({
      activeSection,
      beatsProgress,
      pageProgress,
      sceneLocal,
      sceneOffsetX,
      sceneOpen,
      sceneSection,
      scrollVelocity,
      storyComplete,
    }),
    [
      activeSection,
      beatsProgress,
      pageProgress,
      sceneLocal,
      sceneOffsetX,
      sceneOpen,
      sceneSection,
      scrollVelocity,
      storyComplete,
    ]
  );

  return <ScrollStageContext.Provider value={value}>{children}</ScrollStageContext.Provider>;
}

export function useScrollStage() {
  const context = useContext(ScrollStageContext);
  if (!context) {
    throw new Error('useScrollStage() must be called inside <ScrollControllerProvider>.');
  }
  return context;
}

/**
 * Apple-style kinetic typography: headlines track in/out, lift and (optionally)
 * blur proportionally to scroll velocity, then settle perfectly at rest.
 *
 * Never returns `null` - the returned transforms are inert at zero velocity.
 */
export function useKineticScrub({
  maxSkew = 0.6,
  maxTracking = 0.02,
  maxLift = 5,
  maxBlur = 0,
} = {}) {
  const { scrollVelocity } = useScrollStage();

  const normalized = useTransform(scrollVelocity, [-2400, -500, 0, 500, 2400], [-1, -0.3, 0, 0.3, 1]);
  const eased = useSpring(normalized, { stiffness: 240, damping: 36, mass: 0.5 });

  const skewX = useTransform(eased, [-1, 1], [maxSkew, -maxSkew]);
  const letterSpacing = useTransform(eased, [-1, 1], [`${maxTracking}em`, `${-maxTracking}em`]);
  const y = useTransform(eased, [-1, 1], [maxLift, -maxLift]);
  const blurPx = useTransform(eased, [-1, 0, 1], [maxBlur, 0, maxBlur]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  /* All five values are stable motion values for the lifetime of the component. */
  return useMemo(() => ({ filter, letterSpacing, skewX, y }), [filter, letterSpacing, skewX, y]);
}