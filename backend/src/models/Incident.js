const mongoose = require('mongoose');

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestReporter: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    title: { type: String, required: true, trim: true },
    type: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      required: true,
      enum: [
        'reported',
        'validated',
        'escalated',
        'assigned',
        'en_route',
        'near_scene',
        'on_site',
        'resolving',
        // Back-compat (older flow)
        'in_progress',
        'resolved',
        'cancelled',
      ],
      default: 'reported',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, trim: true },
    locationText: { type: String, trim: true },
    media: [
      {
        url: { type: String, required: true, trim: true },
        type: { type: String, trim: true, default: 'image' },
      },
    ],
    responseDeadline: { type: Date },
    responseThresholdMinutes: { type: Number },
    statusHistory: [statusHistoryEntrySchema],
    reportedAt: { type: Date, default: Date.now },
    validatedAt: { type: Date },
    escalatedAt: { type: Date },
    escalatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ status: 1, priority: -1 });
incidentSchema.index({ reporterId: 1 });
incidentSchema.index({ createdAt: -1 });

incidentSchema.pre('validate', function () {
  const hasReporter = this.reporterId != null;
  const hasGuest = this.guestReporter != null && typeof this.guestReporter === 'object';
  if (!hasReporter && !hasGuest) {
    throw new Error('Either reporterId or guestReporter is required');
  }
});

incidentSchema.virtual('latitude').get(function () {
  const c = this.location?.coordinates;
  return c && c.length >= 2 ? c[1] : null;
});
incidentSchema.virtual('longitude').get(function () {
  const c = this.location?.coordinates;
  return c && c.length >= 2 ? c[0] : null;
});
incidentSchema.set('toJSON', { virtuals: true });
incidentSchema.set('toObject', { virtuals: true });

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
