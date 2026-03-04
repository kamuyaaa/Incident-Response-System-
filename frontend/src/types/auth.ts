export type DemoRole = 'ADMIN' | 'RESPONDER' | 'REPORTER'

export interface DemoUser {
  id: string
  email: string
  name: string
  role: DemoRole
}

export interface Session {
  user: DemoUser
}
