const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Assignment = require('../models/Assignment');
const Alert = require('../models/Alert');
const User = require('../models/User');

async function getAdminSummary() {
  const [byStatus, recentIncidents, unackAlertsCount, respondersAvailable] = await Promise.all([
    Incident.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Incident.find().sort({ createdAt: -1 }).limit(10).populate('reporterId', 'name email').lean(),
    Alert.countDocuments({ acknowledged: false }),
    User.countDocuments({ role: 'RESPONDER', isAvailable: true }),
  ]);
  const countsByStatus = byStatus.reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});
  const totalIncidents = Object.values(countsByStatus).reduce((a, b) => a + b, 0);
  const activeIncidents =
    (countsByStatus.reported || 0) +
    (countsByStatus.validated || 0) +
    (countsByStatus.assigned || 0) +
    (countsByStatus.in_progress || 0);
  const resolvedIncidents = countsByStatus.resolved || 0;

  return {
    role: 'ADMIN',
    incidentCountsByStatus: countsByStatus,
    totalIncidents,
    activeIncidents,
    resolvedIncidents,
    recentIncidents,
    unacknowledgedAlertsCount: unackAlertsCount,
    respondersAvailable,
  };
}

async function getSupervisorSummary() {
  return getAdminSummary().then((s) => ({ ...s, role: 'SUPERVISOR' }));
}

async function getResponderSummary(responderId) {
  const [assignments, countsByStatus] = await Promise.all([
    Assignment.find({ responderId }).sort({ assignedAt: -1 }).limit(10).populate('incidentId').populate('assignedBy', 'name').lean(),
    Assignment.aggregate([
      { $match: { responderId: new mongoose.Types.ObjectId(responderId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);
  const assignmentCountsByStatus = (countsByStatus || []).reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});
  return {
    role: 'RESPONDER',
    assignmentCountsByStatus,
    recentAssignments: assignments,
  };
}

async function getReporterSummary(reporterId) {
  const [byStatus, recent] = await Promise.all([
    Incident.aggregate([
      { $match: { reporterId: new mongoose.Types.ObjectId(reporterId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Incident.find({ reporterId }).sort({ createdAt: -1 }).limit(10).populate('reporterId', 'name email').lean(),
  ]);
  const countsByStatus = (byStatus || []).reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});
  return {
    role: 'REPORTER',
    myIncidentCountsByStatus: countsByStatus,
    recentIncidents: recent,
  };
}

async function getDashboard(user) {
  if (user.role === 'ADMIN') return getAdminSummary();
  if (user.role === 'SUPERVISOR') return getSupervisorSummary();
  if (user.role === 'RESPONDER') return getResponderSummary(user._id);
  if (user.role === 'REPORTER') return getReporterSummary(user._id);
  return { role: user.role };
}

module.exports = { getDashboard, getAdminSummary, getResponderSummary, getReporterSummary };
