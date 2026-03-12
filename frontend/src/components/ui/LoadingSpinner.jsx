import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  return (
    <motion.div
      className={`inline-block ${sizeClass} border-2 border-ers-subtle border-t-emergency-600 rounded-full animate-spin ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-label="Loading"
    />
  );
}

export function LoadingScreen({ message = 'Loading…' }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[50vh] gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <LoadingSpinner size="lg" />
      <p className="text-body-sm text-ers-inkSecondary">{message}</p>
    </motion.div>
  );
}
