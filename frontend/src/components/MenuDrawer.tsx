import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMenu } from '../context/MenuContext'
import { useDemoRole } from '../context/DemoRoleContext'
import { seedData } from '../mock/seed'
import RoleSelector from './RoleSelector'

const REPORTER_NAV = [
  { to: '/report/type', label: 'Report an incident' },
  { to: '/reports/mine', label: 'Reported by you' },
  { to: '/reports/others', label: 'Reported by others' },
] as const

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/incidents', label: 'Total Incidents' },
  { to: '/admin/incidents?status=In Progress', label: 'In Progress' },
  { to: '/admin/incidents?status=Completed', label: 'Completed Incidents' },
  { to: '/admin/responders', label: 'Responders' },
] as const

const RESPONDER_NAV = [{ to: '/responder', label: 'My Assignments' }] as const

export default function MenuDrawer() {
  const { isOpen, closeMenu } = useMenu()
  const { role } = useDemoRole()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems =
    role === 'ADMIN'
      ? ADMIN_NAV
      : role === 'RESPONDER'
        ? RESPONDER_NAV
        : REPORTER_NAV

  const handleResetDemo = () => {
    seedData()
    closeMenu()
    navigate('/', { replace: true })
    window.location.reload()
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={closeMenu}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 z-50 w-full max-w-[280px] h-full bg-white shadow-xl flex flex-col"
        aria-modal
        aria-label="Menu"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-heading font-bold text-black">Menu</span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 -m-2 text-black/80 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Demo role</p>
          <RoleSelector />
        </div>
        <nav className="p-4 flex flex-col gap-1 flex-1 overflow-auto" aria-label="Main">
          {navItems.map(({ to, label }) => {
            const basePath = to.split('?')[0]
            const isCurrent = location.pathname === basePath
            return (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-gray-100 ${
                  isCurrent ? 'bg-[#fce7f3] text-black border border-pink-100' : 'text-black'
                }`}
              >
                <span className={isCurrent ? 'text-black' : 'text-black/70'}>{label}</span>
                <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <button
            type="button"
            onClick={handleResetDemo}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-amber-700 font-medium hover:bg-amber-50 border border-amber-200 transition-colors"
          >
            Reset Demo Data
          </button>
        </div>
      </aside>
    </>
  )
}
