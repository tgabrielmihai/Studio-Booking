const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBooking = async (req, res) => {
    try {
        const { room, date, price, userId } = req.body;

        // Validare minimală
        if (!room || !date) {
            return res.status(400).json({ message: 'Camera și data sunt obligatorii.' });
        }

        // Creăm rezervarea legată structural de contul utilizatorului (Normal sau Google)
        const newBooking = await prisma.booking.create({
            data: {
                room: room,
                date: date,
                status: 'UPCOMING',
                userId: userId ? parseInt(userId) : null // Mapează cheia externă către User
            },
            // Includem utilizatorul în răspuns pentru validare imediată în consolă
            include: { user: true } 
        });

        res.status(201).json(newBooking);
    } catch (error) {
        console.error("EROARE LA SALVAREA REZERVĂRII IN CONTROLLER:", error);
        res.status(500).json({ message: 'Eroare internă la crearea rezervării.' });
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