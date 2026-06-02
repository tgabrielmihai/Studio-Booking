const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateData() {
    try {
        console.log('⏳ Extrag datele din MockAPI...');
        const response = await axios.get('https://6a1de398bcc4f20d5ca53058.mockapi.io/gear');
        const mockData = response.data;

        console.log(`✅ Am găsit ${mockData.length} echipamente. Încep inserarea în PostgreSQL...`);

        const formattedData = mockData.map(item => ({
            name: item.name,
            price: Number(item.price),
            imageUrl: item.imageUrl || ''
        }));

        const result = await prisma.gear.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        console.log(`🎉 Succes! Au fost adăugate ${result.count} echipamente în baza de date.`);
    } catch (error) {
        console.error('❌ Eroare fatală la migrare:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateData();