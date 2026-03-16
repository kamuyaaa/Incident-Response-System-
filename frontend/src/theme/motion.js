import { motion as motionTokens } from './tokens';

const motion = motionTokens;

/** Framer Motion: page transition */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: motion.duration.normal, ease: motion.ease },
};

/** Framer Motion: card/section reveal */
export const revealTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: motion.duration.slow, ease: motion.ease },
};

/** Framer Motion: stagger children (e.g. list items) */
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

/** Framer Motion: whileHover / whileTap for buttons and cards */
export const tapScale = { scale: 0.98 };
export const hoverTransition = { duration: motion.duration.fast };
export { motion };
