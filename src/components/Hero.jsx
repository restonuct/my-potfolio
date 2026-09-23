import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Sparkles, Terminal, Code2, Layers, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 sm:pt-44 pb-16 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center overflow-hidden">
      {/* Subtle Apple Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[480px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-teal-400/10 dark:from-blue-600/20 dark:via-purple-600/15 dark:to-cyan-500/10 blur-[90px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />


      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm font-medium tracking-tight mb-5 sm:mb-6"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>First-Year B.Tech Computer Science</span>
        <span className="text-neutral-400 dark:text-neutral-500">|</span>
        <span className="text-neutral-500 dark:text-neutral-400">Builder & Systems Enthusiast</span>
      </motion.div>

      {/* 1. Hero Reveal: Masked clip-path upward slide for "Amal Mohammed M" */}
      <div className="overflow-hidden py-1 sm:py-2">
        <motion.h1
          initial={{ y: "110%", clipPath: "inset(0 0 100% 0)" }}
          animate={{ y: "0%", clipPath: "inset(0 0 0% 0)" }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1], // Apple quintic ease out
          }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-neutral-950 dark:text-white tracking-apple-tighter leading-[1.08]"
        >
          Amal Mohammed M
        </motion.h1>
      </div>

      {/* Subtitle with Tracking Contraction, staggered by 150ms */}
      <div className="overflow-hidden py-1 max-w-2xl mt-3 sm:mt-4">
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
            letterSpacing: "0.08em",
          }}
          animate={{
            opacity: 1,
            y: 0,
            letterSpacing: "-0.015em",
          }}
          transition={{
            duration: 0.85,
            delay: 0.15, // Staggered by 150ms
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-lg sm:text-2xl font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          Architecting privacy-first autonomous intelligence and high-framerate 3D WebGL experiences.
        </motion.p>
      </div>

      {/* Quick Stats / Tech Highlight Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-xl mt-8 sm:mt-10"
      >
        <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-white/5 backdrop-blur-md shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-apple-blue flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">B.A.D.I. AI</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Offline Framework</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-white/5 backdrop-blur-md shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">Ganesan Run</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Three.js 3D Engine</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-white/5 backdrop-blur-md shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">GitHub</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">@restonuct</div>
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10"
      >
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold text-sm shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Explore Featured Projects</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>

        <a
          href="https://github.com/restonuct"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Github className="w-4 h-4" />
          <span>GitHub (@restonuct)</span>
        </a>

        <a
          href="https://www.linkedin.com/in/amal-mohammed-418601431/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>LinkedIn</span>
        </a>
      </motion.div>
    </section>
  );
}
