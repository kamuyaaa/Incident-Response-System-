import type { DemoUser, Session } from '../types/auth'
import { read, write, remove } from './storage'

const SESSION_KEY = 'session'

const DEMO_ACCOUNTS: (DemoUser & { password: string })[] = [
  { id: 'admin-1', email: 'admin@example.com', name: 'Admin User', role: 'ADMIN', password: 'Admin123!' },
  { id: 'resp-1', email: 'responder@example.com', name: 'Responder User', role: 'RESPONDER', password: 'Responder123!' },
  { id: 'rep-1', email: 'reporter@example.com', name: 'Reporter User', role: 'REPORTER', password: 'Reporter123!' },
]

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export const authService = {
  async login(email: string, password: string): Promise<DemoUser> {
    await delay()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === normalizedEmail && a.password === trimmedPassword
    )
    if (!account) {
      const err = new Error('Invalid email or password') as Error & { status?: number }
      err.status = 401
      throw err
    }
    const user: DemoUser = { id: account.id, email: account.email, name: account.name, role: account.role }
    const session: Session = { user }
    write(SESSION_KEY, session)
    return user
  },

  logout(): void {
    remove(SESSION_KEY)
  },

  getCurrentUser(): DemoUser | null {
    const session = read<Session>(SESSION_KEY)
    return session?.user ?? null
  },
}

export function getDemoAccounts(): { email: string; password: string; role: string }[] {
  return DEMO_ACCOUNTS.map((a) => ({ email: a.email, password: a.password, role: a.role }))
}
