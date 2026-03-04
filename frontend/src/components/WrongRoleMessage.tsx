import { Link } from 'react-router-dom'

interface WrongRoleMessageProps {
  requiredRole: 'ADMIN' | 'RESPONDER'
}

export default function WrongRoleMessage({ requiredRole }: WrongRoleMessageProps) {
  return (
    <div className="p-6 text-center">
      <p className="text-gray-700 mb-4">
        This page is for the <strong>{requiredRole}</strong> view. Open the menu and switch your demo role to access it.
      </p>
      <Link
        to="/"
        className="inline-block px-4 py-2 rounded-xl bg-[#d92323] text-white font-medium hover:bg-[#b81e1e]"
      >
        Go to Home
      </Link>
    </div>
  )
}
