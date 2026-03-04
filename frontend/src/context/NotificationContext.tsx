import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { notificationsService } from '../mock/notifications.service'

export type NotificationItem = {
  id: string
  message: string
  type: 'assigned' | 'status_changed' | 'escalated' | 'info'
  read: boolean
  createdAt: string
}

function loadFromStorage(): NotificationItem[] {
  return notificationsService.getAll()
}

type NotificationContextValue = {
  notifications: NotificationItem[]
  refresh: () => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(loadFromStorage)

  const refresh = useCallback(() => {
    setNotifications(loadFromStorage())
  }, [])

  useEffect(() => {
    return notificationsService.subscribe(refresh)
  }, [refresh])

  const markRead = useCallback((id: string) => {
    notificationsService.markRead(id)
    refresh()
  }, [refresh])

  const markAllRead = useCallback(() => {
    notificationsService.markAllRead()
    refresh()
  }, [refresh])

  const clear = useCallback(() => {
    notificationsService.clear()
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        refresh,
        markRead,
        markAllRead,
        clear,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
