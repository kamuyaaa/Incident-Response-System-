const INCIDENT_TRANSITIONS = {
  reported: ['validated', 'cancelled'],
  validated: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: [],
  cancelled: [],
};

const ASSIGNMENT_TRANSITIONS = {
  pending: ['accepted', 'declined'],
  accepted: ['en_route', 'declined'],
  en_route: ['on_site'],
  on_site: ['completed'],
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
