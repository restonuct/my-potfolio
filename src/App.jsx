import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ArchitectureBeats from './components/ArchitectureBeats.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import BentoSkills from './components/BentoSkills.jsx';
import About from './components/About.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Footer from './components/Footer.jsx';
import SceneBackdrop from './components/SceneBackdrop.jsx';
import { ScrollControllerProvider } from './components/ScrollController.jsx';

export default function App() {
  // Theme system: Default to crisp Apple Light Mode, switchable to Obsidian Dark Mode
  const [isDark, setIsDark] = useState(() => {
    // ?theme=light|dark is a QA deep-link (documented in README) and wins over
    // the persisted preference so both themes can be captured on demand.
    const override = new URLSearchParams(window.location.search).get('theme');
    if (override === 'dark') return true;
    if (override === 'light') return false;
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
    <ScrollControllerProvider>
    <div className="relative min-h-screen bg-apple-bg-light text-neutral-900 transition-colors duration-500 selection:bg-apple-blue selection:text-white dark:bg-apple-bg-dark dark:text-neutral-100">
      {/* Fixed, pointer-transparent WebGL layer. Everything below it scrolls
          normally; the module behind simply follows the story. */}
      <SceneBackdrop isDark={isDark} />

      {/* Floating Frosted Glass Navbar with Dynamic Island Toggle */}
      <Navbar isDark={isDark} setIsDark={setIsDark} />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {/* 1. Hero Reveal Section */}
        <Hero />

        {/* 2. Pinned product-story beats: the module opens as you read these */}
        <ArchitectureBeats />

        {/* 3. App Store style showcase with live canvas previews per card */}
        <ProjectsSection onSelect={(proj) => setSelectedProject(proj)} isDark={isDark} />

        {/* 4. Interactive 3D Bento Skills Section (module shown fully open) */}
        <BentoSkills />

        {/* 5. Personal Story & About Amal Section */}
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

      {/* 6. Apple Minimalist Footer (kept above the canvas layer) */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
    </ScrollControllerProvider>
  );
}
