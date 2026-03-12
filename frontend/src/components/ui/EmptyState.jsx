import { motion } from 'framer-motion';
import { revealTransition } from '../../theme/motion';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={revealTransition.initial}
      animate={revealTransition.animate}
      transition={revealTransition.transition}
    >
      {Icon && (
        <motion.div
          className="rounded-xl surface-subtle p-5 mb-5"
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Icon className="w-12 h-12 text-ers-inkTertiary" />
        </motion.div>
      )}
      <h3 className="text-h3 text-ers-ink">{title}</h3>
      {description && <p className="mt-2 text-body-sm text-ers-inkSecondary max-w-sm">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </motion.div>
  );
}
