import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getIncidents } from '../../services'
import type { Incident } from '../../types/incident'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { MapPin } from 'lucide-react'

export default function IncidentsList() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const reporterId = user?.id ?? ''
    getIncidents({ reporterId: reporterId || undefined, limit: 100 })
      .then((res) => {
        if (!cancelled) setIncidents(res.data)
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user?.id])

  const filtered = filter === 'all'
    ? incidents
    : incidents.filter((i) => i.status === filter)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'Reported', 'Validated', 'Dispatched', 'In Progress', 'Resolved', 'Escalated'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium ${
              filter === s ? 'bg-[#d92323] text-white' : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? "You haven't reported any incidents." : `No incidents with status "${filter}".`}
          description={filter === 'all' ? 'Report an incident to get started.' : undefined}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((inc) => (
            <li key={inc.id}>
              <Link
                to={`/incidents/${inc.id}`}
                className="block bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-gray-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-black">#{inc.id}</span>
                  <StatusBadge status={inc.status} />
                </div>
                <p className="text-sm font-medium text-black/90 mb-0.5">{inc.typeLabel}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{inc.description}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {inc.location}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Updated: {formatDate(inc.updatedAt ?? inc.reportedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}
