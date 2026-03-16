const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    type: { type: String, required: true, default: 'response_time_exceeded' },
    message: { type: String, required: true },
    priority: { type: String },
    acknowledged: { type: Boolean, default: false },
    acknowledgedAt: { type: Date },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

alertSchema.index({ incidentId: 1 });
alertSchema.index({ createdAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
