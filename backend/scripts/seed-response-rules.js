require('dotenv').config();
const mongoose = require('mongoose');
const ResponseTimeRule = require('../src/models/ResponseTimeRule');

const rules = [
  { name: 'Critical', priority: 'critical', maxMinutes: 15 },
  { name: 'High', priority: 'high', maxMinutes: 30 },
  { name: 'Medium', priority: 'medium', maxMinutes: 60 },
  { name: 'Low', priority: 'low', maxMinutes: 120 },
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/emergency-response';
  await mongoose.connect(uri);
  await ResponseTimeRule.deleteMany({});
  await ResponseTimeRule.insertMany(rules);
  console.log('Response time rules seeded:', rules.length);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
