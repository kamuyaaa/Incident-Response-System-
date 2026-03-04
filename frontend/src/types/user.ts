export type UserRole = 'admin' | 'responder' | 'reporter' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  enabled?: boolean
}
