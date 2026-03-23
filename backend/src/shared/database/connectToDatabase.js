const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');

async function connectToDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
}

module.exports = connectToDatabase;