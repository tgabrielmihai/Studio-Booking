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
                password: hashedPassword
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

const { OAuth2Client } = require('google-auth-library');
    const googleClient = new OAuth2Client('502492439935-8tjou9dee9t9f5jjr1vakk7p0jbhh84j.apps.googleusercontent.com');

    const googleLogin = async (req, res, next) => {
        try {
            const { token } = req.body;
            
            // Verificăm autenticitatea token-ului la Google
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: '502492439935-8tjou9dee9t9f5jjr1vakk7p0jbhh84j.apps.googleusercontent.com', 
            });
            
            const payload = ticket.getPayload();
            const { email, name, sub: googleId } = payload;

            // Căutăm utilizatorul în baza ta de date
            let user = await prisma.user.findUnique({ where: { email } });

            // Dacă nu există, îi creăm un cont automat
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        name,
                        googleId,
                        role: 'ARTIST'
                    }
                });
            }

            // Generăm token-ul tău JWT obișnuit pentru ca restul aplicației să funcționeze
            const jwtToken = jwt.sign(
                { sub: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({ token: jwtToken, user });
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Autentificarea cu Google a eșuat.' });
        }
    };

    module.exports = { register, login, googleLogin };