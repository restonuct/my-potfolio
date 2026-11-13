import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Terminal,
  Coffee,
  Heart,
  Compass,
  ArrowUpRight
} from 'lucide-react';

export default function About() {
  const personalHighlights = [
    {
      icon: GraduationCap,
      color: "text-blue-500 bg-blue-500/10",
      title: "First-Year B.Tech Student",
      subtitle: "Computer Science & Engineering",
      desc: "Currently in my foundational year of undergraduate engineering. I love building practical software from first principles — focusing on Python, modern web technologies (HTML, CSS, JavaScript), mathematical problem solving, and leveraging AI to build efficiently."
    },
    {
      icon: ShieldCheck,
      color: "text-purple-500 bg-purple-500/10",
      title: "Privacy-First Advocate",
      subtitle: "Inspiration Behind B.A.D.I.",
      desc: "I believe the next wave of artificial intelligence must belong to the user. That conviction inspired me to build B.A.D.I., focusing on local GGUF models via llama.cpp and offline vector memory where your data never leaves your machine."
    },
    {
      icon: Gamepad2,
      color: "text-amber-500 bg-amber-500/10",
      title: "3D & Interactive Graphics",
      subtitle: "Creator of Ganesan Run",
      desc: "Passionate about creating fun, performant web experiences. For Ganesan Run, I wanted a 3D endless runner running at 60 FPS directly in the browser with zero heavy audio downloads, using real-time Web Audio API frequency synthesis."
    },
    {
      icon: Compass,
      color: "text-emerald-500 bg-emerald-500/10",
      title: "Curiosity & What's Next",
      subtitle: "Always Building & Exploring",
      desc: "When I'm not studying coursework, you'll find me exploring new open-source repos on GitHub, experimenting with Linux tools, collaborating with peers, and building experimental prototypes."
    }
  ];

  return (
    <section
      id="about"
      data-stage-section="about"
      className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold tracking-tight uppercase mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Behind The Code</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-apple-tighter"
        >
          About Amal
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.15 }}
          className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400"
        >
          A glimpse into my journey, mindset, and what fuels my passion for software engineering.
        </motion.p>
      </div>

      {/* 2x2 Personal Story Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
        {personalHighlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 25,
                delay: idx * 0.1,
              }}
              className="p-6 sm:p-7 rounded-3xl apple-glass-light dark:apple-glass-dark specular-highlight border border-neutral-200/80 dark:border-white/10 shadow-apple-glass dark:shadow-apple-glass-dark hover:shadow-apple-hover dark:hover:shadow-apple-hover-dark transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Personal Bio Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.2 }}
        className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white dark:bg-white/[0.04] dark:border dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
              Personal Ethos
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-neutral-200 leading-relaxed max-w-xl">
            "Software is at its best when it solves real problems simply, stays fast, and respects the person using it."
          </p>
        </div>

        <a
          href="https://www.linkedin.com/in/amal-mohammed-418601431/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-950 dark:bg-white dark:text-neutral-950 text-xs sm:text-sm font-semibold hover:scale-105 active:scale-95 transition-transform shadow-md"
        >
          <span>Connect with Amal</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
