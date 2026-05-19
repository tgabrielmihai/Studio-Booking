const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSession = async ({ studentId, mentorId, date, topic }) => {
    
    const mentor = await prisma.user.findUnique({ where: { id: mentorId } });
    
    if (!mentor || mentor.role !== 'MENTOR') {
        throw new Error('Utilizatorul selectat nu este un mentor valid.');
    }
    if (!mentor.disponibilitate) {
        throw new Error('Mentorul nu este disponibil în acest moment.');
    }

    
    const session = await prisma.session.create({
        data: {
            studentId,
            mentorId,
            date: new Date(date),
            topic
        }
    });

    return session;
};

const getSessionsByUser = async (userId, role) => {
    
    if (role === 'STUDENT') {
        return await prisma.session.findMany({
            where: { studentId: userId },
            include: { mentor: { select: { name: true, email: true } } } 
        });
    } else {
        return await prisma.session.findMany({
            where: { mentorId: userId },
            include: { student: { select: { name: true, email: true } } }
        });
    }
};

module.exports = { createSession, getSessionsByUser }; 

module.exports = { createSession };