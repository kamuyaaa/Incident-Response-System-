import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncidents } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import { ClipboardList, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

const CARD_CONFIG = [
  { key: 'total', label: 'TOTAL INCIDENTS', link: '/admin/incidents', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'open', label: 'OPEN', link: '/admin/incidents?status=Reported', icon: ClipboardList, color: 'text-gray-700', bg: 'bg-gray-100' },
  { key: 'inProgress', label: 'IN PROGRESS', link: '/admin/incidents?status=In Progress', icon: Loader2, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'resolved', label: 'RESOLVED', link: '/admin/incidents?status=Resolved', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'escalated', label: 'ESCALATED', link: '/admin/incidents?status=Escalated', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
] as const

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [all, reported, inProgress, resolved, escalated] = await Promise.all([
          getIncidents({ limit: 1 }),
          getIncidents({ status: 'Reported', limit: 1 }),
          getIncidents({ status: 'In Progress', limit: 1 }),
          getIncidents({ status: 'Resolved', limit: 1 }),
          getIncidents({ status: 'Escalated', limit: 1 }),
        ])
        if (cancelled) return
        setCounts({
          total: all.total,
          open: reported.total,
          inProgress: inProgress.total,
          resolved: resolved.total,
          escalated: escalated.total,
        })
      } catch (e) {
        if (!cancelled) setError((e as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

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
    <div className="p-4 space-y-6">
      <p className="font-heading text-lg text-black/90">Admin dashboard</p>
      <p className="text-black/70 text-sm mb-6">Here&apos;s your incident summary.</p>
      <div className="grid gap-4">
        {CARD_CONFIG.map(({ key, label, link, icon: Icon, color, bg }) => (
          <Link
            key={key}
            to={link}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 surface-shadow hover:border-gray-200 transition-all active:scale-[0.99]"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>
              <Icon className={`w-6 h-6 ${color}`} aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{counts[key] ?? 0}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
