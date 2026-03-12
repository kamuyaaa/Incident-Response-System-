const assignmentService = require('../services/assignmentService');
const dispatchService = require('../services/dispatchService');
const incidentService = require('../services/incidentService');

async function recommend(req, res, next) {
  try {
    const incident = await incidentService.getById(req.params.incidentId);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const serviceType = req.query.serviceType || null;
    const capabilities = req.query.capabilities ? (Array.isArray(req.query.capabilities) ? req.query.capabilities : [req.query.capabilities]) : null;
    const responders = await dispatchService.getNearestAvailableResponders(
      incident.location.coordinates,
      { limit, serviceType, capabilities, incidentCategory: incident.category }
    );
    res.json({ data: responders });
  } catch (err) {
    next(err);
  }
}

async function assign(req, res, next) {
  try {
    const { incidentId, responderId } = req.body;
    const assignment = await assignmentService.assign(incidentId, responderId, req.user._id);
    res.status(201).json({ data: assignment });
  } catch (err) {
    next(err);
  }
}

async function myAssignments(req, res, next) {
  try {
    const list = await assignmentService.listByResponder(req.user._id, req.query.status);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const assignment = await assignmentService.updateStatus(
      req.params.id,
      req.body.status,
      req.user._id,
      req.user.role
    );
    res.json({ data: assignment });
  } catch (err) {
    next(err);
  }
}

async function listByIncident(req, res, next) {
  try {
    const list = await assignmentService.listByIncident(req.params.incidentId);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}

module.exports = { recommend, assign, myAssignments, updateStatus, listByIncident };
