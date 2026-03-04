export type IncidentStatus =
  | 'Reported'
  | 'Validated'
  | 'Dispatched'
  | 'In Progress'
  | 'En route'
  | 'On site'
  | 'Resolved'
  | 'Completed'
  | 'Escalated'
  | 'Open'

export type IncidentPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface InternalNote {
  id: string
  text: string
  createdAt: string
  createdBy?: string
}

export interface TimelineUpdate {
  id: string
  text: string
  createdAt: string
}

export type TimelineEntryType =
  | 'reported'
  | 'validated'
  | 'dispatched'
  | 'assigned'
  | 'status_change'
  | 'progress_update'
  | 'escalated'
  | 'resolved'
  | 'comment'

export interface TimelineEntry {
  id: string
  time: string
  actorName: string
  actorRole: string
  type: TimelineEntryType
  message: string
  newStatus?: IncidentStatus
}

export interface Incident {
  id: string
  type: string
  typeLabel: string
  title?: string
  description: string
  location: string
  status: IncidentStatus
  priority: IncidentPriority
  reportedAt: string
  assignedToId?: string | null
  assignedToName?: string | null
  createdAt?: string
  updatedAt?: string
  casualties?: string
  reporterId?: string
  internalNotes?: InternalNote[]
  timelineUpdates?: TimelineUpdate[]
  timeline?: TimelineEntry[]
}

export interface GetIncidentsParams {
  status?: IncidentStatus | string
  priority?: IncidentPriority
  fromDate?: string
  toDate?: string
  search?: string
  sort?: 'newest' | 'priority' | 'status'
  page?: number
  limit?: number
  assignedTo?: string
  reporterId?: string
}

export interface GetIncidentsResponse {
  data: Incident[]
  total: number
}

export interface AssignIncidentPayload {
  assigneeId: string
}

export interface UpdateIncidentPayload {
  status?: IncidentStatus
  priority?: IncidentPriority
  internalNotes?: InternalNote[]
}
