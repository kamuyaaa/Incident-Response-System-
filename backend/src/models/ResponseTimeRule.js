const mongoose = require('mongoose');

const responseTimeRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    maxMinutes: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ResponseTimeRule = mongoose.model('ResponseTimeRule', responseTimeRuleSchema);
module.exports = ResponseTimeRule;
