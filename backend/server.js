const createApp = require('./src/app/createApp');
const { PORT } = require('./src/shared/config/env');
const connectToDatabase = require('./src/shared/database/connectToDatabase');
const seedDatabase = require('./src/shared/database/seedDatabase');

const app = createApp();

async function startServer() {
  await connectToDatabase();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});