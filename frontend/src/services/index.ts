import { incidentsService } from '../mock/incidents.service'
import { usersService } from '../mock/users.service'

export async function getIncidents(params?: Parameters<typeof incidentsService.getIncidents>[0]) {
  return incidentsService.getIncidents(params)
}

export async function getIncident(id: string) {
  const inc = await incidentsService.getIncident(id)
  if (!inc) {
    const err = new Error('Incident not found') as Error & { status?: number }
    err.status = 404
    throw err
  }
  return inc
}

export async function createIncident(payload: {
  type: string
  typeLabel?: string
  description: string
  location: string
  casualties?: string
  reporterId?: string
}) {
  return incidentsService.createIncident(payload)
}

export async function updateIncident(id: string, payload: Parameters<typeof incidentsService.updateIncident>[1]) {
  const inc = await incidentsService.updateIncident(id, payload)
  if (!inc) {
    const err = new Error('Incident not found') as Error & { status?: number }
    err.status = 404
    throw err
  }
  return inc
}

export async function assignIncident(id: string, payload: { assigneeId: string }, assigneeName?: string) {
  const inc = await incidentsService.assignIncident(id, payload, assigneeName)
  if (!inc) {
    const err = new Error('Incident not found') as Error & { status?: number }
    err.status = 404
    throw err
  }
  return inc
}

export async function addIncidentNote(id: string, note: { text: string }) {
  const noteResult = await incidentsService.addInternalNote(id, note)
  if (!noteResult) {
    const err = new Error('Incident not found') as Error & { status?: number }
    err.status = 404
    throw err
  }
  return { note: noteResult }
}

export async function addTimelineUpdate(id: string, update: { text: string }) {
  const result = await incidentsService.addTimelineUpdate(id, update)
  if (!result) {
    const err = new Error('Incident not found') as Error & { status?: number }
    err.status = 404
    throw err
  }
  return { update: result }
}

export async function getUsers(params?: { role?: string }) {
  return usersService.list(params)
}

export async function addResponder(payload: { name: string; email: string }) {
  return usersService.addResponder(payload)
}

export async function setResponderEnabled(userId: string, enabled: boolean) {
  const user = await usersService.setEnabled(userId, enabled)
  if (!user) {
    const err = new Error('User not found') as Error & { status?: number }
    err.status = 404
    throw err
  }
  return user
}
