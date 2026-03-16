const AuditLog = require('../models/AuditLog');

function append(actorId, actorRole, action, entityType, entityId, details = {}) {
  const entry = {
    actorId: actorId ?? null,
    actorRole: actorRole ?? null,
    action,
    entityType,
    entityId: entityId ?? null,
    details,
    resource: entityType,
    resourceId: entityId ?? null,
    payload: details,
    timestamp: new Date(),
  };
  return AuditLog.create(entry);
}

async function list(filters = {}, options = {}) {
  const { page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;
  const query = {};
  if (filters.resource) query.resource = filters.resource;
  if (filters.resourceId) query.resourceId = filters.resourceId;
  if (filters.entityType) query.entityType = filters.entityType;
  if (filters.entityId) query.entityId = filters.entityId;
  if (filters.actorId) query.actorId = filters.actorId;
  if (filters.from || filters.to) {
    query.timestamp = {};
    if (filters.from) query.timestamp.$gte = new Date(filters.from);
    if (filters.to) query.timestamp.$lte = new Date(filters.to);
  }

  const [entries, total] = await Promise.all([
    AuditLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(query),
  ]);
  return { entries, total, page, limit };
}

module.exports = { append, list };
