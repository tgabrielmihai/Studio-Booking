const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { createSession, getSessions } = require('../controllers/sessionController');

router.post('/', authenticate, createSession);
router.get('/', authenticate, getSessions);

module.exports = router;