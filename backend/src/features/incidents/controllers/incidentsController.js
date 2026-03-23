const Incident = require('../models/Incident');
const asyncHandler = require('../../../shared/utils/asyncHandler');

const listIncidents = asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;
  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (priority && priority !== 'All') {
    query.priority = priority;
  }

  if (search) {
    query.$or = [
      { id: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const incidents = await Incident.find(query).sort({ createdAt: -1 });
  return res.json(incidents);
});

const getIncidentById = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;
  const incident = await Incident.findOne({ id: incidentId });

  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  return res.json(incident);
});

const createIncident = asyncHandler(async (req, res) => {
  const { reporterId, type, description, location, priority = 'Medium' } = req.body;

  if (!reporterId || !type || !description || !location) {
    return res.status(400).json({ message: 'reporterId, type, description and location are required' });
  }

  const incidentsCount = await Incident.countDocuments();
  const incident = await Incident.create({
    id: `INC-${10000 + incidentsCount + 1}`,
    reporterId,
    type,
    description,
    location,
    status: 'Unassigned',
    priority,
    responderId: null,
    createdAt: new Date(),
  });

  return res.status(201).json(incident);
});

module.exports = {
  listIncidents,
  getIncidentById,
  createIncident,
};