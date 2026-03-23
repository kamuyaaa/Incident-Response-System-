const express = require('express');
const { getProfile, updateProfile } = require('../controllers/accountController');

const router = express.Router();

router.get('/profile/:userId', getProfile);
router.patch('/profile/:userId', updateProfile);

module.exports = router;