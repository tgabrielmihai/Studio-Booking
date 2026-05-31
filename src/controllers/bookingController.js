const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBooking = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        const { date, studioRoom, equipment } = req.body;

        if (!date || !studioRoom) {
            return res.status(400).json({ 
                error: 'VALIDATION_ERROR', 
                message: 'Data și camera de studio sunt obligatorii.' 
            });
        }

        const booking = await prisma.booking.create({
            data: {
                date: new Date(date),
                studioRoom,
                equipment,
                userId
            }
        });
        res.status(201).json(booking);
    } catch (error) {
        next(error); 
    }
};

const getBookings = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        const role = req.user.role;

        let bookings;
        if (role === 'ADMIN') {
            // Adminul vede absolut toate rezervările din sistem
            bookings = await prisma.booking.findMany({
                include: { user: { select: { name: true, email: true } } }
            });
        } else {
            // Artistul vede doar rezervările lui
            bookings = await prisma.booking.findMany({
                where: { userId: userId }
            });
        }
        
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getBookings };