import { useDemoRole, type DemoRole } from '../context/DemoRoleContext'

const ROLES: { value: DemoRole; label: string }[] = [
  { value: 'REPORTER', label: 'Reporter' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'RESPONDER', label: 'Responder' },
]

export default function RoleSelector() {
  const { role, setRole } = useDemoRole()

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Demo role">
      {ROLES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => setRole(r.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            role === r.value
              ? 'bg-[#d92323] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
