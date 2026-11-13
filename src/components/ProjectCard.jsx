import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BarChart3,
  Cpu,
  Gamepad2,
  GraduationCap,
  ShieldCheck,
  Star,
} from 'lucide-react';
import ProjectPreview from './ProjectPreview.jsx';

// Poster art for the capability-gated / pre-mount state. Same composition as
// the canvas it replaces, so the swap is effectively invisible.
const POSTER_ICONS = {
  gamepad: Gamepad2,
  cpu: Cpu,
  chart: BarChart3,
  shield: ShieldCheck,
};

function PreviewPoster({ project }) {
  const Icon = POSTER_ICONS[project.posterIcon] ?? Cpu;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${project.accentColor} opacity-[0.16]`} />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.5), transparent 58%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(127,127,127,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,127,127,0.28) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${project.accentColor} shadow-lg`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({ project, onSelect, isDark, index = 0 }) {
  const [previewActive, setPreviewActive] = useState(false);
  const isWide = Boolean(project.featured);
  const hasStars = Number(project.stars) > 0;

  const handleOpen = () => onSelect?.(project);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Open the ${project.title} blueprint`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => setPreviewActive(true)}
      onPointerLeave={() => setPreviewActive(false)}
      onFocus={() => setPreviewActive(true)}
      onBlur={() => setPreviewActive(false)}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 26,
        delay: Math.min(index * 0.08, 0.24),
      }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[32px] apple-glass-light specular-highlight border border-neutral-200/80 shadow-apple-glass transition-shadow duration-300 hover:shadow-apple-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue/60 dark:apple-glass-dark dark:border-white/10 dark:shadow-apple-glass-dark dark:hover:shadow-apple-hover-dark ${
        isWide ? 'md:col-span-2 md:flex-row md:items-stretch' : ''
      }`}
    >
      {/* Live canvas band - animates on hover/focus, holds a poster frame otherwise. */}
      <ProjectPreview
        sceneKey={project.previewKey}
        isDark={isDark}
        active={previewActive}
        poster={<PreviewPoster project={project} />}
        className={`shrink-0 border-b border-neutral-200/70 dark:border-white/[0.06] ${
          isWide ? 'h-44 md:h-auto md:w-[46%] md:border-b-0 md:border-r' : 'h-40'
        }`}
      />

      <div className="relative flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
          style={{ background: project.glowColor }}
        />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between gap-2">
            <motion.span
              layoutId={`badge-${project.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300/60 bg-black/[0.05] px-3 py-1 text-[11px] font-semibold text-neutral-800 dark:border-white/10 dark:bg-white/[0.08] dark:text-neutral-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-apple-blue" />
              {project.badge}
            </motion.span>

            <span className="shrink-0 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              {project.category}
            </span>
          </div>

          <motion.h3
            layoutId={`title-${project.id}`}
            className="text-2xl font-extrabold tracking-apple-tight text-neutral-950 dark:text-white sm:text-3xl"
          >
            {project.title}
          </motion.h3>

          <motion.p
            layoutId={`subtitle-${project.id}`}
            className="mt-1 text-xs font-medium text-apple-blue dark:text-apple-blue-dark sm:text-sm"
          >
            {project.subtitle}
          </motion.p>

          <motion.p
            layoutId={`summary-${project.id}`}
            className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-sm"
          >
            {project.summary}
          </motion.p>

          {/* Apple-style spec rows */}
          {project.specs?.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-neutral-200/60 pt-4 dark:border-white/[0.06]">
              {project.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
                    {spec.label}
                  </dt>
                  <dd className="mt-0.5 text-[11px] font-medium text-neutral-800 dark:text-neutral-200 sm:text-xs">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="relative mt-6">
          <div className="mb-5 flex flex-wrap gap-1.5 sm:gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-neutral-200/60 bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-white/5 dark:bg-neutral-800/80 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 text-[11px] font-medium text-neutral-400">
                +{project.techStack.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200/60 pt-4 dark:border-white/5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>
                  {project.stars} Star{project.stars === 1 ? '' : 's'}
                </span>
              </span>
              {project.liveUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live Interaction
                </span>
              )}
            </div>

            <span className="flex items-center gap-1.5 text-xs font-semibold text-apple-blue transition-transform group-hover:translate-x-1">
              <span>Inspect blueprint</span>
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}