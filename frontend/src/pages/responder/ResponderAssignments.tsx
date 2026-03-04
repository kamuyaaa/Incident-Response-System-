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

export default function ResponderAssignments() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = user?.id
    if (!userId) {
      setIncidents([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getIncidents({ assignedTo: userId, limit: 50 })
      .then((res) => { if (!cancelled) setIncidents(res.data) })
      .catch((e) => { if (!cancelled) setError((e as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user?.id])

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
      <p className="text-black/70 text-sm">
        Hi {user?.name}, here are your assigned incidents.
      </p>
      {incidents.length === 0 ? (
        <EmptyState
          title="No assignments yet."
          description="Incidents assigned to you will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {incidents.map((inc) => (
            <li key={inc.id}>
              <Link
                to={`/responder/assignments/${inc.id}`}
                className="block bg-white rounded-xl p-4 border border-gray-100 surface-shadow hover:border-gray-200 transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-black">{inc.typeLabel}</span>
                  <span className="text-xs text-gray-500">
                    Reported: {formatDate(inc.reportedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{inc.description}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {inc.location}
                </p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={inc.status} />
                  <span className="text-xs text-gray-400">#{inc.id}</span>
                </div>
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
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}
