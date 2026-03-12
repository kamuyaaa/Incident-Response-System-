import { motion } from 'framer-motion';

const variants = {
  default: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  none: { initial: {}, animate: {}, transition: {} },
};

export function Card({ children, className = '', animate = true, hover, ...props }) {
  const v = animate ? variants.default : variants.none;
  const surfaceClass = hover ? 'surface-card-hover' : 'surface-card';
  return (
    <motion.div
      {...v}
      className={`${surfaceClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
