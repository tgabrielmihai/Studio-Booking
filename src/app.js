const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();


app.use(express.json());

// Rutele aplicației
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'A apărut o eroare internă la nivelul serverului.' });
});

module.exports = app;