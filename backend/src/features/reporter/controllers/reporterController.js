const Incident = require('../../incidents/models/Incident');
const asyncHandler = require('../../../shared/utils/asyncHandler');

const getReporterReports = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const reports = await Incident.find({ reporterId: userId }).sort({ createdAt: -1 });
  return res.json(reports);
});

module.exports = {
  getReporterReports,
};