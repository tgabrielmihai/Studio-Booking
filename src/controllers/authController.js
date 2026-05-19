const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await prisma.user.create({
            data: { 
                name, 
                email, 
                password: hashedPassword, 
                role: role || 'STUDENT' 
            }
        });
        
        res.status(201).json({ message: 'Cont creat cu succes', userId: user.id });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Email sau parolă incorectă.' });
        }

        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Email sau parolă incorectă.' });
        }

        // Generăm token-ul JWT 
        const token = jwt.sign(
            { sub: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };