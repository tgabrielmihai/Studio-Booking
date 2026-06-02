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
        const { name, type, description, status } = req.body;
        const newGear = await prisma.gear.create({
            data: { 
                name, 
                type, 
                description, 
                status: status || 'Available' 
            }
        });
        res.status(201).json(newGear);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la adăugarea echipamentului.' });
    }
};

module.exports = { getGear, addGear };