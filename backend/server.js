require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { port } = require('./src/config');
const { startOverdueAlertScheduler } = require('./src/services/scheduler');

async function start() {
  await connectDB();
  startOverdueAlertScheduler();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
