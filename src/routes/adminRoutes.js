const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// PASUL 1: REZERVĂRI (BOOKINGS)
// ==========================================

router.get('/bookings', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: true } // Include obiectul user cu name, email etc.
        });
        res.json(bookings);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/bookings/:id/complete', async (req, res) => {
    try {
        await prisma.booking.update({
            where: { id: parseInt(req.params.id) },
            data: { status: 'COMPLETED' }
        });
        res.json({ message: 'Sesiune marcată ca finalizată!' });
    } catch (error) { res.status(500).json({ error: 'Eroare la update status.' }); }
});

router.delete('/bookings/:id', async (req, res) => {
    try {
        await prisma.booking.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Rezervare ștearsă cu succes!' });
    } catch (error) { res.status(500).json({ error: 'Eroare la ștergerea rezervării.' }); }
});

// ==========================================
// PASUL 2: RECENZII (REVIEWS)
// ==========================================
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: { user: true } // Include datele utilizatorului care a lăsat recenzia
        });
        res.json(reviews);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/reviews/:id', async (req, res) => {
    try {
        await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Review șters cu succes!' });
    } catch (error) { res.status(500).json({ error: 'Eroare la ștergerea review-ului.' }); }
});

router.post('/reviews', async (req, res) => {
    try {
        const { room, rating, text, date, userId } = req.body;
        if (!room || !rating || !text) return res.status(400).json({ error: 'Câmpuri obligatorii!' });

        const review = await prisma.review.create({
            data: { 
                room, 
                rating: Number(rating), 
                text, 
                date: date || new Date().toLocaleDateString(),
                userId: userId ? parseInt(userId) : null // Salvăm ID-ul utilizatorului în baza de date
            },
            include: { user: true }
        });
        res.status(201).json(review);
    } catch (error) { res.status(500).json({ error: 'Eroare la adăugarea review-ului.' }); }
});

// ==========================================
// PASUL 3: ECHIPAMENTE (GEAR)
// ==========================================
router.delete('/gear/:id', async (req, res) => {
    try {
        await prisma.gear.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Echipament șters cu succes!' });
    } catch (error) { res.status(500).json({ error: 'Eroare la ștergerea echipamentului.' }); }
});

router.post('/gear', async (req, res) => {
    try {
        // Prindem TOATE câmpurile trimise de noul formular din AdminPanel.jsx
        const { name, price, imageUrl, type, description } = req.body;
        
        // Validare de bază
        if (!name || !price) {
            return res.status(400).json({ error: 'Numele și prețul sunt obligatorii!' });
        }

        // Salvăm în baza de date incluzând type și description pentru a evita eroarea 500
        const newGear = await prisma.gear.create({
            data: { 
                name, 
                price: Number(price), 
                imageUrl: imageUrl || '',
                type: type || 'General', // Fallback dacă cumva lipsește din frontend
                description: description || 'Echipament profesional de studio.' // Fallback
            }
        });
        
        res.status(201).json(newGear);
    } catch (error) { 
        console.error("EROARE PRISMA LA INSERARE GEAR:", error);
        res.status(500).json({ error: 'Eroare la adăugarea echipamentului în baza de date.' }); 
    }
});

module.exports = router;