import type {
  Incident,
  GetIncidentsParams,
  GetIncidentsResponse,
  UpdateIncidentPayload,
  AssignIncidentPayload,
  IncidentStatus,
  IncidentPriority,
  InternalNote,
  TimelineUpdate,
  TimelineEntry,
  TimelineEntryType,
} from '../types/incident'
import { read, write } from './storage'
import { INCIDENTS_KEY } from './seed'
import { notificationsService } from './notifications.service'

const INCIDENT_STATUSES: IncidentStatus[] = [
  'Reported',
  'Validated',
  'Dispatched',
  'In Progress',
  'En route',
  'On site',
  'Resolved',
  'Completed',
  'Escalated',
  'Open',
]

const WORKFLOW: Record<IncidentStatus, IncidentStatus[]> = {
  Reported: ['Validated'],
  Validated: ['Dispatched'],
  Dispatched: ['In Progress', 'Escalated'],
  'In Progress': ['Resolved', 'Completed', 'Escalated'],
  'En route': ['On site', 'In Progress'],
  'On site': ['In Progress', 'Resolved'],
  Resolved: [],
  Completed: [],
  Escalated: ['In Progress', 'Resolved'],
  Open: ['Reported'],
}

function getIncidentsRaw(): Incident[] {
  const data = read<Incident[]>(INCIDENTS_KEY)
  return Array.isArray(data) ? data : []
}

function saveIncidents(incidents: Incident[]): void {
  write(INCIDENTS_KEY, incidents)
}

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function appendTimeline(
  incident: Incident,
  entry: { actorName: string; actorRole: string; type: TimelineEntryType; message: string; newStatus?: IncidentStatus }
): TimelineEntry[] {
  const now = new Date().toISOString()
  const timeline = incident.timeline ?? []
  const newEntry: TimelineEntry = {
    id: `te-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    time: now,
    actorName: entry.actorName,
    actorRole: entry.actorRole,
    type: entry.type,
    message: entry.message,
    newStatus: entry.newStatus,
  }
  return [...timeline, newEntry]
}

function filterAndSortIncidents(params?: GetIncidentsParams): Incident[] {
  let list = [...getIncidentsRaw()]

  if (params?.status && params.status !== 'Total Incidents' && params.status !== 'all') {
    list = list.filter((i) => i.status === params.status)
  }
  if (params?.priority) {
    list = list.filter((i) => i.priority === params.priority)
  }
  if (params?.fromDate) {
    list = list.filter((i) => i.reportedAt >= params.fromDate!)
  }
  if (params?.toDate) {
    list = list.filter((i) => i.reportedAt <= params.toDate!)
  }
  if (params?.search) {
    const q = params.search.toLowerCase()
    list = list.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        (i.title ?? '').toLowerCase().includes(q) ||
        (i.typeLabel ?? '').toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    )
  }
  if (params?.assignedTo) {
    list = list.filter((i) => i.assignedToId === params.assignedTo)
  }
  if (params?.reporterId !== undefined) {
    list = list.filter((i) => i.reporterId === params.reporterId)
  }

  const order = params?.sort ?? 'newest'
  list.sort((a, b) => {
    if (order === 'newest') return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    if (order === 'priority') {
      const p: Record<IncidentPriority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }
      return (p[b.priority] ?? 0) - (p[a.priority] ?? 0)
    }
    if (order === 'status') {
      const idx = (s: IncidentStatus) => INCIDENT_STATUSES.indexOf(s)
      return idx(a.status) - idx(b.status)
    }
    return 0
  })

  return list
}

export const incidentsService = {
  async getIncidents(params?: GetIncidentsParams): Promise<GetIncidentsResponse> {
    await delay()
    const list = filterAndSortIncidents(params)
    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const start = (page - 1) * limit
    const data = list.slice(start, start + limit)
    return { data, total: list.length }
  },

  async getIncident(id: string): Promise<Incident | null> {
    await delay()
    const incidents = getIncidentsRaw()
    const incident = incidents.find((i) => i.id === id)
    return incident ? { ...incident } : null
  },

  async createIncident(
    payload: {
      type: string
      typeLabel?: string
      description: string
      location: string
      casualties?: string
      reporterId?: string
      reporterName?: string
    }
  ): Promise<{ id: string }> {
    await delay()
    const incidents = getIncidentsRaw()
    const id = String(10000 + Math.floor(Math.random() * 90000))
    const now = new Date().toISOString()
    const timeline: TimelineEntry[] = [
      {
        id: `te-${Date.now()}`,
        time: now,
        actorName: payload.reporterName ?? 'Reporter',
        actorRole: 'REPORTER',
        type: 'reported',
        message: 'Incident reported.',
        newStatus: 'Reported',
      },
    ]
    const newIncident: Incident = {
      id,
      type: payload.type,
      typeLabel: payload.typeLabel ?? payload.type,
      description: payload.description,
      location: payload.location,
      status: 'Reported',
      priority: 'Medium',
      reportedAt: now,
      casualties: payload.casualties,
      reporterId: payload.reporterId ?? 'demo',
      internalNotes: [],
      timelineUpdates: [],
      timeline,
      updatedAt: now,
    }
    incidents.unshift(newIncident)
    saveIncidents(incidents)
    return { id }
  },

  async updateIncident(
    id: string,
    payload: UpdateIncidentPayload,
    actor?: { name: string; role: string }
  ): Promise<Incident | null> {
    await delay()
    const incidents = getIncidentsRaw()
    const idx = incidents.findIndex((i) => i.id === id)
    if (idx === -1) return null
    const prev = incidents[idx]
    const newStatus = payload.status
    let timeline = prev.timeline ?? []

    if (newStatus && newStatus !== prev.status) {
      const allowed = WORKFLOW[prev.status] ?? []
      if (!allowed.includes(newStatus) && newStatus !== 'Escalated') {
        const err = new Error(`Status cannot change from ${prev.status} to ${newStatus}`) as Error & { status?: number }
        err.status = 400
        throw err
      }
      if (newStatus === 'Escalated' && !['Dispatched', 'In Progress'].includes(prev.status)) {
        const err = new Error('Escalated only from Dispatched or In Progress') as Error & { status?: number }
        err.status = 400
        throw err
      }
      timeline = appendTimeline(prev, {
        actorName: actor?.name ?? 'Admin',
        actorRole: actor?.role ?? 'ADMIN',
        type: newStatus === 'Escalated' ? 'escalated' : 'status_change',
        message: newStatus === 'Escalated' ? 'Incident escalated.' : `Status updated to ${newStatus}.`,
        newStatus,
      })
      notificationsService.create('Status changed to ' + newStatus + ' for incident #' + id, 'status_changed')
      if (newStatus === 'Escalated') {
        notificationsService.create('Incident #' + id + ' has been escalated.', 'escalated')
      }
    }

    const updatedAt = new Date().toISOString()
    incidents[idx] = {
      ...incidents[idx],
      ...payload,
      timeline,
      updatedAt,
    }
    saveIncidents(incidents)
    return { ...incidents[idx] }
  },

  async assignIncident(
    id: string,
    payload: AssignIncidentPayload,
    assigneeName?: string,
    actor?: { name: string; role: string }
  ): Promise<Incident | null> {
    await delay()
    const incidents = getIncidentsRaw()
    const idx = incidents.findIndex((i) => i.id === id)
    if (idx === -1) return null
    const prev = incidents[idx]
    const timeline = appendTimeline(prev, {
      actorName: actor?.name ?? 'Admin',
      actorRole: actor?.role ?? 'ADMIN',
      type: 'assigned',
      message: `Assigned to ${assigneeName ?? 'responder'}.`,
    })
    incidents[idx] = {
      ...incidents[idx],
      assignedToId: payload.assigneeId,
      assignedToName: assigneeName ?? incidents[idx].assignedToName ?? null,
      timeline,
      updatedAt: new Date().toISOString(),
    }
    saveIncidents(incidents)
    notificationsService.create(
      'Incident #' + id + ' assigned to ' + (assigneeName ?? 'a responder') + '.',
      'assigned'
    )
    return { ...incidents[idx] }
  },

  async addInternalNote(id: string, note: { text: string }): Promise<InternalNote | null> {
    await delay()
    const incidents = getIncidentsRaw()
    const idx = incidents.findIndex((i) => i.id === id)
    if (idx === -1) return null
    const newNote: InternalNote = {
      id: `n${Date.now()}`,
      text: note.text,
      createdAt: new Date().toISOString(),
    }
    const current = incidents[idx].internalNotes ?? []
    incidents[idx] = {
      ...incidents[idx],
      internalNotes: [...current, newNote],
      updatedAt: new Date().toISOString(),
    }
    saveIncidents(incidents)
    return newNote
  },

  async addTimelineUpdate(
    id: string,
    update: { text: string },
    actor?: { name: string; role: string }
  ): Promise<TimelineUpdate | null> {
    await delay()
    const incidents = getIncidentsRaw()
    const idx = incidents.findIndex((i) => i.id === id)
    if (idx === -1) return null
    const prev = incidents[idx]
    const newUpdate: TimelineUpdate = {
      id: `t${Date.now()}`,
      text: update.text,
      createdAt: new Date().toISOString(),
    }
    const timeline = appendTimeline(prev, {
      actorName: actor?.name ?? 'Responder',
      actorRole: actor?.role ?? 'RESPONDER',
      type: 'progress_update',
      message: update.text,
    })
    const current = prev.timelineUpdates ?? []
    incidents[idx] = {
      ...incidents[idx],
      timelineUpdates: [...current, newUpdate],
      timeline,
      updatedAt: new Date().toISOString(),
    }
    saveIncidents(incidents)
    return newUpdate
  },
}
