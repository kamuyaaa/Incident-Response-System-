const express = require('express');
const { param } = require('express-validator');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { handleValidation } = require('../middleware/validate');
const alertController = require('../controllers/alertController');

const router = express.Router();

router.get(
  '/',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  alertController.list
);

router.patch(
  '/:id/acknowledge',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  [param('id').isMongoId()],
  handleValidation,
  alertController.acknowledge
);

module.exports = router;
