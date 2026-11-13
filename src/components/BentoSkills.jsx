import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Calculator, Code2, Globe, Layers, Sparkles, Zap } from 'lucide-react';
import KineticHeading from './KineticHeading.jsx';

// Engineering Toolkit.
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
    title: 'Python Programming',
    icon: Code2,
    accent: 'text-blue-500 bg-blue-500/10',
    skills: [
      { name: 'Basic Python', tag: 'Syntax & Scripting' },
      { name: 'Functions & Logic', tag: 'Clean & Modular' },
      { name: 'Data Structures', tag: 'Lists, Dicts, Tuples' },
      { name: 'Automation', tag: 'CLI & File Handling' },
    ],
    description:
      'Foundational Python development, focusing on clear logic structures, script automation, and reliable problem solving.',
  },
  {
    title: 'Web Technologies (HTML, CSS & JS)',
    icon: Globe,
    accent: 'text-amber-500 bg-amber-500/10',
    skills: [
      { name: 'HTML5', tag: 'Semantic Layout' },
      { name: 'CSS3', tag: 'Responsive Design & Grid' },
      { name: 'JavaScript (ES6+)', tag: 'DOM & Events' },
      { name: 'Modern Web UI', tag: 'Interactive Experiences' },
    ],
    description:
      'Crafting responsive, accessible, and structured web interfaces with clean modern CSS and dynamic JavaScript.',
  },
  {
    title: 'Problem Solving & Mathematics',
    icon: Calculator,
    accent: 'text-emerald-500 bg-emerald-500/10',
    skills: [
      { name: 'Problem Solving', tag: 'Algorithmic Thinking' },
      { name: 'Applied Mathematics', tag: 'Analytical Logic' },
      { name: 'Logical Deduction', tag: 'Guard Clauses & Flow' },
      { name: 'Edge Case Testing', tag: 'Robust Reasoning' },
    ],
    description:
      'Applying mathematical principles and structured analytical reasoning to break down problems into clean, solvable code.',
  },
  {
    title: 'AI-Powered Workflow & Efficiency',
    icon: Zap,
    accent: 'text-purple-500 bg-purple-500/10',
    skills: [
      { name: 'AI-Assisted Dev', tag: 'Rapid Execution' },
      { name: 'Prompt Engineering', tag: 'Structured Context' },
      { name: 'Agentic Workflows', tag: 'Tooling & Acceleration' },
      { name: 'Efficient Delivery', tag: 'High-Impact Shipping' },
    ],
    description:
      'Leveraging state-of-the-art AI systems and agentic workflows to research, debug, and build software with maximum productivity.',
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
          badge="Verified Competencies"
          badgeIcon={Sparkles}
          title="Skills & Foundations"
          description="My core technical skillset: foundational programming in Python, modern web standards (HTML, CSS, JavaScript), mathematical problem solving, and AI-accelerated development."
        />

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/60 px-3.5 py-2 text-[11px] font-medium text-neutral-600 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
          <Layers className="h-3.5 w-3.5 text-apple-blue" />
          <span>Core Engineering Foundations · 4 Focus Disciplines</span>
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
                        Active skill
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
