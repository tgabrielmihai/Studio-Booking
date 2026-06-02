const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const gearRoutes = require('./routes/gearRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

// Permite frontend-ului să comunice cu backend-ul fără erori de securitate
app.use(cors()); 

// Middleware pentru a parsa JSON-ul din request-uri
app.use(express.json());

// Rutele aplicației
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gear', gearRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'A apărut o eroare internă la nivelul serverului.' });
});

module.exports = app;