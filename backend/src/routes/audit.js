const express = require('express');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const auditController = require('../controllers/auditController');

const router = express.Router();

router.get(
  '/',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  auditController.list
);

module.exports = router;
