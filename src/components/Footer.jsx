import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, Code2, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="contact"
      data-stage-section="contact"
      className="relative mt-20 sm:mt-32 border-t border-neutral-200/80 dark:border-white/10 bg-neutral-100/50 dark:bg-black/50 py-12 sm:py-16 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left: Branding & Avatar */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-apple-blue" />
            <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
              Amal Mohammed M
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-sm">
            First-Year B.Tech Computer Science Student • Dedicated to clean systems, autonomous AI, and 3D graphics.
          </p>
        </div>

        {/* Center: Monochrome Social Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/restonuct"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="https://www.linkedin.com/in/amal-mohammed-418601431/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a
            href="mailto:contact@amalmohammed.dev"
            aria-label="Email Amal Mohammed"
            className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Back to Top & Personal Status */}
        <div className="flex flex-col items-center md:items-end">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors shadow-sm"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
            First-Year B.Tech CSE Undergrad • Open Source Builder
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-neutral-200/60 dark:border-white/5 text-center text-xs text-neutral-400 dark:text-neutral-600">
        © {new Date().getFullYear()} Amal Mohammed M. All rights reserved.
      </div>
    </footer>
  );
}
