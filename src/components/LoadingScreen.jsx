import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(14);
  const [takingLong, setTakingLong] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [velocity, setVelocity] = useState(1);
  const [isDone, setIsDone] = useState(false);

  // Status updates in quiet minimalist copy
  const statusMessage =
    progress < 45
      ? 'Loading experience'
      : progress < 80
      ? 'Synthesizing scene'
      : progress < 99
      ? 'Finalizing'
      : 'Ready';

  // Natural progression
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const step = Math.floor(Math.random() * 12) + 7;
        return Math.min(100, prev + step);
      });
    }, 160);

    return () => clearInterval(timer);
  }, []);

  // Completion fadeout
  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsDone(true);
        setTimeout(() => onComplete?.(), 450);
      }, 350);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  // If loading exceeds 2.2 seconds, offer the minimal enter button
  useEffect(() => {
    const longTimer = setTimeout(() => {
      setTakingLong(true);
    }, 2200);

    return () => clearTimeout(longTimer);
  }, []);

  // Interactive tap on the minimal spinner
  const handleSpinnerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples((prev) => [...prev.slice(-4), { id: Date.now() + Math.random(), x, y }]);
    setTapCount((prev) => prev + 1);
    setVelocity((prev) => Math.min(prev + 0.9, 4.5));
    setProgress((prev) => Math.min(100, prev + 10));
  };

  // Damp rotation back to baseline
  useEffect(() => {
    if (velocity <= 1) return;
    const interval = setInterval(() => {
      setVelocity((v) => Math.max(1, v * 0.93));
    }, 50);
    return () => clearInterval(interval);
  }, [velocity]);

  const handleInstantEnter = () => {
    setProgress(100);
    setIsDone(true);
    setTimeout(() => onComplete?.(), 350);
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.995 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-apple-bg-light/98 dark:bg-apple-bg-dark/98 backdrop-blur-2xl select-none text-neutral-900 dark:text-neutral-100"
        >
          <div className="relative flex flex-col items-center text-center px-6 max-w-xs w-full">
            {/* Minimal Unique Gyroscopic / Optical Spinner */}
            <div
              onClick={handleSpinnerClick}
              role="button"
              tabIndex={0}
              aria-label="Interactive loader, tap to spin"
              className="relative w-28 h-28 flex items-center justify-center cursor-pointer group mb-8 outline-none"
            >
              {/* Expanding glass ripple on tap */}
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  initial={{ scale: 0.3, opacity: 0.6 }}
                  animate={{ scale: 2.1, opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="pointer-events-none absolute w-16 h-16 rounded-full border border-neutral-900/30 dark:border-white/40"
                  style={{ left: r.x - 32, top: r.y - 32 }}
                />
              ))}

              {/* Static outer reference track with 4 micro-ticks */}
              <div className="absolute inset-0 rounded-full border border-neutral-300/70 dark:border-white/10" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
              <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-0.5 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
              <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-0.5 bg-neutral-400 dark:bg-neutral-600 rounded-full" />

              {/* Sweeping hairline arc - monochrome & crisp */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2.8 / velocity,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 rounded-full border border-transparent border-t-neutral-900 dark:border-t-white"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.2))',
                }}
              />

              {/* Counter-spinning segmented ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 4.6 / velocity,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-2.5 rounded-full border border-dashed border-neutral-300 dark:border-white/15"
              />

              {/* Center Frosted Minimal Disc with Percentage */}
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="relative w-14 h-14 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-white/10 shadow-sm backdrop-blur-md flex flex-col items-center justify-center transition-transform group-hover:scale-105"
              >
                <span className="font-mono text-xs font-semibold tracking-tighter text-neutral-900 dark:text-neutral-100">
                  {progress}%
                </span>
              </motion.div>
            </div>

            {/* Hairline Progress Track */}
            <div className="w-36 h-[2px] rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden mb-3">
              <motion.div
                className="h-full bg-neutral-900 dark:bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>

            {/* Minimal Status Label */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
              <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse" />
              <span>{statusMessage}</span>
            </div>

            {/* Tap Prompt (fades after first interaction) */}
            <motion.p
              animate={{ opacity: tapCount > 0 ? 0.9 : 0.5 }}
              className="mt-2 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium"
            >
              {tapCount > 0
                ? `Accelerated (${tapCount}×)`
                : 'Click spinner to accelerate'}
            </motion.p>

            {/* "Taking too long?" Clean Minimal Shortcut */}
            {takingLong && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10 flex flex-col items-center gap-2 w-full"
              >
                <button
                  onClick={handleInstantEnter}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-white/5 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Enter portfolio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
