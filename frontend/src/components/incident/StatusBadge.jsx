import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const statusStyles = {
  reported: 'bg-amber-100 text-amber-800 border-amber-200',
  validated: 'bg-blue-100 text-blue-800 border-blue-200',
  escalated: 'bg-emergency-100 text-emergency-700 border-emergency-200',
  assigned: 'bg-violet-100 text-violet-800 border-violet-200',
  en_route: 'bg-teal-100 text-teal-800 border-teal-200',
  near_scene: 'bg-teal-100 text-teal-800 border-teal-200',
  on_site: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  resolving: 'bg-amber-100 text-amber-800 border-amber-200',
  in_progress: 'bg-teal-100 text-teal-800 border-teal-200',
  resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200',
  en_route: 'bg-teal-100 text-teal-800 border-teal-200',
  near_scene: 'bg-teal-100 text-teal-800 border-teal-200',
  on_site: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  resolving: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  declined: 'bg-slate-100 text-slate-500 border-slate-200',
};

const liveStatuses = ['in_progress', 'en_route', 'near_scene', 'on_site', 'resolving', 'accepted'];

const priorityStyles = {
  low: 'text-slate-500',
  medium: 'text-amber-600',
  high: 'text-orange-600 font-semibold',
  critical: 'text-red-600 font-bold',
};

export function StatusBadge({ status, animated }) {
  const isLive = animated && status && liveStatuses.includes(status);
  const style = statusStyles[status] || 'bg-slate-100 text-slate-600 border-slate-200';

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
    <span className={clsx('text-caption font-medium capitalize', priorityStyles[priority] || 'text-slate-500')}>
      {priority ?? '—'}
    </span>
  );
}
