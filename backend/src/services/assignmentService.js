const Assignment = require('../models/Assignment');
const Incident = require('../models/Incident');
const auditService = require('./auditService');
const alertService = require('./alertService');
const { validateAssignmentStatusTransition } = require('../utils/statusTransitions');

async function assign(incidentId, responderId, assignedBy) {
  const incident = await Incident.findById(incidentId);
  if (!incident) throw Object.assign(new Error('Incident not found'), { statusCode: 404 });
  const existing = await Assignment.findOne({ incidentId, status: { $in: ['pending', 'accepted', 'en_route', 'on_site'] } });
  if (existing) throw Object.assign(new Error('Incident already has an active assignment'), { statusCode: 400 });

  const assignment = await Assignment.create({
    incidentId,
    responderId,
    assignedBy,
    status: 'pending',
  });
  await Incident.findByIdAndUpdate(incidentId, { status: 'assigned' });
  await auditService.append(assignedBy, null, 'assignment_create', 'Assignment', assignment._id.toString(), {
    incidentId,
    responderId,
  });
  await alertService.checkResponseTime(incident);
  return assignment;
}

async function updateStatus(assignmentId, status, actorId, actorRole) {
  const assignment = await Assignment.findById(assignmentId).populate('incidentId');
  if (!assignment) throw Object.assign(new Error('Assignment not found'), { statusCode: 404 });
  validateAssignmentStatusTransition(assignment.status, status);
  assignment.status = status;
  if (status === 'accepted') assignment.acceptedAt = new Date();
  if (status === 'completed') assignment.completedAt = new Date();
  await assignment.save();
  if (status === 'en_route' || status === 'on_site') {
    await Incident.findByIdAndUpdate(assignment.incidentId._id || assignment.incidentId, { status: 'in_progress' });
  }
  const incidentId = assignment.incidentId?._id || assignment.incidentId;
  if (status === 'completed')
    await Incident.findByIdAndUpdate(incidentId, { status: 'resolved', resolvedAt: new Date() });

  await auditService.append(actorId, actorRole, 'assignment_status_update', 'Assignment', assignmentId.toString(), {
    status,
  });
  const incident = await Incident.findById(incidentId).lean();
  if (incident) await alertService.checkResponseTime(incident);
  return assignment;
}

async function listByResponder(responderId, statusFilter) {
  const query = { responderId };
  if (statusFilter) query.status = statusFilter;
  return Assignment.find(query).sort({ assignedAt: -1 }).populate('incidentId').populate('assignedBy', 'name').lean();
}

async function listByIncident(incidentId) {
  return Assignment.find({ incidentId }).populate('responderId', 'name email serviceType').populate('assignedBy', 'name').lean();
}

module.exports = { assign, updateStatus, listByResponder, listByIncident };
