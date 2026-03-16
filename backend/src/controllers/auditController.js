const auditService = require('../services/auditService');

async function list(req, res, next) {
  try {
    const filters = {};
    if (req.query.resource) filters.resource = req.query.resource;
    if (req.query.resourceId) filters.resourceId = req.query.resourceId;
    if (req.query.entityType) filters.entityType = req.query.entityType;
    if (req.query.entityId) filters.entityId = req.query.entityId;
    if (req.query.actorId) filters.actorId = req.query.actorId;
    if (req.query.from) filters.from = req.query.from;
    if (req.query.to) filters.to = req.query.to;
    const result = await auditService.list(filters, {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 50, 100),
    });
    res.json({ data: result.entries, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
