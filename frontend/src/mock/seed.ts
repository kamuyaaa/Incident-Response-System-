import type { Incident } from '../types/incident'
import type { User } from '../types/user'
import { write, setStorageVersion, getStorageVersion } from './storage'

const STORAGE_VERSION = 1

const INCIDENTS_KEY = 'incidents'
const USERS_KEY = 'users'
const NOTIFICATIONS_KEY = 'notifications'

const SEED_INCIDENTS: Incident[] = [
  {
    id: '10003',
    type: 'medical',
    typeLabel: 'Medical Emergency',
    description:
      'A person has collapsed near the entrance of TRM and is not responding. A small crowd has gathered, and we need medical assistance urgently.',
    location: 'TRM, Thika Road',
    status: 'In Progress',
    priority: 'High',
    reportedAt: '2026-02-13T14:45:00Z',
    assignedToId: 'u4',
    assignedToName: 'Jack Doe',
    casualties: '1 person',
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '10002',
    type: 'medical',
    typeLabel: 'Medical Emergency',
    description:
      'A pregnant woman at her residence is experiencing severe abdominal pain and heavy bleeding. Her condition is worsening and urgent medical help is needed.',
    location: 'Langas Estate, near Langas Primary School, Eldoret',
    status: 'In Progress',
    priority: 'Critical',
    reportedAt: '2026-02-13T12:00:00Z',
    assignedToId: 'u4',
    assignedToName: 'Jack Doe',
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '50003',
    type: 'fire',
    typeLabel: 'Fire & Rescue',
    description:
      'There is a fire in a residential building in Eastleigh, Nairobi. Smoke is coming from the upper floors, and several people are standing outside.',
    location: 'Eastleigh, Nairobi',
    status: 'Completed',
    priority: 'High',
    reportedAt: '2026-02-09T10:00:00Z',
    assignedToId: 'u5',
    assignedToName: 'Peter Mark',
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '50002',
    type: 'fire',
    typeLabel: 'Fire & Rescue',
    description: 'A residential house caught fire late at night, trapping occupants before neighbors helped rescue them.',
    location: 'Manyatta Estate, near Manyatta Roundabout, Kisumu',
    status: 'Completed',
    priority: 'Medium',
    reportedAt: '2026-01-20T22:00:00Z',
    assignedToId: 'u5',
    assignedToName: 'Peter Mark',
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '70003',
    type: 'other',
    typeLabel: 'Other',
    description:
      'There is a chemical leak in a warehouse in the Industrial Area, Nairobi, and there is a strong smell in the air.',
    location: 'Industrial Area, Nairobi',
    status: 'Completed',
    priority: 'High',
    reportedAt: '2025-12-17T08:00:00Z',
    assignedToId: null,
    assignedToName: null,
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '20003',
    type: 'crime',
    typeLabel: 'Crime & Safety',
    description: 'A shop in Eldoret town center has just been robbed. The suspect ran away a few minutes ago.',
    location: 'Eldoret town center, Eldoret',
    status: 'In Progress',
    priority: 'Medium',
    reportedAt: '2026-01-26T15:30:00Z',
    assignedToId: 'u4',
    assignedToName: 'Jack Doe',
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '10005',
    type: 'crime',
    typeLabel: 'Crime & Safety',
    description: 'Suspicious activity, possible break-in. Rear door being forced.',
    location: 'Junction Mall, Ngong Road',
    status: 'Reported',
    priority: 'Medium',
    reportedAt: '2026-02-13T15:10:00Z',
    assignedToId: null,
    assignedToName: null,
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '10004',
    type: 'natural',
    typeLabel: 'Natural Disaster',
    description: 'Heavy flooding on main road. Vehicles stuck, water rising.',
    location: 'South C, Nairobi',
    status: 'Escalated',
    priority: 'High',
    reportedAt: '2026-02-13T13:00:00Z',
    assignedToId: 'u5',
    assignedToName: 'Peter Mark',
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '10006',
    type: 'road',
    typeLabel: 'Road & Transport',
    description: 'Multi-vehicle collision on Mombasa Road. Traffic blocked.',
    location: 'Mombasa Road, Nairobi',
    status: 'Validated',
    priority: 'High',
    reportedAt: '2026-02-14T09:00:00Z',
    assignedToId: null,
    assignedToName: null,
    internalNotes: [],
    timelineUpdates: [],
  },
  {
    id: '10007',
    type: 'public',
    typeLabel: 'Public Safety & Welfare',
    description: 'Large crowd gathering, situation becoming tense.',
    location: 'CBD, Kenyatta Avenue',
    status: 'Dispatched',
    priority: 'Medium',
    reportedAt: '2026-02-14T11:30:00Z',
    assignedToId: 'u5',
    assignedToName: 'Peter Mark',
    internalNotes: [],
    timelineUpdates: [],
  },
]

const SEED_USERS: User[] = [
  { id: 'u1', email: 'admin@example.com', name: 'Jane Admin', role: 'admin', enabled: true },
  { id: 'u2', email: 'admin2@example.com', name: 'Mary Admin', role: 'admin', enabled: true },
  { id: 'u3', email: 'reporter@example.com', name: 'John Reporter', role: 'reporter', enabled: true },
  { id: 'u4', email: 'jack@responder.com', name: 'Jack Doe', role: 'responder', enabled: true },
  { id: 'u5', email: 'peter@responder.com', name: 'Peter Mark', role: 'responder', enabled: true },
  { id: 'u6', email: 'sarah@responder.com', name: 'Sarah Lee', role: 'responder', enabled: false },
]

export interface NotificationRecord {
  id: string
  message: string
  type: 'assigned' | 'status_changed' | 'escalated' | 'info'
  read: boolean
  createdAt: string
}

export function seedData(): void {
  write(INCIDENTS_KEY, SEED_INCIDENTS)
  write(USERS_KEY, SEED_USERS)
  write(NOTIFICATIONS_KEY, [] as NotificationRecord[])
  setStorageVersion(STORAGE_VERSION)
}

const STORAGE_VERSION_CURRENT = 1 as const

export function ensureSchemaVersion(): void {
  const v = getStorageVersion()
  if (v < STORAGE_VERSION_CURRENT) {
    seedData()
  }
}

export { INCIDENTS_KEY, USERS_KEY, NOTIFICATIONS_KEY }
