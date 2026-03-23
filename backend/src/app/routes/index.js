const express = require('express');
const healthRoutes = require('../../features/health/routes/healthRoutes');
const authRoutes = require('../../features/auth/routes/authRoutes');
const accountRoutes = require('../../features/account/routes/accountRoutes');
const incidentsRoutes = require('../../features/incidents/routes/incidentsRoutes');
const reporterRoutes = require('../../features/reporter/routes/reporterRoutes');
const responderRoutes = require('../../features/responder/routes/responderRoutes');
const adminRoutes = require('../../features/admin/routes/adminRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/incidents', incidentsRoutes);
router.use('/reporter', reporterRoutes);
router.use('/responder', responderRoutes);
router.use('/admin', adminRoutes);

module.exports = router;