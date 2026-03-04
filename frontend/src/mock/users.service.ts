import type { User } from '../types/user'
import { read, write } from './storage'
import { USERS_KEY } from './seed'

function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function getUsersRaw(): User[] {
  const data = read<User[]>(USERS_KEY)
  return Array.isArray(data) ? data : []
}

export const usersService = {
  async list(params?: { role?: string }): Promise<User[]> {
    await delay()
    let list = getUsersRaw()
    if (params?.role) {
      list = list.filter((u) => u.role === params.role)
    }
    return [...list]
  },

  async getById(id: string): Promise<User | null> {
    await delay()
    return getUsersRaw().find((u) => u.id === id) ?? null
  },

  async addResponder(payload: { name: string; email: string }): Promise<User> {
    await delay()
    const users = getUsersRaw()
    const id = `u${Date.now()}`
    const newUser: User = {
      id,
      email: payload.email,
      name: payload.name,
      role: 'responder',
      enabled: true,
    }
    users.push(newUser)
    write(USERS_KEY, users)
    return { ...newUser }
  },

  async setEnabled(userId: string, enabled: boolean): Promise<User | null> {
    await delay()
    const users = getUsersRaw()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) return null
    users[idx] = { ...users[idx], enabled }
    write(USERS_KEY, users)
    return { ...users[idx] }
  },

  getRespondersEnabled(): User[] {
    return getUsersRaw().filter((u) => u.role === 'responder' && u.enabled !== false)
  },
}
