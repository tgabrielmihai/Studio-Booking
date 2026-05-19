const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getMentors } = require('../controllers/userController');

// Doar utilizatorii logați pot vedea lista de mentori
router.get('/mentors', authenticate, getMentors);

module.exports = router;