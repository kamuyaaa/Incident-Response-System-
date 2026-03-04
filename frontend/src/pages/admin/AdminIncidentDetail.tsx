import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getIncident, updateIncident, assignIncident, addIncidentNote, getUsers } from '../../services'
import type { Incident, IncidentStatus, IncidentPriority } from '../../types/incident'
import type { User } from '../../types/user'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import StatusBadge from '../../components/StatusBadge'
import ProgressTimeline from '../../components/ProgressTimeline'
import { MapPin } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const PRIORITIES: IncidentPriority[] = ['Low', 'Medium', 'High', 'Critical']

const STATUS_OPTIONS: IncidentStatus[] = [
  'Reported',
  'Validated',
  'Dispatched',
  'In Progress',
  'Escalated',
  'Resolved',
  'Completed',
]

export default function AdminIncidentDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const toast = useToast()
  const actor = user ? { name: user.name, role: user.role } : undefined
  const [incident, setIncident] = useState<Incident | null>(null)
  const [responders, setResponders] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [priority, setPriority] = useState<IncidentPriority>('Medium')
  const [status, setStatus] = useState<IncidentStatus>('Reported')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const incidentId = id
    let cancelled = false
    async function load() {
      try {
        const [inc, users] = await Promise.all([
          getIncident(incidentId),
          getUsers({ role: 'responder' }),
        ])
        if (cancelled) return
        setIncident(inc)
        setResponders(users.filter((u) => u.enabled !== false))
        setAssigneeId(inc.assignedToId || '')
        setPriority(inc.priority)
        setStatus(inc.status)
      } catch (e) {
        if (!cancelled) setError((e as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleAssign = async () => {
    const assignee = assigneeId.trim()
    if (!id || !assignee) {
      toast('Please select a responder.', 'error')
      return
    }
    const assigneeUser = responders.find((u) => u.id === assignee)
    setSaving(true)
    try {
      await assignIncident(id, { assigneeId: assignee }, assigneeUser?.name, actor)
      const updated = await getIncident(id)
      setIncident(updated)
      setAssigneeId(updated.assignedToId || '')
      toast('Incident assigned successfully.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePriority = async () => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await updateIncident(id, { priority }, actor)
      setIncident(updated)
      toast('Priority updated.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (newStatus: IncidentStatus) => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await updateIncident(id, { status: newStatus }, actor)
      setIncident(updated)
      setStatus(newStatus)
      toast('Status updated.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!id || !note.trim()) {
      toast('Enter a note.', 'error')
      return
    }
    setSaving(true)
    try {
      await addIncidentNote(id, { text: note.trim() })
      const updated = await getIncident(id)
      setIncident(updated)
      setNote('')
      toast('Note added.', 'success')
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
          message={error || 'Incident not found'}
          onRetry={() => id && getIncident(id).then(setIncident).catch(() => {})}
        />
      </div>
    )
  }

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
        {incident.casualties && (
          <p className="text-sm text-gray-500 mt-1">Casualties: {incident.casualties}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">Incident Id: #{incident.id}</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow">
        <h3 className="font-semibold text-black mb-3">Progress</h3>
        <ProgressTimeline incident={incident} />
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-4">
        <h3 className="font-semibold text-black">Assign to responder</h3>
        <div className="flex gap-2">
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
          >
            <option value="">Select responder</option>
            {responders.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAssign}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-[#d92323] text-white text-sm font-medium hover:bg-[#b81e1e] disabled:opacity-70"
          >
            Assign
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-4">
        <h3 className="font-semibold text-black">Priority</h3>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                priority === p ? 'bg-[#d92323] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleUpdatePriority}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-70"
        >
          Update priority
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-4">
        <h3 className="font-semibold text-black">Update status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleUpdateStatus(s)}
              disabled={saving}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                status === s ? 'bg-[#d92323] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-70`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-4">
        <h3 className="font-semibold text-black">Internal / audit notes</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d92323]/25"
        />
        <button
          type="button"
          onClick={handleAddNote}
          disabled={saving || !note.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#d92323] text-white text-sm font-medium hover:bg-[#b81e1e] disabled:opacity-70"
        >
          Add note
        </button>
        {incident.internalNotes && incident.internalNotes.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            {incident.internalNotes.map((n) => (
              <li key={n.id} className="text-sm text-gray-600 pl-2 border-l-2 border-gray-200">
                {n.text}
                <span className="text-xs text-gray-400 block mt-0.5">{formatDate(n.createdAt)}</span>
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
