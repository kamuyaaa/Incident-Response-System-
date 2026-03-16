const express = require('express');
const { param } = require('express-validator');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { handleValidation } = require('../middleware/validate');
const trackingController = require('../controllers/trackingController');

const router = express.Router();

router.get(
  '/:incidentId',
  auth,
  requireRole('REPORTER', 'ADMIN', 'SUPERVISOR', 'RESPONDER'),
  [param('incidentId').isMongoId()],
  handleValidation,
  trackingController.byIncident
);

module.exports = router;

