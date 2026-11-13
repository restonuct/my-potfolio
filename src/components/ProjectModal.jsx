import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Github,
  Star,
  ExternalLink,
  Layers,
  Terminal,
  Code2,
  CheckCircle2,
  Volume2,
  Shield,
  Play
} from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture' | 'code' | 'interactive'
  const [audioFeedback, setAudioFeedback] = useState('');
  const [badiOutput, setBadiOutput] = useState(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Real Web Audio Synthesizer test for Ganesan Run
  const handlePlaySynthesizer = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.18); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);

      setAudioFeedback('Synthesized D5 → A5 Sine Wave (587Hz → 880Hz) via Web Audio API');
      setTimeout(() => setAudioFeedback(''), 2500);
    } catch (err) {
      setAudioFeedback('Audio synthesis initialized');
    }
  };

  // Interactive BADI Policy Execution test
  const handleTestBadiPolicy = (allow) => {
    if (allow) {
      setBadiOutput({
        status: 'authorized',
        message: 'Policy verification successful. User consent confirmed via local security ring.',
        module: 'badi.modules.base.AutonomousActionModule'
      });
    } else {
      setBadiOutput({
        status: 'cancelled',
        message: 'Action blocked by policy guard. No unauthorized local file modifications.',
        module: 'badi.modules.base.AutonomousActionModule'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-md"
      />

      {/* Modal Surface with layoutId */}
      <motion.div
        layoutId={`card-${project.id}`}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[36px] apple-glass-light dark:apple-glass-dark specular-highlight border border-neutral-200/90 dark:border-white/15 shadow-2xl z-10 text-neutral-900 dark:text-neutral-100"
      >
        {/* Sticky Header Close Button */}
        <div className="sticky top-0 right-0 z-20 flex justify-end p-4 pb-0 pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto w-9 h-9 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 backdrop-blur-md border border-neutral-300 dark:border-white/10 flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 pt-2">
          {/* Top Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <motion.span
              layoutId={`badge-${project.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blue-dark text-xs font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-apple-blue" />
              {project.badge}
            </motion.span>
            <span className="text-xs font-medium text-neutral-500">
              {project.category}
            </span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {project.status}
            </span>
          </div>

          {/* Heading */}
          <motion.h2
            layoutId={`title-${project.id}`}
            className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-apple-tight"
          >
            {project.title}
          </motion.h2>

          <motion.p
            layoutId={`subtitle-${project.id}`}
            className="text-base sm:text-lg font-medium text-apple-blue dark:text-apple-blue-dark mt-1"
          >
            {project.subtitle}
          </motion.p>

          <motion.p
            layoutId={`summary-${project.id}`}
            className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4"
          >
            {project.summary}
          </motion.p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 my-6 pt-4 border-t border-neutral-200/80 dark:border-white/10">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Live Game (Interaction Link)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>View Repository on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{project.stars} Star</span>
            </div>
          </div>

          {/* Tabs Selector (Apple Segmented Control) */}
          <div className="flex p-1 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60 border border-neutral-300/50 dark:border-white/5 mb-6">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
              }`}
            >
              System Architecture
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
              }`}
            >
              Core Code Logic
            </button>
            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'interactive'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
              }`}
            >
              Live Interaction
            </button>
          </div>

          {/* Tab 1: Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                  Layered Architecture Pipeline
                </h4>
                <div className="space-y-2.5">
                  {project.architecture.map((item, index) => (
                    <div
                      key={item.layer}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-white/5"
                    >
                      <span className="w-6 h-6 rounded-lg bg-apple-blue/10 text-apple-blue flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {item.layer}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                  Engineering Innovations
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 p-3 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Core Code Logic */}
          {activeTab === 'code' && (
            <div>
              <div className="flex items-center justify-between px-4 py-2.5 rounded-t-2xl bg-neutral-900 text-neutral-300 text-xs font-mono border border-b-0 border-neutral-800">
                <span className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  {project.codeSnippet.filename}
                </span>
                <span className="uppercase text-[10px] text-neutral-400">
                  {project.codeSnippet.language}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-b-2xl bg-neutral-950 border border-neutral-800 overflow-x-auto text-neutral-200 font-mono text-xs leading-relaxed">
                <pre>{project.codeSnippet.code}</pre>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 text-right">
                Directly referenced from repository codebase on GitHub @restonuct
              </p>
            </div>
          )}

          {/* Tab 3: Live Interactive Demo */}
          {activeTab === 'interactive' && (
            <div className="p-6 rounded-3xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-white/10">
              {project.id === 'ganesan-run-3d' ? (
                <div className="space-y-6">
                  {/* Embedded Live Game Frame */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                          Live Interactive Game (ganesan-run.vercel.app)
                        </h4>
                      </div>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        <span>Open Full Screen in New Tab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    
                    <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-neutral-300 dark:border-white/10 bg-black shadow-inner">
                      <iframe
                        src={project.liveUrl}
                        title="Ganesan Run Live Interaction"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                      Click inside to play! Use Arrow Keys or A / D to steer, Spacebar to jump.
                    </p>
                  </div>

                  {/* Procedural Audio Synthesizer */}
                  <div className="text-center pt-5 border-t border-neutral-200/80 dark:border-white/10">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Procedural Web Audio Synth Test
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mt-0.5 mb-3">
                      Test the zero-asset frequency oscillator algorithm synthesized in real-time.
                    </p>
                    <button
                      onClick={handlePlaySynthesizer}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Trigger Synthesized Chime (587Hz → 880Hz)</span>
                    </button>
                    {audioFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-xs font-mono text-emerald-600 dark:text-emerald-400"
                      >
                        {audioFeedback}
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-apple-blue flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                      B.A.D.I. Controlled Autonomy & Consent Gate
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mt-1">
                      Simulate the policy engine verifying high-impact actions before local autonomous execution.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left mb-4">
                    <div className="text-xs font-mono text-neutral-500 mb-1">
                      Task: [System.WriteConfigFile] Target: ~/.badi/settings.yaml
                    </div>
                    <div className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                      Requires explicit human authorization under B.A.D.I. Policy Rule #3.
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleTestBadiPolicy(true)}
                      className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      Authorize Action (Consent Granted)
                    </button>
                    <button
                      onClick={() => handleTestBadiPolicy(false)}
                      className="px-5 py-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all hover:scale-105 active:scale-95"
                    >
                      Reject Action (Consent Denied)
                    </button>
                  </div>

                  {badiOutput && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3.5 rounded-2xl text-xs font-mono border ${
                        badiOutput.status === 'authorized'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}
                    >
                      <div className="font-bold uppercase tracking-wider">{badiOutput.status}</div>
                      <div className="mt-1">{badiOutput.message}</div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Full Tech Stack Pills */}
          <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Full Technology Ecosystem
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 text-xs font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
