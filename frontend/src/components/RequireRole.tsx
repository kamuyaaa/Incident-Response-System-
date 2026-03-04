import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { DemoRole } from '../types/auth'
import type { ReactNode } from 'react'

interface RequireRoleProps {
  children: ReactNode
  role: DemoRole
}

function redirectByRole(role: string): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'RESPONDER') return '/responder'
  return '/incidents'
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to={redirectByRole(user?.role ?? '')} replace />
  return <>{children}</>
}

export function RequireResponder({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'RESPONDER') return <Navigate to={redirectByRole(user?.role ?? '')} replace />
  return <>{children}</>
}

export function RequireReporter({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'REPORTER') return <Navigate to={redirectByRole(user?.role ?? '')} replace />
  return <>{children}</>
}

export default function RequireRole({ children, role }: RequireRoleProps) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== role) return <Navigate to="/incidents" replace />
  return <>{children}</>
}
