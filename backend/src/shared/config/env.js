require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 10000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/incident-response-system',
};