import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import HamburgerButton from '../components/HamburgerButton'
import { getPlaceholders } from '../data/reportTypePlaceholders'
import { createIncident } from '../services'

export default function SendReport() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'other'
  const typeLabel = useMemo(() => {
    const labels: Record<string, string> = {
      medical: 'Medical Emergency',
      crime: 'Crime & Safety',
      natural: 'Natural Disaster',
      road: 'Road & Transport',
      fire: 'Fire & Rescue',
      public: 'Public Safety & Welfare',
      other: 'Other',
    }
    return labels[type] ?? type
  }, [type])

  const placeholders = useMemo(() => getPlaceholders(type), [type])

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
        type,
        typeLabel,
        description: description.trim(),
        location: location.trim(),
        casualties: casualties.trim() || undefined,
        reporterId: 'demo',
      })
      setShowConfirm(false)
      navigate(`/report/thank-you?id=${id}`, { state: { reportId: id } })
    } catch {
      setSubmitError('Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-black placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#d92323] focus:ring-2 focus:ring-[#d92323]/20 transition-shadow'

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <header className="bg-white flex items-center justify-between px-4 py-3.5 border-b border-gray-100 min-h-[52px]">
        <h1 className="font-heading font-bold text-black text-lg">Send Report</h1>
        <div className="flex items-center gap-3">
          <HamburgerButton />
          <Link
            to="/home"
            className="p-2 -m-2 text-black/70 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-4 max-w-[430px] mx-auto w-full">
        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl" role="alert">
            {submitError}
          </p>
        )}
        <div>
          <label htmlFor="description" className="block text-black font-medium mb-1.5 text-sm">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder={placeholders.description}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: undefined })) }}
            className={`${inputClass} resize-none ${errors.description ? 'border-red-400' : ''}`}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-err' : undefined}
          />
          {errors.description && (
            <p id="description-err" className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>
          )}
        </div>
        <div>
          <label htmlFor="casualties" className="block text-black font-medium mb-1.5 text-sm">
            Any causalities? If yes, how many?
          </label>
          <input
            id="casualties"
            type="text"
            placeholder={placeholders.casualties}
            value={casualties}
            onChange={(e) => setCasualties(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-black font-medium mb-1.5 text-sm">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder={placeholders.location}
            value={location}
            onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: undefined })) }}
            className={`${inputClass} ${errors.location ? 'border-red-400' : ''}`}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? 'location-err' : undefined}
          />
          {errors.location && (
            <p id="location-err" className="mt-1 text-sm text-red-600" role="alert">{errors.location}</p>
          )}
        </div>
        <div>
          <label className="block text-black font-medium mb-1.5 text-sm">
            Upload Pictures / Videos (optional)
          </label>
          <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-gray-300 bg-white cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-colors">
            <svg className="w-8 h-8 text-gray-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.96 8L16 8m-7 7v7" />
            </svg>
            <span className="text-xs text-gray-500">Tap to upload</span>
            <input type="file" accept="image/*,video/*" className="hidden" />
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-[#d92323] text-white font-semibold uppercase text-sm tracking-wide hover:bg-[#c41f1f] active:bg-[#b81e1e] transition-colors shadow-sm"
        >
          SUBMIT REPORT
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
