const alertService = require('../services/alertService');

async function list(req, res, next) {
  try {
    const filters = {};
    if (req.query.acknowledged !== undefined) filters.acknowledged = req.query.acknowledged === 'true';
    const result = await alertService.listAlerts(filters, {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 50, 100),
    });
    res.json({ data: result.items, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
}

async function acknowledge(req, res, next) {
  try {
    const alert = await alertService.acknowledge(req.params.id, req.user._id);
    res.json({ data: alert });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, acknowledge };
