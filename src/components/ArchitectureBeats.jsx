import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Aperture, Cpu, Layers, MoveDown } from 'lucide-react';
import { STORY_BEATS, useScrollStage } from './ScrollController.jsx';

/**
 * The pinned middle act of the product story.
 *
 * The section is 2.4 viewports tall; its inner panel is `sticky top-0`, which
 * is what "pinning" actually is on the web - no scroll hijacking, no transform
 * hacks, native inertia. Three captions cross-fade strictly in sync with the
 * disassembly of the 3D module beside them, because both read the same
 * `beatsProgress` motion value measured in ScrollController.
 */

const BEAT_ICONS = [Aperture, Layers, Cpu];

const smoothStep = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

function BeatCaption({ beat, index, total, progress }) {
  const isLast = index === total - 1;
  const start = index / total;
  const span = 1 / total;

  const opacity = useTransform(progress, (value) => {
    const appear = smoothStep((value - start) / (span * 0.4));
    const leave = isLast ? 0 : smoothStep((value - (start + span * 0.7)) / (span * 0.3));
    return Math.max(0, appear - leave);
  });

  const y = useTransform(progress, (value) => {
    const appear = 1 - smoothStep((value - start) / (span * 0.4));
    const leave = isLast ? 0 : smoothStep((value - (start + span * 0.7)) / (span * 0.3));
    return appear * 30 - leave * 30;
  });

  const Icon = BEAT_ICONS[index % BEAT_ICONS.length];

  return (
    <motion.article
      style={{ opacity, y, willChange: 'transform, opacity' }}
      className="absolute inset-x-0 top-0"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-apple-blue/12 text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue-dark">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {beat.label}
        </span>
      </div>
      <h3 className="mt-4 text-2xl font-extrabold tracking-apple-tight text-neutral-950 dark:text-white sm:text-3xl">
        {beat.title}
      </h3>
      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
        {beat.body}
      </p>
    </motion.article>
  );
}

export default function ArchitectureBeats() {
  const { beatsProgress } = useScrollStage();

  const railScale = useTransform(beatsProgress, [0.04, 0.94], [0.04, 1]);

  return (
    <section
      data-story-beats=""
      className="relative h-[210svh] sm:h-[240svh]"
      aria-labelledby="architecture-beats-title"
    >
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden pb-[16vh] sm:items-center sm:pb-0">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="max-w-md lg:max-w-[27rem]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-tight text-neutral-600 dark:bg-white/[0.07] dark:text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-apple-blue" />
              Product story
            </span>

            <h2
              id="architecture-beats-title"
              className="mt-4 text-3xl font-extrabold tracking-apple-tighter text-neutral-950 dark:text-white sm:text-5xl"
            >
              Inside the build
            </h2>

            {/* Caption stage - all three beats occupy the same box so they cross-fade. */}
            <div className="relative mt-9 h-[15rem] sm:h-[13.5rem]">
              {STORY_BEATS.map((beat, index) => (
                <BeatCaption
                  key={beat.id}
                  beat={beat}
                  index={index}
                  total={STORY_BEATS.length}
                  progress={beatsProgress}
                />
              ))}
            </div>

            {/* Pinned progress rail - a quiet, native-feeling scrub indicator. */}
            <div className="mt-8 flex items-center gap-3">
              <div className="relative h-1 w-36 overflow-hidden rounded-full bg-black/10 dark:bg-white/12">
                <motion.div
                  style={{ scaleX: railScale }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-apple-blue"
                />
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                <MoveDown className="h-3 w-3" />
                Keep scrolling to open it up
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}