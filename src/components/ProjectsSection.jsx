import React, { useMemo } from 'react';
import { MoveUpRight, Sparkles } from 'lucide-react';
import { PROJECTS } from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import KineticHeading from './KineticHeading.jsx';

// Showcase of flagship creations: B.A.D.I. and Ganesan Run.
export default function ProjectsSection({ onSelect, isDark }) {
  const ordered = useMemo(() => {
    return PROJECTS;
  }, []);

  return (
    <section
      id="projects"
      data-stage-section="projects"
      className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
        <KineticHeading
          badge="Featured Engineering Repositories"
          badgeIcon={Sparkles}
          title="Crafted Systems & Engines"
          description="Featured flagship builds: B.A.D.I. (privacy-first autonomous AI framework) and Ganesan Run (3D WebGL endless runner). Hover any card to view its live canvas preview."
        />

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <MoveUpRight className="h-3.5 w-3.5 text-apple-blue" />
          <span>Tap or press Enter to open the full blueprint</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
        {ordered.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isDark={isDark}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
