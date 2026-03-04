import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncidents } from '../services'
import type { Incident } from '../types/incident'
import HamburgerButton from '../components/HamburgerButton'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'

export default function ReportedByYou() {
  const [reports, setReports] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getIncidents({ reporterId: 'demo', limit: 50 })
      .then((res) => { if (!cancelled) setReports(res.data) })
      .catch(() => { if (!cancelled) setError('Failed to load reports.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-10">
        <Link
          to="/home"
          className="p-2 -m-2 text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-heading font-bold text-black text-base">Reported by you</h1>
        <HamburgerButton />
      </header>
      <main className="flex-1 p-4 space-y-3 max-w-[430px] mx-auto w-full">
        {error && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">You haven&apos;t reported any incidents yet.</p>
        ) : (
          reports.map((report) => (
            <Link
              key={report.id}
              to={`/report/${report.id}/progress`}
              className="block bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold text-black">#{report.id}</span>
                <StatusBadge status={report.status} />
              </div>
              <p className="text-sm font-medium text-black/90 mb-0.5">{report.typeLabel}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
              <p className="text-xs text-gray-500">{report.location}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(report.reportedAt)}</p>
            </Link>
          ))
        )}
      </main>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}
