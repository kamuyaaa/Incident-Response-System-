import type { Incident, TimelineEntry } from '../types/incident'
import StatusBadge from './StatusBadge'

interface ProgressTimelineProps {
  incident: Incident
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function ProgressTimeline({ incident }: ProgressTimelineProps) {
  const timeline = incident.timeline ?? []
  const lastUpdated = incident.updatedAt ?? incident.reportedAt

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={incident.status} />
        <span className="text-xs text-gray-500">Last updated: {formatTime(lastUpdated)}</span>
      </div>

      <div>
        <h3 className="font-semibold text-black text-sm mb-2">Activity</h3>
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {[...timeline].reverse().map((entry) => (
              <TimelineItem key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </div>

      {(incident.timelineUpdates?.length ?? 0) > 0 && (
        <div>
          <h3 className="font-semibold text-black text-sm mb-2">Updates</h3>
          <ul className="space-y-2">
            {[...(incident.timelineUpdates ?? [])].reverse().map((u) => (
              <li key={u.id} className="text-sm text-gray-700 pl-3 border-l-2 border-[#d92323]">
                {u.text}
                <span className="text-xs text-gray-400 block mt-0.5">{formatTime(u.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const time = formatTime(entry.time)
  return (
    <li className="text-sm pl-3 border-l-2 border-gray-200">
      <span className="font-medium text-black">{entry.actorName}</span>
      <span className="text-gray-500"> ({entry.actorRole})</span>
      <span className="text-gray-700"> — {entry.message}</span>
      {entry.newStatus && (
        <span className="ml-1 text-xs text-gray-500">→ {entry.newStatus}</span>
      )}
      <span className="text-xs text-gray-400 block mt-0.5">{time}</span>
    </li>
  )
}
