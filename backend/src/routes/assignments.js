const express = require('express');
const { body, param, query } = require('express-validator');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { handleValidation } = require('../middleware/validate');
const assignmentController = require('../controllers/assignmentController');
const { VALID_SERVICE_TYPES } = require('../services/dispatchService');

const router = express.Router();

router.get(
  '/recommend/:incidentId',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  [
    param('incidentId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('serviceType').optional().isIn(VALID_SERVICE_TYPES),
    query('capabilities').optional(),
  ],
  handleValidation,
  assignmentController.recommend
);

router.post(
  '/',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  [body('incidentId').isMongoId(), body('responderId').isMongoId()],
  handleValidation,
  assignmentController.assign
);

router.get(
  '/my',
  auth,
  requireRole('RESPONDER'),
  assignmentController.myAssignments
);

router.patch(
  '/:id/status',
  auth,
  requireRole('RESPONDER'),
  [
    param('id').isMongoId(),
    body('status').isIn(['pending', 'accepted', 'en_route', 'on_site', 'completed', 'declined']),
  ],
  handleValidation,
  assignmentController.updateStatus
);

router.get(
  '/incident/:incidentId',
  auth,
  requireRole('ADMIN', 'SUPERVISOR', 'RESPONDER'),
  [param('incidentId').isMongoId()],
  handleValidation,
  assignmentController.listByIncident
);

module.exports = router;
