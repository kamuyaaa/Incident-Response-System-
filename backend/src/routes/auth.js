const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { handleValidation } = require('../middleware/validate');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
    body('role').optional().isIn(['REPORTER', 'ADMIN', 'RESPONDER', 'SUPERVISOR']),
  ],
  handleValidation,
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  handleValidation,
  authController.login
);

router.get('/me', auth, authController.me);

module.exports = router;
