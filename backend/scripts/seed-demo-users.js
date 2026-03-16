/**
 * Seed demo users for testing. Run: node scripts/seed-demo-users.js
 * Requires MONGODB_URI in .env or default connection.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const DEMO_USERS = [
  { email: 'admin@demo.com', password: 'Admin123!', name: 'Demo Admin', role: 'ADMIN' },
  { email: 'responder@demo.com', password: 'Responder123!', name: 'Demo Responder', role: 'RESPONDER' },
  { email: 'reporter@demo.com', password: 'Reporter123!', name: 'Demo Reporter', role: 'REPORTER' },
];

const SALT_ROUNDS = 10;

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ers';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  for (const u of DEMO_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`Skip (exists): ${u.email}`);
      continue;
    }
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
    await User.create({
      email: u.email,
      passwordHash,
      name: u.name,
      role: u.role,
    });
    console.log(`Created: ${u.email} (${u.role})`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
