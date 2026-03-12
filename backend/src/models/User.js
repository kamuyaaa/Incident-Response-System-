const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ['REPORTER', 'ADMIN', 'RESPONDER', 'SUPERVISOR'],
    },
    isAvailable: { type: Boolean, default: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], default: [0, 0] },
    },
    serviceType: { type: String, trim: true, default: 'general' },
    capabilities: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1, isAvailable: 1 });
userSchema.index({ role: 1, isAvailable: 1, serviceType: 1 });

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
