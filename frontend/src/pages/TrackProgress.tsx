import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getIncident } from '../services'
import type { Incident } from '../types/incident'
import HamburgerButton from '../components/HamburgerButton'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'

const STEPS = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'responding', label: 'Responding' },
  { id: 'completed', label: 'Completed' },
] as const

function stepIndexFromStatus(status: string): number {
  if (status === 'Reported' || status === 'Validated' || status === 'Dispatched') return 0
  if (status === 'En route' || status === 'On site') return 1
  if (status === 'In Progress' || status === 'Escalated') return 2
  if (status === 'Resolved' || status === 'Completed') return 3
  return 0
}

export default function TrackProgress() {
  const { id } = useParams<{ id: string }>()
  const incidentId = id ?? '10003'
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const load = async () => {
    try {
      const inc = await getIncident(incidentId)
      setIncident(inc)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [incidentId])

  const handleRefresh = () => {
    setIsRefreshing(true)
    load()
  }

  if (loading && !incident) {
    return (
      <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-12">
        <header className="flex items-center justify-between absolute top-6 left-6 right-6 z-10">
          <span className="text-black font-bold text-lg">#{incidentId}</span>
          <HamburgerButton />
        </header>
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-12">
        <header className="flex items-center justify-between absolute top-6 left-6 right-6 z-10">
          <span className="text-black font-bold text-lg">#{incidentId}</span>
          <HamburgerButton />
        </header>
        <div className="p-4">
          <ErrorState message={error || 'Incident not found'} onRetry={handleRefresh} />
        </div>
      </div>
    )
  }

  const currentStep = stepIndexFromStatus(incident.status)
  const getStepStatus = (index: number): 'completed' | 'in_progress' | 'pending' => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'in_progress'
    return 'pending'
  }
  const isStepCompleted = (index: number) => index < currentStep
  const isLastStep = (index: number) => index === STEPS.length - 1

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-12">
      <header className="flex items-center justify-between absolute top-6 left-6 right-6 z-10">
        <span className="text-black font-bold text-lg">#{incident.id}</span>
        <HamburgerButton />
      </header>
      <div className="mt-4 space-y-4">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            currentStep >= 3
              ? 'bg-emerald-50 border-emerald-200/80'
              : 'bg-amber-50 border-amber-200/80'
          }`}
        >
          <span
            className={`shrink-0 ${currentStep >= 3 ? 'text-emerald-600' : 'text-amber-600'}`}
            aria-hidden
          >
            {currentStep >= 3 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            )}
          </span>
          <span className="text-black text-sm font-medium">
            <strong>Status:</strong> {incident.status}
          </span>
        </div>

        <h2 className="font-heading text-base font-bold text-black">Progress Timeline</h2>

        <div className="relative pl-5">
          {STEPS.map((step, index) => {
            const status = getStepStatus(index)
            const showSegmentBelow = !isLastStep(index)
            const segmentCompleted = isStepCompleted(index + 1)

            return (
              <div key={step.id} className="relative flex flex-col">
                <div className="relative flex items-center min-h-[20px]">
                  <div
                    className={`absolute left-0 top-0.5 w-3 h-3 rounded-full border-2 flex items-center justify-center bg-white z-10 shrink-0 ${
                      status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500'
                        : status === 'in_progress'
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-200 bg-gray-100'
                    }`}
                  >
                    {status === 'completed' && (
                      <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {status === 'in_progress' && (
                      <span className="w-1 h-1 rounded-full bg-white block" aria-hidden />
                    )}
                  </div>
                  <span
                    className={`ml-4 text-sm ${status === 'pending' ? 'text-gray-400' : 'text-black'}`}
                  >
                    {step.label}
                  </span>
                </div>
                {showSegmentBelow && (
                  <div
                    className="h-3 w-0.5 ml-1.5 border-l-2 border-dashed flex-shrink-0"
                    style={{
                      borderColor: segmentCompleted ? 'var(--timeline-done)' : 'var(--timeline-pending)',
                    }}
                    aria-hidden
                  />
                )}
              </div>
            )
          })}
        </div>

        {incident.timelineUpdates && incident.timelineUpdates.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-black text-sm">Updates</h3>
            <ul className="space-y-2">
              {[...(incident.timelineUpdates ?? [])].reverse().map((u) => (
                <li key={u.id} className="text-sm text-gray-700 pl-3 border-l-2 border-[#d92323]">
                  {u.text}
                  <span className="text-xs text-gray-400 block mt-0.5">{formatDate(u.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full py-2.5 rounded-xl border border-gray-300 bg-white text-black text-sm font-semibold text-center hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isRefreshing ? (
            <>
              <LoadingSpinner className="h-4 w-4" />
              Updating…
            </>
          ) : (
            'Refresh Status'
          )}
        </button>
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
