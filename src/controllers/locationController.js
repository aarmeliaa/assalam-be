const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Read
const getMosqueLocations = async (req, res) => {
    try {
        const locations = await prisma.mosqueLocation.findMany();
        res.status(200).json({ success: true, data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil titik lokasi: ' + error.message });
    }
};

module.exports = { getMosqueLocations };