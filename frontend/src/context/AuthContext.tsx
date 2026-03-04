import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { authService } from '../mock/auth.service'
import type { DemoUser } from '../types/auth'

type AuthContextValue = {
  user: DemoUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<DemoUser>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => authService.getCurrentUser())

  const refreshUser = useCallback(() => {
    setUser(authService.getCurrentUser())
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await authService.login(email, password)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
