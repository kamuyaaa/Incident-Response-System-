const express = require('express');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const demoController = require('../controllers/demoController');

const router = express.Router();

router.get('/accounts', demoController.listAccounts);
router.post('/reset', auth, requireRole('ADMIN', 'SUPERVISOR'), demoController.reset);

module.exports = router;
