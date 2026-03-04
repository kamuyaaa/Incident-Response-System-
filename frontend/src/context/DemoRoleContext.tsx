import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type DemoRole = 'REPORTER' | 'ADMIN' | 'RESPONDER'

const DEMO_ROLE_KEY = 'irs_demo_role'
const DEMO_RESPONDER_ID_KEY = 'irs_demo_responder_id'

function loadStoredRole(): DemoRole {
  try {
    const r = localStorage.getItem(DEMO_ROLE_KEY)
    if (r === 'ADMIN' || r === 'RESPONDER' || r === 'REPORTER') return r
  } catch {
    // ignore
  }
  return 'REPORTER'
}

function loadStoredResponderId(): string {
  try {
    const id = localStorage.getItem(DEMO_RESPONDER_ID_KEY)
    return id ?? ''
  } catch {
    return ''
  }
}

type DemoRoleContextValue = {
  role: DemoRole
  setRole: (role: DemoRole) => void
  currentResponderId: string
  setCurrentResponderId: (id: string) => void
}

const DemoRoleContext = createContext<DemoRoleContextValue | null>(null)

export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DemoRole>(loadStoredRole)
  const [currentResponderId, setCurrentResponderIdState] = useState<string>(loadStoredResponderId)

  const setRole = useCallback((r: DemoRole) => {
    setRoleState(r)
    localStorage.setItem(DEMO_ROLE_KEY, r)
  }, [])

  const setCurrentResponderId = useCallback((id: string) => {
    setCurrentResponderIdState(id)
    localStorage.setItem(DEMO_RESPONDER_ID_KEY, id)
  }, [])

  useEffect(() => {
    const stored = loadStoredRole()
    setRoleState(stored)
  }, [])

  const value: DemoRoleContextValue = {
    role,
    setRole,
    currentResponderId,
    setCurrentResponderId,
  }

  return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>
}

export function useDemoRole() {
  const ctx = useContext(DemoRoleContext)
  if (!ctx) throw new Error('useDemoRole must be used within DemoRoleProvider')
  return ctx
}
