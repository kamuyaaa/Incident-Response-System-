const trackingService = require('../services/trackingService');
const incidentService = require('../services/incidentService');

async function byIncident(req, res, next) {
  try {
    const incident = await incidentService.getById(req.params.incidentId);
    // Reporters can only view their own incident.
    if (req.user.role === 'REPORTER' && incident.reporterId?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    const tracking = await trackingService.advanceTracking(req.params.incidentId, req.user._id, req.user.role);
    res.json({ data: tracking });
  } catch (err) {
    next(err);
  }
}

module.exports = { byIncident };

