const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// PASUL 1: REZERVĂRI (BOOKINGS)
// ==========================================
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
router.delete('/reviews/:id', async (req, res) => {
    try {
        await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Review șters cu succes!' });
    } catch (error) { res.status(500).json({ error: 'Eroare la ștergerea review-ului.' }); }
});

router.post('/reviews', async (req, res) => {
    try {
        const { room, rating, text } = req.body;
        if (!room || !rating || !text) return res.status(400).json({ error: 'Câmpuri obligatorii!' });

        const review = await prisma.review.create({
            data: { room, rating: Number(rating), text, date: new Date().toLocaleDateString() }
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
        const { name, price, imageUrl } = req.body;
        if (!name || !price) return res.status(400).json({ error: 'Numele și prețul sunt obligatorii!' });

        const newGear = await prisma.gear.create({
            data: { name, price: Number(price), imageUrl: imageUrl || '' }
        });
        res.status(201).json(newGear);
    } catch (error) { res.status(500).json({ error: 'Eroare la adăugarea echipamentului.' }); }
});

module.exports = router;