const express = require('express');
const { listIncidents, getIncidentById, createIncident } = require('../controllers/incidentsController');

const router = express.Router();

router.get('/', listIncidents);
router.post('/', createIncident);
router.get('/:incidentId', getIncidentById);

module.exports = router;