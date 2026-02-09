const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000; // Matches Render's port

app.use(cors());
app.use(express.json());

// A simple route so we can test the URL
app.get('/', (req, res) => {
  res.send('Incident Response API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});