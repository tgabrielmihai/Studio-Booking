const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Funcția care trimite lista de echipamente către frontend
const getGear = async (req, res) => {
    try {
        const gearList = await prisma.gear.findMany();
        res.status(200).json(gearList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la preluarea echipamentelor din baza de date.' });
    }
};

// Funcție extra pentru a putea adăuga tu echipamente manual (prin Postman sau un script)
const addGear = async (req, res) => {
    try {
        const { name, type, description, status, price, imageUrl } = req.body;

        // Validare de bază: dacă lipsește numele, nu putem adăuga
        if (!name) {
            return res.status(400).json({ message: 'Numele echipamentului este obligatoriu.' });
        }

        const newGear = await prisma.gear.create({
            data: { 
                name: name,
                type: type || 'General', // Dacă e gol, pune 'General'
                description: description || 'Echipament profesional de studio.', // Valoare implicită
                status: status || 'Available',
                price: Number(price) || 0, // Forțează conversia în număr
                imageUrl: imageUrl || null // Dacă e gol, trimite null în baza de date
            }
        });

        res.status(201).json(newGear);
    } catch (error) {
        // AIci vom vedea în sfârșit eroarea reală în terminalul de backend dacă mai crapă ceva
        console.error("❌ EROARE CRITICALĂ LA ADĂUGARE GEAR:", error);
        res.status(500).json({ message: 'Eroare la adăugarea echipamentului.', detaliu: error.message });
    }
};

module.exports = { getGear, addGear };