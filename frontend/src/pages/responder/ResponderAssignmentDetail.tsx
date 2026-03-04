import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getIncident, updateIncident, addTimelineUpdate } from '../../services'
import type { Incident, IncidentStatus } from '../../types/incident'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { MapPin } from 'lucide-react'

const RESPONDER_STATUSES: IncidentStatus[] = ['En route', 'On site', 'In Progress', 'Resolved', 'Completed']

export default function ResponderAssignmentDetail() {
  const { id } = useParams<{ id: string }>()
  const toast = useToast()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [updateText, setUpdateText] = useState('')

  const load = () => {
    if (!id) return
    getIncident(id)
      .then(setIncident)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    load()
  }, [id])

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await updateIncident(id, { status: newStatus })
      setIncident(updated)
      toast('Status updated.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePostUpdate = async () => {
    if (!updateText.trim()) {
      toast('Enter an update.', 'error')
      return
    }
    if (!id) return
    setSaving(true)
    try {
      await addTimelineUpdate(id, { text: updateText.trim() })
      const updated = await getIncident(id)
      setIncident(updated)
      setUpdateText('')
      toast('Update posted.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="p-4">
        <ErrorState
          message={error || 'Assignment not found'}
          onRetry={() => id && load()}
        />
      </div>
    )
  }

  const timeline = incident.timelineUpdates ?? []

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-heading font-bold text-lg text-black">{incident.typeLabel}</h2>
          <StatusBadge status={incident.status} />
        </div>
        <p className="text-sm text-gray-600 mb-2">Reported: {formatDate(incident.reportedAt)}</p>
        <p className="text-sm text-gray-700 mb-2">{incident.description}</p>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4 shrink-0" />
          {incident.location}
        </p>
        <p className="text-xs text-gray-400 mt-2">Incident Id: #{incident.id}</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-4">
        <h3 className="font-semibold text-black">Update status</h3>
        <div className="flex flex-wrap gap-2">
          {RESPONDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              disabled={saving}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                incident.status === s ? 'bg-[#d92323] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-70`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-4">
        <h3 className="font-semibold text-black">Post update / timeline</h3>
        <textarea
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder="Add an update..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d92323]/25"
        />
        <button
          type="button"
          onClick={handlePostUpdate}
          disabled={saving || !updateText.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#d92323] text-white text-sm font-medium hover:bg-[#b81e1e] disabled:opacity-70"
        >
          Post update
        </button>
        {timeline.length > 0 && (
          <ul className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            {[...timeline].reverse().map((entry) => (
              <li key={entry.id} className="text-sm text-gray-700 pl-3 border-l-2 border-[#d92323]">
                {entry.text}
                <span className="text-xs text-gray-400 block mt-0.5">{formatDate(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}
