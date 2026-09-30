import React from 'react';
import { motion } from 'framer-motion';
import { useKineticScrub } from './ScrollController.jsx';

// KineticHeading - the shared eyebrow + headline + support copy block.
//
// The headline is scrubbed by scroll velocity: as the reader flicks, the type
// lifts, tracks out and skews a fraction of a degree; at rest it settles to
// exactly 0 with no residual transform. Nothing here follows the cursor.
//
// Two elements, on purpose: the outer motion.div owns the scroll-driven
// transform, the inner motion.h2 owns the one-shot reveal. Animating both on a
// single element would make one silently overwrite the other.

export default function KineticHeading({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const kinetic = useKineticScrub({ maxSkew: 0.45, maxTracking: 0.012, maxLift: 8 });
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'} ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-apple-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-tight text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue-dark"
        >
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
          <span>{badge}</span>
        </motion.div>
      )}

      <motion.div
        style={{ y: kinetic.y, letterSpacing: kinetic.letterSpacing, skewX: kinetic.skewX }}
        className="will-change-transform"
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25, delay: 0.08 }}
          className="mt-4 text-3xl font-extrabold tracking-apple-tighter text-neutral-950 dark:text-white sm:text-5xl"
        >
          {title}
        </motion.h2>
      </motion.div>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25, delay: 0.14 }}
          className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}