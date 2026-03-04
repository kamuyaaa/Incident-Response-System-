import { Link, Outlet, useLocation } from 'react-router-dom'
import HamburgerButton from '../components/HamburgerButton'
import NotificationBell from '../components/NotificationBell'
import RoleSelector from '../components/RoleSelector'

export default function ResponderLayout() {
  const location = useLocation()
  const isList = location.pathname === '/responder'

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-10">
        {isList ? (
          <span className="w-10" aria-hidden />
        ) : (
          <Link
            to="/responder"
            className="p-2 -m-2 text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to assignments"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <h1 className="font-heading font-bold text-black text-base">
          {isList ? 'My Assignments' : 'Assignment'}
        </h1>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <RoleSelector />
          <HamburgerButton />
        </div>
      </header>
      <main className="flex-1 max-w-[430px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
