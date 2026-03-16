const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
    responderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'en_route', 'near_scene', 'on_site', 'resolving', 'completed', 'declined'],
      default: 'pending',
    },
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    completedAt: { type: Date },
    lastTrackedAt: { type: Date },
  },
  { timestamps: true }
);

assignmentSchema.index({ incidentId: 1 });
assignmentSchema.index({ responderId: 1, status: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
