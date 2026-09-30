import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Boxes, Code2, Cpu, Layers, Sparkles, Zap } from 'lucide-react';
import KineticHeading from './KineticHeading.jsx';

// Engineering Toolkit.
//
// While this section holds the viewport, the 3D module beside it is fully open
// (see SECTION_POSES in src/three/GlassArchitecture.jsx) - the internals are on
// screen exactly while the reader is looking at the stack that builds them.
//
// Each card keeps the existing physics tilt, but tilt is skipped entirely for
// reduced-motion users: the cards simply sit flat and still reveal on scroll.

function TiltBentoCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-3, 3]), springConfig);

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative h-full rounded-3xl apple-glass-light specular-highlight border border-neutral-200/80 p-6 shadow-apple-glass transition-shadow duration-300 hover:shadow-apple-hover dark:apple-glass-dark dark:border-white/10 dark:shadow-apple-glass-dark dark:hover:shadow-apple-hover-dark sm:p-7 ${className}`}
      >
        <div style={prefersReducedMotion ? undefined : { transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

const SKILL_CATEGORIES = [
  {
    title: 'Core Programming & Architecture',
    icon: Code2,
    accent: 'text-blue-500 bg-blue-500/10',
    skills: [
      { name: 'Python 3.10+', tag: 'Primary / Asyncio' },
      { name: 'JavaScript (ES6+)', tag: 'Modern Web / APIs' },
      { name: 'C Programming', tag: 'Foundations & Memory' },
      { name: 'Modular Architecture', tag: 'Plugin Pattern' },
    ],
    description:
      'Writing maintainable, decoupled system code with clean interfaces and strict type-safety principles.',
  },
  {
    title: '3D Graphics & Game Engine',
    icon: Boxes,
    accent: 'text-amber-500 bg-amber-500/10',
    skills: [
      { name: 'Three.js (r128)', tag: 'WebGL Scene Graph' },
      { name: 'WebGL 2.0', tag: '60 FPS Render Pipeline' },
      { name: 'Procedural Generation', tag: 'Endless Geometry' },
      { name: 'Collision Systems', tag: '3-Lane Physics' },
    ],
    description:
      'Building responsive 3D environments, custom camera rigs and low-poly assets optimised for instant browser load.',
  },
  {
    title: 'AI, Local Models & Memory',
    icon: Cpu,
    accent: 'text-purple-500 bg-purple-500/10',
    skills: [
      { name: 'llama.cpp', tag: 'Local GGUF Quantization' },
      { name: 'ChromaDB', tag: 'Vector Embeddings' },
      { name: 'Hybrid Intelligence', tag: 'Cloud + Offline' },
      { name: 'Controlled Autonomy', tag: 'Human Consent Verification' },
    ],
    description:
      'Building private, offline-first autonomous agents that prioritise user privacy and zero data leakage.',
  },
  {
    title: 'Audio Synthesis & Engineering Tools',
    icon: Zap,
    accent: 'text-emerald-500 bg-emerald-500/10',
    skills: [
      { name: 'Web Audio API', tag: 'Real-time Synthesizer' },
      { name: 'Git & Version Control', tag: 'GitHub Workflow' },
      { name: 'HTML5 LocalStorage', tag: 'Persistent State' },
      { name: 'macOS & Linux Terminal', tag: 'CLI Tooling' },
    ],
    description:
      'Crafting lightweight procedural audio engines and productive terminal development workflows.',
  },
];

export default function BentoSkills() {
  return (
    <section
      id="skills"
      data-stage-section="skills"
      className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mb-10 sm:mb-14">
        <KineticHeading
          badge="Interactive Engineering Toolkit"
          badgeIcon={Sparkles}
          title="Engineering Toolkit"
          description="The stack behind the module on your right - it is fully opened up while you read this. Hover any card for its perspective tilt, or scroll on if you would rather not."
        />

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/60 px-3.5 py-2 text-[11px] font-medium text-neutral-600 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
          <Layers className="h-3.5 w-3.5 text-apple-blue" />
          <span>4 production disciplines · 16 verified skills</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6">
        {SKILL_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25, delay: index * 0.08 }}
            >
              <TiltBentoCard>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${category.accent} shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white sm:text-lg">
                        {category.title}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Production ready
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-sm">
                  {category.description}
                </p>

                <div className="grid grid-cols-2 gap-2 border-t border-neutral-200/60 pt-2 dark:border-white/5">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-xl border border-neutral-200/50 bg-neutral-100/70 px-3 py-2 transition-colors hover:bg-neutral-200/70 dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
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