import React, { useState } from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight, Github, Linkedin, Sparkles, Layers, Code2, User } from 'lucide-react';
import { useScrollStage } from './ScrollController.jsx';

export default function Navbar({ isDark, setIsDark }) {
  const [isStretching, setIsStretching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSection, pageProgress } = useScrollStage();

  /* Real-time scroll progress: the ring reads the same motion value the 3D layer
     uses, so the navigation can never disagree with the story. */
  const RING_CIRCUMFERENCE = 2 * Math.PI * 9;
  const ringOffset = useTransform(pageProgress, [0, 1], [RING_CIRCUMFERENCE, 0]);
  const seamScale = useTransform(pageProgress, [0, 1], [0.015, 1]);

  const SECTION_LABELS = {
    hero: 'Home',
    projects: 'Projects',
    skills: 'Skills',
    about: 'About',
    contact: 'Contact',
  };

  const handleThemeToggle = () => {
    setIsStretching(true);
    setIsDark(!isDark);
    setTimeout(() => {
      setIsStretching(false);
    }, 300);
  };

  const navLinks = [
    { id: 'projects', name: 'Projects', href: '#projects', icon: Layers },
    { id: 'skills', name: 'Skills & Tech', href: '#skills', icon: Code2 },
    { id: 'about', name: 'About', href: '#about', icon: User },
    { id: 'contact', name: 'Contact', href: '#contact', icon: Sparkles },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-3 sm:px-6 pt-3 sm:pt-5 pointer-events-none">
      {/* Main Bar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.1 }}
        className="pointer-events-auto relative flex items-center justify-between gap-2 sm:gap-6 px-3.5 sm:px-6 py-2 rounded-full apple-glass-light dark:apple-glass-dark specular-highlight shadow-apple-glass dark:shadow-apple-glass-dark border border-neutral-200/80 dark:border-white/10 w-full max-w-4xl overflow-hidden"
      >
        {/* Brand / Profile Avatar & Name */}
        <a
          href="#"
          className="flex items-center gap-2.5 group text-neutral-900 dark:text-white transition-opacity hover:opacity-85 shrink-0"
          aria-label="Amal Mohammed M - Home"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1.5 ring-black/10 dark:ring-white/20 shadow-sm shrink-0">
            <img
              src="/profile.jpg"
              alt="Amal Mohammed"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://avatars.githubusercontent.com/u/115936174?v=4";
              }}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-neutral-950 dark:text-white leading-tight">
              Amal Mohammed
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden xs:inline-block">
              First-Year B.Tech CSE
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              aria-current={activeSection === link.id ? 'true' : undefined}
              className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeSection === link.id
                  ? 'bg-black/[0.06] text-neutral-950 dark:bg-white/[0.12] dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Action Cluster: Dynamic Island Theme Pill + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Morphing progress island: live section readout + scrub ring */}
          <div className="hidden items-center gap-2 rounded-full bg-black/[0.05] px-2.5 py-1 dark:bg-white/[0.08] sm:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4 -rotate-90" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                strokeWidth="2.5"
                className="stroke-black/10 dark:stroke-white/15"
              />
              <motion.circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                stroke="currentColor"
                strokeDasharray={RING_CIRCUMFERENCE}
                style={{ strokeDashoffset: ringOffset }}
                className="text-apple-blue"
              />
            </svg>
            <motion.span
              key={activeSection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="min-w-[3.4rem] text-[10px] font-semibold uppercase tracking-tight text-neutral-600 dark:text-neutral-300"
            >
              {SECTION_LABELS[activeSection] ?? 'Home'}
            </motion.span>
          </div>

          {/* Dynamic Island Theme Toggle Switch */}
          <motion.button
            onClick={handleThemeToggle}
            animate={{
              scaleX: isStretching ? 1.18 : 1,
              scaleY: isStretching ? 0.92 : 1,
            }}
            whileTap={{ scaleX: 1.18, scaleY: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="relative flex items-center justify-between w-13 sm:w-14 h-7 p-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 border border-neutral-300/80 dark:border-neutral-700/80 shadow-inner group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode (Press Cmd/Ctrl + \\)`}
            aria-label="Toggle Theme"
          >
            {/* Background Ambient Pill */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Sun & Moon Icons inside track */}
            <Sun className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
            <Moon className="w-3.5 h-3.5 text-indigo-400 mr-0.5" />

            {/* Dynamic Island Pill Knob */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 bottom-0.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 shadow-md flex items-center justify-center ${
                isDark ? 'right-0.5' : 'left-0.5'
              }`}
            >
              {isDark ? (
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
            </motion.div>
          </motion.button>

          {/* Mobile Hamburger / Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/15 transition-colors focus:outline-none"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Progress seam along the bottom edge of the pill */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: seamScale }}
          className="absolute inset-x-2 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-apple-blue/30 via-apple-blue to-apple-blue/30"
        />
      </motion.nav>

      {/* Adaptive Mobile Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="pointer-events-auto md:hidden w-full max-w-sm mt-2 rounded-[28px] apple-glass-light dark:apple-glass-dark specular-highlight p-4 border border-neutral-200/90 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-black/[0.06] text-neutral-950 dark:bg-white/[0.12] dark:text-white'
                        : 'text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{link.name}</span>
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-apple-blue" />}
                  </a>
                );
              })}

              <div className="h-px bg-neutral-200/80 dark:border-white/10 my-1.5" />

              {/* Quick Profile Links in Mobile Drawer */}
              <div className="flex items-center justify-around pt-1">
                <a
                  href="https://github.com/restonuct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-apple-blue py-1.5 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>@restonuct</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/amal-mohammed-418601431/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-apple-blue py-1.5 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
