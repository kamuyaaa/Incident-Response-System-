const express = require('express');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get(
  '/responders',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  usersController.listResponders
);

module.exports = router;
