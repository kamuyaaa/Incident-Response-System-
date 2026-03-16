const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const assignmentRoutes = require('./routes/assignments');
const alertRoutes = require('./routes/alerts');
const auditRoutes = require('./routes/audit');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const demoRoutes = require('./routes/demo');
const trackingRoutes = require('./routes/tracking');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.json({ message: 'Emergency Response Coordination API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/tracking', trackingRoutes);

app.use(errorHandler);

module.exports = app;
