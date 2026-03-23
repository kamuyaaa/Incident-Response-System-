const Incident = require('../../incidents/models/Incident');
const asyncHandler = require('../../../shared/utils/asyncHandler');

const getResponderAssignments = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const assignments = await Incident.find({ responderId: userId }).sort({ createdAt: -1 });
  return res.json(assignments);
});

const updateIncidentStatus = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }

  const incident = await Incident.findOne({ id: incidentId });
  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  incident.status = status;
  await incident.save();

  return res.json({ message: 'Incident status updated', incident });
});

module.exports = {
  getResponderAssignments,
  updateIncidentStatus,
};