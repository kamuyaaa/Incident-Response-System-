import { motion } from 'framer-motion';

const RESPONDER_LABELS = {
  fire_truck: 'Fire unit',
  ambulance: 'Ambulance',
  police: 'Police unit',
  general: 'Response unit',
};

const STAGE_LABELS = {
  assigned: 'Assigned',
  en_route: 'En route',
  near_scene: 'Near scene',
  on_site: 'On site',
  resolving: 'Resolving',
  resolved: 'Resolved',
};

const STAGE_COLORS = {
  assigned: 'bg-amber-100 text-amber-800 border-amber-200',
  en_route: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  near_scene: 'bg-teal-100 text-teal-800 border-teal-200',
  on_site: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  resolving: 'bg-violet-100 text-violet-800 border-violet-200',
  resolved: 'bg-ers-subtle text-ers-inkTertiary border-ers-subtle',
};

export function TrackingCard({ simulation, display }) {
  if (!simulation) return null;

  const isLive = simulation.stage !== 'resolved' && simulation.stage !== 'resolving';
  const responderLabel = RESPONDER_LABELS[simulation.responderType] || 'Unit';
  const stageLabel = STAGE_LABELS[simulation.stage] || simulation.stage;
  const stageColor = STAGE_COLORS[simulation.stage] || STAGE_COLORS.assigned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-ers-subtle/80 border border-ers-subtle p-2.5 text-2xl">
            {simulation.responderType === 'fire_truck' && '🚒'}
            {simulation.responderType === 'ambulance' && '🚑'}
            {simulation.responderType === 'police' && '🚔'}
            {simulation.responderType === 'general' && '🚗'}
          </div>
          <div>
            <p className="font-semibold text-ers-ink">{responderLabel}</p>
            <p className="text-sm text-ers-inkSecondary">{simulation.responderName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${stageColor}`}
          >
            {stageLabel}
          </span>
          {isLive && (
            <span className="flex items-center gap-1.5 text-xs text-cyan-600">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      {display && simulation.stage !== 'resolved' && simulation.stage !== 'resolving' && (
        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-ers-inkSecondary">Progress</span>
            <span className="text-ers-ink font-medium">{Math.round(display.progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-ers-subtle overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${display.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-ers-inkSecondary">
              <strong className="text-ers-ink">
                {typeof display.distanceKm === 'number' ? display.distanceKm.toFixed(2) : display.distanceKm} km
              </strong> remaining
            </span>
            <span className="text-ers-inkSecondary">
              ETA <strong className="text-ers-ink">{display.etaMinutes} min</strong>
            </span>
          </div>
        </div>
      )}

      {simulation.timeline && simulation.timeline.length > 0 && (
        <div className="mt-4 pt-4 border-t border-ers-subtle">
          <p className="text-xs font-medium text-ers-inkSecondary mb-2">Timeline</p>
          <ul className="space-y-1.5">
            {[...simulation.timeline].reverse().slice(0, 6).map((entry, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <span className="text-ers-inkTertiary w-20 shrink-0">
                  {new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-ers-inkSecondary capitalize">
                  {entry.stage?.replace(/_/g, ' ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
