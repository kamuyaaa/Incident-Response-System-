import { motion } from 'framer-motion';

const PHASE_LABELS = {
  assigned: 'Assigned',
  en_route: 'En route',
  near_scene: 'Near scene',
  on_site: 'On site',
  resolving: 'Resolving',
  resolved: 'Resolved',
};

const PHASE_STYLES = {
  assigned: 'bg-amber-100 text-amber-800 border-amber-200',
  en_route: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  near_scene: 'bg-teal-100 text-teal-800 border-teal-200',
  on_site: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  resolving: 'bg-violet-100 text-violet-800 border-violet-200',
  resolved: 'bg-ers-subtle text-ers-inkTertiary border-ers-subtle',
};

const RESPONDER_EMOJI = {
  fire_truck: '🚒',
  ambulance: '🚑',
  police: '🚔',
  general: '🚗',
};

export function TrackingSummaryCard({ simulation, display, assignment }) {
  const isLive = simulation && simulation.stage !== 'resolved' && simulation.stage !== 'resolving';
  const phase = simulation?.stage ?? assignment?.status;
  const phaseLabel = PHASE_LABELS[phase] || (phase ? String(phase).replace(/_/g, ' ') : null);
  const phaseStyle = PHASE_STYLES[phase] || PHASE_STYLES.assigned;
  const responderName = simulation?.responderName ?? assignment?.responderId?.name ?? 'Responder';
  const responderType = simulation?.responderType ?? assignment?.responderId?.serviceType ?? 'general';
  const emoji = RESPONDER_EMOJI[responderType] || '🚗';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="surface-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-ers-subtle/80 border border-ers-subtle flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            {emoji}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ers-ink truncate">{responderName}</p>
            <p className="text-sm text-ers-inkSecondary capitalize">{responderType?.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {phaseLabel && (
            <motion.span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border ${phaseStyle}`}
              animate={isLive ? { opacity: [1, 0.9, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              {isLive && (
                <span className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
              )}
              {phaseLabel}
            </motion.span>
          )}
          {isLive && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      {display && simulation && simulation.stage !== 'resolved' && simulation.stage !== 'resolving' && (
        <div className="mt-4 pt-4 border-t border-ers-subtle grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl bg-ers-surface/80 border border-ers-subtle p-3">
            <p className="text-xs text-ers-inkTertiary mb-0.5">ETA</p>
            <p className="text-lg sm:text-xl font-bold text-ers-ink tabular-nums">
              {display.etaMinutes ?? '—'} <span className="text-sm font-medium text-ers-inkSecondary">min</span>
            </p>
          </div>
          <div className="rounded-xl bg-ers-surface/80 border border-ers-subtle p-3">
            <p className="text-xs text-ers-inkTertiary mb-0.5">Distance</p>
            <p className="text-lg sm:text-xl font-bold text-ers-ink tabular-nums">
              {typeof display.distanceKm === 'number' ? display.distanceKm.toFixed(2) : display.distanceKm ?? '—'}{' '}
              <span className="text-sm font-medium text-ers-inkSecondary">km</span>
            </p>
          </div>
          <div className="col-span-2 sm:col-span-2 flex flex-col justify-center">
            <div className="flex justify-between text-xs text-ers-inkTertiary mb-1.5">
              <span>Progress</span>
              <span className="font-medium text-ers-inkSecondary">{Math.round(display.progress ?? 0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-ers-subtle overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${display.progress ?? 0}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      )}

      {assignment && !simulation && (
        <div className="mt-4 pt-4 border-t border-ers-subtle">
          <p className="text-sm text-ers-inkSecondary">
            Unit assigned. Tracking will appear when the responder is en route.
          </p>
        </div>
      )}
    </motion.div>
  );
}
