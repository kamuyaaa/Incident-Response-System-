import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getIncidents } from '../../services'
import type { Incident, IncidentStatus } from '../../types/incident'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { MapPin } from 'lucide-react'

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'Total Incidents' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Reported', label: 'Open' },
  { value: 'Escalated', label: 'Escalated' },
]

const PAGE_SIZE = 10

export default function AdminIncidents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParam = searchParams.get('status') || 'all'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState<'newest' | 'priority' | 'status'>(
    (searchParams.get('sort') as 'newest' | 'priority' | 'status') || 'newest'
  )

  const statusFilter = statusParam === 'all' ? undefined : (statusParam as IncidentStatus)
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await getIncidents({
          status: statusFilter,
          search: searchQuery || undefined,
          sort,
          page,
          limit: PAGE_SIZE,
        })
        if (cancelled) return
        setIncidents(res.data)
        setTotal(res.total)
      } catch (e) {
        if (!cancelled) setError((e as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [statusFilter, searchQuery, sort, page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setStatus = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('status')
    else next.set('status', value)
    next.delete('page')
    setSearchParams(next)
  }

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (value === 'all' && !statusFilter) || statusParam === value
                  ? 'bg-[#d92323] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search by title, location, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchParams((p) => { p.set('search', search); p.delete('page'); return p })
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d92323]/25"
          />
          <button
            type="button"
            onClick={() => setSearchParams((p) => { p.set('search', search); p.delete('page'); return p })}
            className="px-4 py-2.5 rounded-xl bg-[#d92323] text-white text-sm font-medium hover:bg-[#b81e1e]"
          >
            Search
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              const v = e.target.value as 'newest' | 'priority' | 'status'
              setSort(v)
              setSearchParams((p) => { p.set('sort', v); p.delete('page'); return p })
            }}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
          >
            <option value="newest">Newest</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="px-4">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      ) : incidents.length === 0 ? (
        <EmptyState
          title="No incidents match your filters."
          description="Try changing filters or search."
        />
      ) : (
        <>
          <ul className="px-4 space-y-3 pb-4">
            {incidents.map((inc) => (
              <li key={inc.id}>
                <Link
                  to={`/admin/incidents/${inc.id}`}
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
                    <span className="text-xs text-gray-400">Incident Id: #{inc.id}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-6">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="px-3 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </>
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
