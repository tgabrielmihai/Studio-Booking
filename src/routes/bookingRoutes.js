const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { createBooking, getBookings } = require('../controllers/bookingController');

// Rutele sunt protejate, doar utilizatorii logați pot rezerva
router.post('/', authenticate, createBooking);
router.get('/', authenticate, getBookings);

module.exports = router;