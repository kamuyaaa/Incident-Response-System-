import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ConfirmModal from '../../components/ConfirmModal'
import { getPlaceholders } from '../../data/reportTypePlaceholders'
import { createIncident } from '../../services'

const CATEGORIES = [
  { id: 'medical', label: 'Medical Emergency' },
  { id: 'crime', label: 'Crime & Safety' },
  { id: 'natural', label: 'Natural Disaster' },
  { id: 'road', label: 'Road & Transport' },
  { id: 'fire', label: 'Fire & Rescue' },
  { id: 'public', label: 'Public Safety & Welfare' },
  { id: 'other', label: 'Other' },
] as const

export default function IncidentNew() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [category, setCategory] = useState('other')
  const typeLabel = useMemo(() => {
    const c = CATEGORIES.find((x) => x.id === category)
    return c?.label ?? category
  }, [category])
  const placeholders = useMemo(() => getPlaceholders(category), [category])

  const [description, setDescription] = useState('')
  const [casualties, setCasualties] = useState('')
  const [location, setLocation] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<{ description?: string; location?: string }>({})

  const validate = (): boolean => {
    const next: { description?: string; location?: string } = {}
    if (!description.trim()) next.description = 'Description is required'
    if (!location.trim()) next.location = 'Location is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const { id } = await createIncident({
        type: category,
        typeLabel,
        description: description.trim(),
        location: location.trim(),
        casualties: casualties.trim() || undefined,
        reporterId: user?.id ?? 'demo',
        reporterName: user?.name ?? 'Reporter',
      })
      setShowConfirm(false)
      navigate(`/incidents/${id}`, { replace: true })
    } catch {
      setSubmitError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-black placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#d92323]/20'

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-sm font-medium text-black mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                category === c.id ? 'bg-[#d92323] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl" role="alert">{submitError}</p>
        )}
        <div>
          <label htmlFor="desc" className="block text-sm font-medium text-black mb-1">Description</label>
          <textarea
            id="desc"
            rows={4}
            placeholder={placeholders.description}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })) }}
            className={`${inputClass} resize-none ${errors.description ? 'border-red-400' : ''}`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="cas" className="block text-sm font-medium text-black mb-1">Casualties (if any)</label>
          <input
            id="cas"
            type="text"
            placeholder={placeholders.casualties}
            value={casualties}
            onChange={(e) => setCasualties(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="loc" className="block text-sm font-medium text-black mb-1">Location</label>
          <input
            id="loc"
            type="text"
            placeholder={placeholders.location}
            value={location}
            onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: undefined })) }}
            className={`${inputClass} ${errors.location ? 'border-red-400' : ''}`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-[#d92323] text-white font-semibold text-sm hover:bg-[#b81e1e]"
        >
          Submit Report
        </button>
      </form>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => !submitting && setShowConfirm(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to submit this report?"
        isLoading={submitting}
      />
    </div>
  )
}
