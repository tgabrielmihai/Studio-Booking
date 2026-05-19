const express = require('express');
const cors = require('cors');
require('dotenv').config();


const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use((err, req, res, next) => {
    console.error('Eroare prinsă:', err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: err.message });
});

module.exports = app;