const express = require('express');
const { getReporterReports } = require('../controllers/reporterController');

const router = express.Router();

router.get('/:userId/reports', getReporterReports);

module.exports = router;