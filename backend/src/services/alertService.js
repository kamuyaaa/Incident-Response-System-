const Alert = require('../models/Alert');
const ResponseTimeRule = require('../models/ResponseTimeRule');
const Incident = require('../models/Incident');
const auditService = require('./auditService');

const ALERT_TYPE_OVERDUE = 'response_time_exceeded';

function getThresholdMinutes(incident) {
  if (incident.responseThresholdMinutes != null && incident.responseThresholdMinutes > 0) {
    return incident.responseThresholdMinutes;
  }
  if (incident.responseDeadline) {
    const deadline = new Date(incident.responseDeadline).getTime();
    const reported = new Date(incident.reportedAt || incident.createdAt).getTime();
    return Math.max(1, Math.round((deadline - reported) / (60 * 1000)));
  }
  return null;
}

async function getThresholdFromRule(incidentPriority) {
  const rule = await ResponseTimeRule.findOne({
    priority: incidentPriority,
    isActive: true,
  }).lean();
  return rule ? rule.maxMinutes : null;
}

async function isOverdue(incident) {
  if (incident.status === 'resolved' || incident.status === 'cancelled') return false;
  const reportedAt = new Date(incident.reportedAt || incident.createdAt).getTime();
  const elapsedMinutes = (Date.now() - reportedAt) / (60 * 1000);
  const threshold = getThresholdMinutes(incident) ?? await getThresholdFromRule(incident.priority);
  if (threshold == null) return false;
  return elapsedMinutes >= threshold;
}

async function createOverdueAlertIfNeeded(incident) {
  if (incident.status === 'resolved' || incident.status === 'cancelled') return null;
  const alreadyExists = await Alert.findOne({
    incidentId: incident._id,
    type: ALERT_TYPE_OVERDUE,
  });
  if (alreadyExists) return null;
  if (!(await isOverdue(incident))) return null;

  const threshold = getThresholdMinutes(incident) ?? (await getThresholdFromRule(incident.priority));
  const message = `Response time exceeded for incident (priority: ${incident.priority}, threshold: ${threshold} min)`;
  const alert = await Alert.create({
    incidentId: incident._id,
    type: ALERT_TYPE_OVERDUE,
    message,
    priority: incident.priority,
  });
  await auditService.append(null, null, 'alert_generated', 'Alert', alert._id.toString(), {
    incidentId: incident._id.toString(),
    type: ALERT_TYPE_OVERDUE,
    message,
    priority: incident.priority,
  });
  return alert;
}

async function checkResponseTime(incident) {
  return createOverdueAlertIfNeeded(incident);
}

async function runOverdueCheck() {
  const openIncidents = await Incident.find({
    status: { $nin: ['resolved', 'cancelled'] },
  }).lean();
  const created = [];
  for (const inc of openIncidents) {
    const alert = await createOverdueAlertIfNeeded(inc);
    if (alert) created.push(alert);
  }
  return created;
}

async function listAlerts(filters = {}, options = {}) {
  const { page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;
  const query = {};
  if (filters.acknowledged !== undefined) query.acknowledged = filters.acknowledged;
  const [items, total] = await Promise.all([
    Alert.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('incidentId').lean(),
    Alert.countDocuments(query),
  ]);
  return { items, total, page, limit };
}

async function acknowledge(alertId, userId) {
  const alert = await Alert.findByIdAndUpdate(
    alertId,
    { acknowledged: true, acknowledgedAt: new Date(), acknowledgedBy: userId },
    { new: true }
  );
  if (!alert) throw Object.assign(new Error('Alert not found'), { statusCode: 404 });
  return alert;
}

module.exports = {
  checkResponseTime,
  runOverdueCheck,
  listAlerts,
  acknowledge,
  isOverdue,
  getThresholdMinutes,
  ALERT_TYPE_OVERDUE,
};
