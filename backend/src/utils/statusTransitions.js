const INCIDENT_TRANSITIONS = {
  reported: ['validated', 'escalated', 'cancelled'],
  validated: ['escalated', 'assigned', 'cancelled'],
  escalated: ['assigned', 'cancelled'],
  assigned: ['en_route', 'in_progress', 'cancelled'],
  en_route: ['near_scene', 'on_site', 'resolving', 'cancelled'],
  near_scene: ['on_site', 'resolving', 'cancelled'],
  on_site: ['resolving', 'resolved', 'cancelled'],
  resolving: ['resolved', 'cancelled'],
  // Back-compat
  in_progress: ['resolved', 'cancelled'],
  resolved: [],
  cancelled: [],
};

const ASSIGNMENT_TRANSITIONS = {
  pending: ['accepted', 'declined'],
  accepted: ['en_route', 'declined'],
  en_route: ['near_scene', 'on_site'],
  near_scene: ['on_site'],
  on_site: ['resolving'],
  resolving: ['completed'],
  completed: [],
  declined: [],
};

function validateIncidentStatusTransition(fromStatus, toStatus) {
  const allowed = INCIDENT_TRANSITIONS[fromStatus];
  if (!allowed || !allowed.includes(toStatus)) {
    throw Object.assign(
      new Error(`Invalid incident status transition: ${fromStatus} -> ${toStatus}. Allowed: ${(allowed || []).join(', ') || 'none'}`),
      { statusCode: 400 }
    );
  }
}

function validateAssignmentStatusTransition(fromStatus, toStatus) {
  const allowed = ASSIGNMENT_TRANSITIONS[fromStatus];
  if (!allowed || !allowed.includes(toStatus)) {
    throw Object.assign(
      new Error(`Invalid assignment status transition: ${fromStatus} -> ${toStatus}. Allowed: ${(allowed || []).join(', ') || 'none'}`),
      { statusCode: 400 }
    );
  }
}

module.exports = {
  validateIncidentStatusTransition,
  validateAssignmentStatusTransition,
  INCIDENT_TRANSITIONS,
  ASSIGNMENT_TRANSITIONS,
};
