import React from 'react';
import { motion, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  Code2,
  Github,
  Layers,
  Linkedin,
  MoveDown,
  Terminal,
} from 'lucide-react';
import { useKineticScrub, useScrollStage } from './ScrollController.jsx';

// Hero - act one of the product story.
//
// The section is 1.9 viewports tall and its inner panel is `sticky top-0`. That
// is the "pin" the 3D storyline is choreographed against: native CSS, no scroll
// hijacking. As the beat track approaches, the copy hands the stage to the
// module behind it - the type lifts, tracks and fades, then goes
// `visibility: hidden` so nothing invisible stays clickable or focusable.

const STATS = [
  {
    icon: Terminal,
    label: 'B.A.D.I. AI',
    value: 'Local-first framework',
    accent: 'bg-apple-blue/10 text-apple-blue',
  },
  {
    icon: Layers,
    label: 'Ganesan Run',
    value: 'Three.js 3D engine',
    accent: 'bg-amber-500/10 text-amber-500',
  },
  {
    icon: Code2,
    label: 'Python & Web',
    value: 'Maths & AI workflow',
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

export default function Hero() {
  const { beatsProgress } = useScrollStage();
  const kinetic = useKineticScrub({ maxSkew: 0, maxTracking: 0.008, maxLift: 6 });

  /* Copy hands over to the module as the disassembly story starts. */
  const copyOpacity = useTransform(beatsProgress, [0.005, 0.1], [1, 0]);
  const copyY = useTransform(beatsProgress, [0.005, 0.1], [0, -44]);
  const copyScale = useTransform(beatsProgress, [0.005, 0.1], [1, 0.972]);
  const copyVisibility = useTransform(beatsProgress, (value) => (value > 0.1 ? 'hidden' : 'visible'));
  const cueOpacity = useTransform(beatsProgress, [0, 0.05], [1, 0]);

  return (
    <section id="hero" data-stage-section="hero" className="relative h-[190svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Ambient scrim: keeps type contrast high while the glass module passes behind it. */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[62vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(245,245,247,0.92),rgba(245,245,247,0.55)_58%,rgba(245,245,247,0))] dark:bg-[radial-gradient(closest-side,rgba(0,0,0,0.9),rgba(0,0,0,0.55)_58%,rgba(0,0,0,0))]" />
          <div className="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500/12 via-indigo-500/10 to-teal-400/10 blur-[110px] dark:from-blue-600/18 dark:via-purple-600/14 dark:to-cyan-500/10 sm:h-[520px] sm:w-[520px] sm:blur-[140px]" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <motion.div
            style={{
              opacity: copyOpacity,
              y: copyY,
              scale: copyScale,
              visibility: copyVisibility,
            }}
            className="flex flex-col items-center text-center"
          >
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.04] px-3.5 py-1.5 text-[11px] font-medium tracking-tight text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-300 sm:mb-6 sm:text-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>First-Year B.Tech Computer Science</span>
              <span className="text-neutral-400 dark:text-neutral-500">|</span>
              <span className="text-neutral-500 dark:text-neutral-400">Builder & Systems Enthusiast</span>
            </motion.div>

            {/* Kinetic name: scroll velocity changes tracking and lift, never position-follows a cursor. */}
            <motion.div
              style={{ y: kinetic.y, letterSpacing: kinetic.letterSpacing, skewX: kinetic.skewX }}
              className="will-change-transform"
            >
              <div className="overflow-hidden py-1 sm:py-2">
                <motion.h1
                  initial={{ y: '110%', clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ y: '0%', clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl font-extrabold leading-[1.08] tracking-apple-tighter text-neutral-950 dark:text-white sm:text-6xl md:text-7xl"
                >
                  Amal Mohammed M
                </motion.h1>
              </div>
            </motion.div>

            {/* Subtitle with tracking contraction */}
            <div className="mt-3 max-w-2xl overflow-hidden py-1 sm:mt-4">
              <motion.p
                initial={{ opacity: 0, y: 20, letterSpacing: '0.08em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '-0.015em' }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-base font-medium leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-2xl"
              >
                Architecting privacy-first autonomous intelligence and high-framerate 3D WebGL
                experiences.
              </motion.p>
            </div>

            {/* Focus areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.35 }}
              className="mt-8 grid w-full max-w-xl grid-cols-2 gap-2 sm:mt-10 sm:grid-cols-3 sm:gap-3"
            >
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-2.5 rounded-2xl border border-neutral-200/60 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-neutral-900/60 sm:px-4 ${
                      index === STATS.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {stat.label}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Calls to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
              >
                <span>Explore featured projects</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href="https://github.com/restonuct"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition-all hover:scale-[1.02] hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Github className="h-4 w-4" />
                <span>GitHub (@restonuct)</span>
              </a>

              <a
                href="https://www.linkedin.com/in/amal-mohammed-418601431/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition-all hover:scale-[1.02] hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>LinkedIn</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue - the only motion at rest, and it disappears on first scroll. */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
            Scroll to disassemble
          </span>
          <motion.span
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-neutral-400 dark:text-neutral-500"
          >
            <MoveDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}