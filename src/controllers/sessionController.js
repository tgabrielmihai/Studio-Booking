const sessionService = require('../services/sessionService');

const createSession = async (req, res, next) => {
    try {
        const studentId = req.user.sub; 
        const { mentorId, date, topic } = req.body;

        if (!mentorId || !date) {
            return res.status(400).json({ 
                error: 'VALIDATION_ERROR', 
                message: 'mentorId și data sunt obligatorii.' 
            });
        }

        const session = await sessionService.createSession({ studentId, mentorId, date, topic });
        res.status(201).json(session);
    } catch (error) {
        next(error); 
    }
};

const getSessions = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        const role = req.user.role;

        const sessions = await sessionService.getSessionsByUser(userId, role);
        res.status(200).json(sessions);
    } catch (error) {
        next(error);
    }
};

module.exports = { createSession, getSessions };