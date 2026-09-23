import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import BentoSkills from './components/BentoSkills.jsx';
import About from './components/About.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Footer from './components/Footer.jsx';
import { PROJECTS } from './data/projects.js';
import { Sparkles, Terminal, Layers } from 'lucide-react';

export default function App() {
  // Theme system: Default to crisp Apple Light Mode, switchable to Obsidian Dark Mode
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('apple-portfolio-theme');
    if (saved) return saved === 'dark';
    return false; // Default Apple Light Mode
  });

  const [selectedProject, setSelectedProject] = useState(null);

  // Sync class on <html> and meta theme-color
  useEffect(() => {
    const root = document.documentElement;
    const metaTheme = document.getElementById('theme-color-meta');
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('apple-portfolio-theme', 'dark');
      if (metaTheme) metaTheme.setAttribute('content', '#000000');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('apple-portfolio-theme', 'light');
      if (metaTheme) metaTheme.setAttribute('content', '#F5F5F7');
    }
  }, [isDark]);

  // Keyboard shortcut: Cmd/Ctrl + \ to toggle theme
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setIsDark((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-apple-bg-light dark:bg-apple-bg-dark text-neutral-900 dark:text-neutral-100 transition-colors duration-500 relative selection:bg-apple-blue selection:text-white">
      {/* Floating Frosted Glass Navbar with Dynamic Island Toggle */}
      <Navbar isDark={isDark} setIsDark={setIsDark} />

      {/* Main Content Layout */}
      <main>
        {/* 1. Hero Reveal Section */}
        <Hero />

        {/* 2. Featured Projects Section (Apple App Store Layout) */}
        <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blue-dark text-xs font-semibold tracking-tight uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Engineering Repositories</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-apple-tighter">
                Crafted Systems & Engines
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              Click any project card to expand into the full App Store specification modal with architecture blueprints and live code.
            </p>
          </div>

          {/* Project Bento Cards (B.A.D.I. & Ganesan Run) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        </section>

        {/* 3. Interactive 3D Bento Skills Section */}
        <BentoSkills />

        {/* 4. Personal Story & About Amal Section */}
        <About />
      </main>

      {/* Shared Layout Expanded Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* 4. Apple Minimalist Footer */}
      <Footer />
    </div>
  );
}
