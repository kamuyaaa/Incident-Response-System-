const User = require("../../auth/models/User");
const Incident = require("../../incidents/models/Incident");
const asyncHandler = require("../../../shared/utils/asyncHandler");

const getIncidentsQueue = asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;
  const query = {};

  if (status && status !== "All") {
    query.status = status;
  }

  if (priority && priority !== "All") {
    query.priority = priority;
  }

  if (search) {
    query.$or = [
      { id: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const incidents = await Incident.find(query).sort({ createdAt: -1 });
  return res.json(incidents);
});

const getResponders = asyncHandler(async (req, res) => {
  const responders = await User.find({ role: "responder" }).sort({ fullname: 1 });

  return res.json(
    responders.map((responder) => ({
      id: responder.id,
      name: responder.fullname,
      email: responder.email,
      phone: responder.phone,
      role: responder.role,
      status: "Available",
      unit: "Response Unit",
      location: "Unknown",
    }))
  );
});

const assignResponder = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;
  const { responderId } = req.body;

  const incident = await Incident.findOne({ id: incidentId });
  if (!incident) {
    return res.status(404).json({ message: "Incident not found" });
  }

  const responder = await User.findOne({ id: responderId, role: "responder" });
  if (!responder) {
    return res.status(400).json({ message: "Valid responderId is required" });
  }

  incident.responderId = responder.id;
  incident.status = "Assigned";
  await incident.save();

  return res.json({
    message: "Responder assigned successfully",
    incident,
  });
});

module.exports = {
  getIncidentsQueue,
  getResponders,
  assignResponder,
};