import { motion } from 'framer-motion';
import { pageTransition } from '../../theme/motion';

const pageVariants = {
  initial: pageTransition.initial,
  animate: pageTransition.animate,
  exit: pageTransition.exit,
};

export function PageLayout({ title, subtitle, children, actions }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition.transition}
      className="min-h-screen bg-ers-bg"
    >
      <header className="sticky top-0 z-sticky bg-ers-elevated/95 backdrop-blur-sm border-b border-ers-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="page-title truncate">{title}</h1>
            {subtitle && <p className="page-subtitle truncate">{subtitle}</p>}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {actions}
            </div>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-5">{children}</main>
    </motion.div>
  );
}
