import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HamburgerButton from '../components/HamburgerButton'

export default function ReporterLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const isList = location.pathname === '/incidents' && !location.pathname.includes('/new') && !location.pathname.match(/\/incidents\/[^/]+/)

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-10">
        {isList ? (
          <span className="w-10" aria-hidden />
        ) : (
          <Link
            to="/incidents"
            className="p-2 -m-2 text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to incidents"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <h1 className="font-heading font-bold text-black text-base">
          {isList ? 'My Incidents' : location.pathname.includes('/new') ? 'Report Incident' : 'Incident'}
        </h1>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 truncate max-w-[80px]">{user?.email}</span>
          <HamburgerButton />
        </div>
      </header>
      <main className="flex-1 max-w-[430px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
