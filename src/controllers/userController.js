const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMentors = async (req, res, next) => {
    try {
        const mentors = await prisma.user.findMany({
            where: { role: 'MENTOR' },
            select: { id: true, name: true, email: true } // Nu trimitem niciodată parolele către frontend!
        });
        res.status(200).json(mentors);
    } catch (err) {
        next(err);
    }
};

module.exports = { getMentors };