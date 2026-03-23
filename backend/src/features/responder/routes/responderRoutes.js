const express = require('express');
const { getResponderAssignments, updateIncidentStatus } = require('../controllers/responderController');

const router = express.Router();

router.get('/:userId/assignments', getResponderAssignments);
router.patch('/incidents/:incidentId/status', updateIncidentStatus);

module.exports = router;