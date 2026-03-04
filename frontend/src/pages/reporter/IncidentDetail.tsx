import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getIncident, addTimelineUpdate } from '../../services'
import type { Incident } from '../../types/incident'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import ProgressTimeline from '../../components/ProgressTimeline'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { MapPin } from 'lucide-react'

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const toast = useToast()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    if (!id) return
    setLoading(true)
    setError(null)
    getIncident(id)
      .then(setIncident)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [id])

  const handleAddComment = async () => {
    if (!id || !comment.trim()) {
      toast('Enter a comment.', 'error')
      return
    }
    setSaving(true)
    try {
      await addTimelineUpdate(id, { text: comment.trim() }, { name: user?.name ?? 'Reporter', role: user?.role ?? 'REPORTER' })
      setComment('')
      load()
      toast('Comment added.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !incident) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="p-4">
        <ErrorState message={error || 'Not found'} onRetry={load} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-heading font-bold text-lg text-black">#{incident.id} — {incident.typeLabel}</h2>
          <StatusBadge status={incident.status} />
        </div>
        <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4 shrink-0" />
          {incident.location}
        </p>
        {incident.casualties && (
          <p className="text-sm text-gray-500 mt-1">Casualties: {incident.casualties}</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-black mb-3">Progress</h3>
        <ProgressTimeline incident={incident} />
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-black mb-2">Add comment (no status change)</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add an update or comment..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d92323]/20"
        />
        <button
          type="button"
          onClick={handleAddComment}
          disabled={saving || !comment.trim()}
          className="mt-2 px-4 py-2 rounded-xl bg-[#d92323] text-white text-sm font-medium disabled:opacity-70"
        >
          Add comment
        </button>
      </div>
    </div>
  )
}
