const express = require('express');
const { getApiStatus } = require('../controllers/healthController');

const router = express.Router();

router.get('/', getApiStatus);

module.exports = router;