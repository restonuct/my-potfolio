import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Code2,
  Cpu,
  Boxes,
  Volume2,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Layers,
  Database,
  Terminal,
  Zap
} from 'lucide-react';

// Tilt Card Component with 3D Parallax on Z-Axis and 1px Specular Border
function TiltBentoCard({ children, className = '', highlightColor = 'blue' }) {
  const cardRef = useRef(null);

  // Motion values for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for frictionless Apple feel
  const springConfig = { damping: 25, stiffness: 220 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseFromCenterX = (e.clientX - rect.left) / width - 0.5;
    const mouseFromCenterY = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(mouseFromCenterX);
    mouseY.set(mouseFromCenterY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative h-full rounded-3xl p-6 sm:p-7 apple-glass-light dark:apple-glass-dark specular-highlight border border-neutral-200/80 dark:border-white/10 shadow-apple-glass dark:shadow-apple-glass-dark transition-shadow duration-300 hover:shadow-apple-hover dark:hover:shadow-apple-hover-dark ${className}`}
      >
        {/* Internal Parallax Content Container */}
        <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function BentoSkills() {
  const skillCategories = [
    {
      title: "Core Programming & Architecture",
      icon: Code2,
      accent: "text-blue-500 bg-blue-500/10",
      skills: [
        { name: "Python 3.10+", tag: "Primary / Asyncio" },
        { name: "JavaScript (ES6+)", tag: "Modern Web / APIs" },
        { name: "C Programming", tag: "Foundations & Memory" },
        { name: "Modular Architecture", tag: "Plugin Pattern" },
      ],
      description: "Writing maintainable, decoupled system code with clean interfaces and strict type safety principles."
    },
    {
      title: "3D Graphics & Game Engine",
      icon: Boxes,
      accent: "text-amber-500 bg-amber-500/10",
      skills: [
        { name: "Three.js (r128)", tag: "WebGL Scene Graph" },
        { name: "WebGL 2.0", tag: "60 FPS Render Pipeline" },
        { name: "Procedural Generation", tag: "Endless Geometry" },
        { name: "Collision Systems", tag: "3-Lane Physics" },
      ],
      description: "Building responsive 3D environments, custom camera rigs, and low-poly assets optimized for instant browser load."
    },
    {
      title: "AI, Local Models & Memory",
      icon: Cpu,
      accent: "text-purple-500 bg-purple-500/10",
      skills: [
        { name: "llama.cpp", tag: "Local GGUF Quantization" },
        { name: "ChromaDB", tag: "Vector Embeddings" },
        { name: "Hybrid Intelligence", tag: "Cloud + Offline" },
        { name: "Controlled Autonomy", tag: "Human Consent Verification" },
      ],
      description: "Pioneering private, offline-first autonomous agents that prioritize user privacy and zero data leakage."
    },
    {
      title: "Audio Synthesis & Engineering Tools",
      icon: Zap,
      accent: "text-emerald-500 bg-emerald-500/10",
      skills: [
        { name: "Web Audio API", tag: "Real-time Synthesizer" },
        { name: "Git & Version Control", tag: "GitHub Workflow" },
        { name: "HTML5 LocalStorage", tag: "Persistent State" },
        { name: "macOS & Linux Terminal", tag: "CLI Tooling" },
      ],
      description: "Crafting lightweight audio synthesizer loops and productive terminal development workflows."
    },
  ];

  return (
    <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-apple-blue text-xs font-semibold tracking-tight uppercase mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Bento Stack</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-apple-tighter"
        >
          Engineering Toolkit
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.15 }}
          className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400"
        >
          Hover over each card to experience subtle 3D perspective tilt and Z-axis depth parallax.
        </motion.p>
      </div>

      {/* Bento Grid (2x2 on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {skillCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 25,
                delay: idx * 0.1,
              }}
            >
              <TiltBentoCard>
                {/* Header with Parallax Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ transform: "translateZ(30px)" }}
                      className={`w-11 h-11 rounded-2xl ${category.accent} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                        {category.title}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Production Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                  {category.description}
                </p>

                {/* Skill Pills */}
                <div
                  style={{ transform: "translateZ(15px)" }}
                  className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200/60 dark:border-white/5"
                >
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="px-3 py-2 rounded-xl bg-neutral-100/70 dark:bg-white/[0.04] border border-neutral-200/50 dark:border-white/[0.06] hover:bg-neutral-200/70 dark:hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {skill.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {skill.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </TiltBentoCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
