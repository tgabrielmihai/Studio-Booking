const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAdmin() {
    try {
        // Criptăm parola exact așa cum o face controller-ul tău
        const hashedPassword = await bcrypt.hash('admin', 12);
        
        await prisma.user.upsert({
            where: { email: 'admin' },
            update: { 
                password: hashedPassword // Actualizăm parola cu varianta hash-uită
            },
            create: {
                name: 'Administrator',
                email: 'admin',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        
        console.log('✅ Parola contului de admin a fost criptată și salvată cu succes!');
    } catch (error) {
        console.error('❌ Eroare:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixAdmin();