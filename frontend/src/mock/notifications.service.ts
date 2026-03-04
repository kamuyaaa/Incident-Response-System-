import { read, write } from './storage'
import { NOTIFICATIONS_KEY } from './seed'
import type { NotificationRecord } from './seed'

const MAX_NOTIFICATIONS = 100

function getNotificationsRaw(): NotificationRecord[] {
  const data = read<NotificationRecord[]>(NOTIFICATIONS_KEY)
  return Array.isArray(data) ? data : []
}

function saveNotifications(list: NotificationRecord[]): void {
  write(NOTIFICATIONS_KEY, list.slice(0, MAX_NOTIFICATIONS))
}

export type NotificationType = 'assigned' | 'status_changed' | 'escalated' | 'info'

const NOTIFICATIONS_UPDATED = 'irs-notifications-updated'

export const notificationsService = {
  create(message: string, type: NotificationType = 'info'): void {
    const list = getNotificationsRaw()
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    list.unshift({
      id,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    })
    saveNotifications(list)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED))
    }
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {}
    const handler = () => callback()
    window.addEventListener(NOTIFICATIONS_UPDATED, handler)
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED, handler)
  },

  getAll(): NotificationRecord[] {
    return [...getNotificationsRaw()]
  },

  markRead(id: string): void {
    const list = getNotificationsRaw()
    const idx = list.findIndex((n) => n.id === id)
    if (idx !== -1) {
      const next = [...list]
      next[idx] = { ...next[idx], read: true }
      saveNotifications(next)
    }
  },

  markAllRead(): void {
    const list = getNotificationsRaw().map((n) => ({ ...n, read: true }))
    saveNotifications(list)
  },

  clear(): void {
    saveNotifications([])
  },
}
