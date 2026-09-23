import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Star, Terminal, Layers, Cpu, CheckCircle2 } from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={() => onSelect(project)}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      whileTap={{ scale: 0.98 }}
      className="group relative cursor-pointer rounded-[32px] overflow-hidden apple-glass-light dark:apple-glass-dark specular-highlight border border-neutral-200/80 dark:border-white/10 shadow-apple-glass dark:shadow-apple-glass-dark hover:shadow-apple-hover dark:hover:shadow-apple-hover-dark transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Banner & Gradient Sheen */}
      <div className="relative p-6 sm:p-8 pb-4">
        {/* Subtle Ambient Backlight */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
          style={{ background: project.glowColor }}
        />

        {/* Badge & Date Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <motion.span
            layoutId={`badge-${project.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-300/60 dark:border-white/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
            {project.badge}
          </motion.span>

          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
            {project.category}
          </span>
        </div>

        {/* Title & Tagline */}
        <motion.h3
          layoutId={`title-${project.id}`}
          className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-apple-tight"
        >
          {project.title}
        </motion.h3>

        <motion.p
          layoutId={`subtitle-${project.id}`}
          className="text-xs sm:text-sm font-medium text-apple-blue dark:text-apple-blue-dark mt-1"
        >
          {project.subtitle}
        </motion.p>

        <motion.p
          layoutId={`summary-${project.id}`}
          className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-3 line-clamp-3"
        >
          {project.summary}
        </motion.p>
      </div>

      {/* Tech Stack Pills & Architecture Preview */}
      <div className="p-6 sm:p-8 pt-0">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-1 rounded-lg text-neutral-400">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200/60 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{project.stars} Star</span>
            </span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Verified @restonuct
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-apple-blue group-hover:translate-x-1 transition-transform">
            <span>Inspect Blueprint</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
