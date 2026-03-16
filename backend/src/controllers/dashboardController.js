const dashboardService = require('../services/dashboardService');

async function get(req, res, next) {
  try {
    const summary = await dashboardService.getDashboard(req.user);
    res.json({ data: summary });
  } catch (err) {
    next(err);
  }
}

module.exports = { get };
