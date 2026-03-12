import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const statusStyles = {
  reported: 'bg-amber-100 text-amber-800 border-amber-200',
  validated: 'bg-blue-100 text-blue-800 border-blue-200',
  assigned: 'bg-violet-100 text-violet-800 border-violet-200',
  in_progress: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-ers-subtle text-ers-inkTertiary border-ers-subtle',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200',
  en_route: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  on_site: 'bg-teal-100 text-teal-800 border-teal-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  declined: 'bg-ers-subtle text-ers-inkTertiary border-ers-subtle',
};

const liveStatuses = ['in_progress', 'en_route', 'on_site', 'accepted'];

const priorityStyles = {
  low: 'text-ers-inkTertiary',
  medium: 'text-amber-700',
  high: 'text-orange-700',
  critical: 'text-emergency-600 font-semibold',
};

export function StatusBadge({ status, animated }) {
  const isLive = animated && status && liveStatuses.includes(status);
  const style = statusStyles[status] || 'bg-ers-subtle text-ers-inkSecondary border-ers-subtle';

  const content = (
    <>
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />}
      {status?.replace(/_/g, ' ') ?? '—'}
    </>
  );

  if (isLive) {
    return (
      <motion.span
        className={clsx(
          'inline-flex items-center px-3 py-1.5 rounded-lg text-caption font-semibold border',
          style
        )}
        animate={{ opacity: [1, 0.9, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        {content}
      </motion.span>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-md text-caption font-medium border',
        style
      )}
    >
      {content}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={clsx('text-caption font-medium', priorityStyles[priority] || 'text-ers-inkTertiary')}>
      {priority ?? '—'}
    </span>
  );
}
