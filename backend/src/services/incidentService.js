const Incident = require('../models/Incident');
const auditService = require('./auditService');
const alertService = require('./alertService');
const { validateIncidentStatusTransition } = require('../utils/statusTransitions');

function parseCoordinates(data) {
  const coords = data.coordinates;
  if (Array.isArray(coords) && coords.length >= 2) return coords;
  const lat = data.latitude ?? (coords && coords.latitude);
  const lng = data.longitude ?? (coords && coords.longitude);
  if (lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)))
    return [Number(lng), Number(lat)];
  return null;
}

async function create(reporterId, data) {
  const coords = parseCoordinates(data);
  if (!coords || coords.length < 2) throw Object.assign(new Error('Coordinates required'), { statusCode: 400 });

  const priority = data.priority || data.severity || 'medium';
  const incident = await Incident.create({
    reporterId,
    title: data.title,
    type: data.type || data.category,
    category: data.category,
    description: data.description,
    severity: priority,
    priority,
    location: { type: 'Point', coordinates: coords },
    address: data.address,
    locationText: data.locationText,
    responseDeadline: data.responseDeadline ? new Date(data.responseDeadline) : undefined,
    responseThresholdMinutes: data.responseThresholdMinutes,
    statusHistory: [{ status: 'reported', at: new Date() }],
  });
  await auditService.append(reporterId, 'REPORTER', 'incident_created', 'Incident', incident._id.toString(), {
    title: incident.title,
    category: incident.category,
  });
  await alertService.checkResponseTime(incident);
  return incident;
}

async function createGuestReport(data) {
  const coords = parseCoordinates(data);
  if (!coords || coords.length < 2) throw Object.assign(new Error('Coordinates required'), { statusCode: 400 });
  const category = (data.type || data.category || '').trim();
  if (!category) throw Object.assign(new Error('Incident type/category is required'), { statusCode: 400 });
  const description = (data.description || '').trim();
  if (!description) throw Object.assign(new Error('Description is required'), { statusCode: 400 });

  const priority = data.severity || data.priority || 'medium';
  const validPriority = ['low', 'medium', 'high', 'critical'].includes(priority) ? priority : 'medium';
  const guestReporter = data.guestReporter && typeof data.guestReporter === 'object'
    ? {
        name: (data.guestReporter.name || '').trim() || undefined,
        phone: (data.guestReporter.phone || '').trim() || undefined,
      }
    : {};

  const incident = await Incident.create({
    reporterId: undefined,
    guestReporter,
    title: description.slice(0, 120),
    type: category,
    category,
    description,
    severity: validPriority,
    priority: validPriority,
    location: { type: 'Point', coordinates: coords },
    address: (data.address || '').trim() || undefined,
    locationText: (data.locationText || data.address || '').trim() || undefined,
    media: (data.media || []).slice(0, 10).filter((m) => m && m.url),
    statusHistory: [{ status: 'reported', at: new Date() }],
  });
  await auditService.append(null, 'guest', 'incident_created', 'Incident', incident._id.toString(), {
    title: incident.title,
    category: incident.category,
    guestReporter: incident.guestReporter,
  });
  await alertService.checkResponseTime(incident);
  return incident;
}

async function update(incidentId, updates, actorId, actorRole) {
  const incident = await Incident.findById(incidentId);
  if (!incident) throw Object.assign(new Error('Incident not found'), { statusCode: 404 });
  if (updates.status !== undefined) {
    validateIncidentStatusTransition(incident.status, updates.status);
  }
  const prev = { status: incident.status, priority: incident.priority };
  if (updates.status !== undefined) {
    incident.status = updates.status;
    if (!incident.statusHistory) incident.statusHistory = [];
    incident.statusHistory.push({ status: updates.status, at: new Date(), by: actorId, note: updates.note });
  }
  if (updates.priority !== undefined) incident.priority = updates.priority;
  if (updates.severity !== undefined) incident.severity = updates.severity;
  if (updates.validatedAt !== undefined) incident.validatedAt = updates.validatedAt;
  if (updates.escalatedAt !== undefined) incident.escalatedAt = updates.escalatedAt;
  if (updates.escalatedBy !== undefined) incident.escalatedBy = updates.escalatedBy;
  if (updates.resolvedAt !== undefined) incident.resolvedAt = updates.resolvedAt;
  if (updates.responseDeadline !== undefined) incident.responseDeadline = updates.responseDeadline ? new Date(updates.responseDeadline) : updates.responseDeadline;
  if (updates.responseThresholdMinutes !== undefined) incident.responseThresholdMinutes = updates.responseThresholdMinutes;
  await incident.save();
  await auditService.append(actorId, actorRole, 'incident_update', 'Incident', incidentId.toString(), {
    updates,
    previous: prev,
  });
  await alertService.checkResponseTime(incident);
  return incident;
}

async function list(filters = {}, options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;
  const query = {};
  if (filters.reporterId) query.reporterId = filters.reporterId;
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  const [items, total] = await Promise.all([
    Incident.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('reporterId', 'name email').lean(),
    Incident.countDocuments(query),
  ]);
  return { items, total, page, limit };
}

async function getById(id) {
  const incident = await Incident.findById(id).populate('reporterId', 'name email').lean();
  if (!incident) throw Object.assign(new Error('Incident not found'), { statusCode: 404 });
  return incident;
}

module.exports = { create, createGuestReport, update, list, getById };
