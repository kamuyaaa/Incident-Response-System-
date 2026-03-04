import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemoRole } from '../../context/DemoRoleContext'
import { getIncidents, getUsers } from '../../services'
import type { Incident } from '../../types/incident'
import type { User } from '../../types/user'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { MapPin } from 'lucide-react'

export default function ResponderAssignments() {
  const { currentResponderId, setCurrentResponderId } = useDemoRole()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [responders, setResponders] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const users = await getUsers({ role: 'responder' })
        const enabled = users.filter((u) => u.enabled !== false)
        if (!cancelled) setResponders(enabled)
      } catch {
        if (!cancelled) setResponders([])
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (responders.length > 0 && !currentResponderId) {
      setCurrentResponderId(responders[0].id)
      return
    }
    if (!currentResponderId) {
      setIncidents([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getIncidents({ assignedTo: currentResponderId, limit: 50 })
      .then((res) => { if (!cancelled) setIncidents(res.data) })
      .catch((e) => { if (!cancelled) setError((e as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [currentResponderId])

  if (loading && !currentResponderId && responders.length > 0) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentResponderId) {
    return (
      <div className="p-4">
        <EmptyState
          title="Select a responder"
          description="Choose which responder you are in the menu or below to see their assignments."
        />
        {responders.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Select current responder:</p>
            <select
              value={currentResponderId}
              onChange={(e) => setCurrentResponderId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
            >
              <option value="">Choose...</option>
              {responders.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}
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

  const currentResponder = responders.find((r) => r.id === currentResponderId)

  return (
    <div className="p-4 space-y-4">
      {responders.length > 1 && (
        <div>
          <label htmlFor="responder-select" className="block text-sm font-medium text-gray-700 mb-1">Current responder</label>
          <select
            id="responder-select"
            value={currentResponderId}
            onChange={(e) => setCurrentResponderId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
          >
            {responders.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      )}
      <p className="text-black/70 text-sm">
        {currentResponder ? `Hi ${currentResponder.name}, here are your assigned incidents.` : 'Your assigned incidents.'}
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
