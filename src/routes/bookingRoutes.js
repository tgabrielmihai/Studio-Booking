const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController'); // Ajustează calea dacă e nevoie

// Rute pentru Rezervări
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);

// Rute pentru Recenzii (Review-uri)
router.post('/reviews', bookingController.createReview);
router.get('/reviews', bookingController.getReviews);

module.exports = router;