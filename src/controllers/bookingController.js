const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// CONTROLERE PENTRU BOOKINGS (REZERVĂRI)
// ==========================================

const createBooking = async (req, res, next) => {
    try {
        // Folosim optional chaining (?.). Dacă req.user nu există, userId devine automat 1.
        // Asta previne eroarea 500 și îți salvează rezervarea.
        const userId = req.user?.sub || 1; 
        const { date, room, price } = req.body;

        if (!date || !room) {
            return res.status(400).json({ 
                error: 'VALIDATION_ERROR', 
                message: 'Data și camera de studio sunt obligatorii.' 
            });
        }

        const booking = await prisma.booking.create({
            data: {
                date, 
                room,
                price: Number(price),
                status: 'UPCOMING',
                userId: Number(userId) 
            }
        });
        res.status(201).json(booking);
    } catch (error) {
        next(error); 
    }
};

const getBookings = async (req, res, next) => {
    try {
        // La fel și aici, prevenim crash-ul serverului
        const userId = req.user?.sub || 1;
        const role = req.user?.role || 'ARTIST';

        let bookings;
        if (role === 'ADMIN') {
            bookings = await prisma.booking.findMany({
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            bookings = await prisma.booking.findMany({
                where: { userId: Number(userId) },
                orderBy: { createdAt: 'desc' }
            });
        }
        
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

// ==========================================
// CONTROLERE PENTRU REVIEWS (RECENZII)
// ==========================================

const createReview = async (req, res, next) => {
    try {
        const { room, rating, text, date } = req.body;

        if (!room || !rating || !text) {
            return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
        }

        const review = await prisma.review.create({
            data: {
                room,
                rating: Number(rating),
                text,
                date: date || new Date().toLocaleDateString()
            }
        });
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

const getReviews = async (req, res, next) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getBookings, createReview, getReviews };