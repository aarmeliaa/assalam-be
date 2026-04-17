const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Read
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.operationalHour.findMany({
            orderBy: { id: 'asc' }
        });

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil jadwal operasional dari database",
            data: schedules
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Update
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { day, open, close, isClosed } = req.body;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Format ID tidak valid, harus berupa angka!' });
        }
        
        const existingSchedule = await prisma.operationalHour.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingSchedule) {
            return res.status(404).json({
                success: false,
                message: `Jadwal dengan ID ${id} tidak ditemukan`
            });
        }

        let finalOpen = open;
        let finalClose = close;

        if (isClosed === true) {
            finalOpen = "-";
            finalClose = "-";
        }

        // Update ke database
        const updatedSchedule = await prisma.operationalHour.update({
            where: { id: parseInt(id) },
            data: {
                day: day || existingSchedule.day,
                open: finalOpen || existingSchedule.open,
                close: finalClose || existingSchedule.close,
                isClosed: isClosed !== undefined ? isClosed : existingSchedule.isClosed
    
            }
        });

        res.status(200).json({
            success: true,
            message: "Jadwal berhasil diupdate di database",
            data: updatedSchedule
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Create
const addSchedule = async (req, res) => {
    const { day, open, close, isClosed } = req.body;

    if (!day) {
        return res.status(400).json({ success: false, message: "Nama hari wajib diisi!" });
    }

    try {
        const newSchedule = await prisma.operationalHour.create({
            data: {
                day,
                open: open || "-",
                close: close || "-",
                isClosed: isClosed || false
            }
        });

        res.status(201).json({ success: true, message: "Jadwal berhasil ditambahkan ke database", data: newSchedule });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: `Jadwal hari ${day} sudah ada!` });
        }
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Delete
const deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Format ID tidak valid, harus berupa angka!' });
        }

        const existingSchedule = await prisma.operationalHour.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingSchedule) {
            return res.status(404).json({ success: false, message: `Jadwal dengan ID ${id} tidak ditemukan` });
        }

        await prisma.operationalHour.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ success: true, message: `Jadwal dengan ID ${id} (${existingSchedule.day}) berhasil dihapus dari database` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Read by ID
const getOperationalHourById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Format ID tidak valid, harus berupa angka!' });
        }

        const opHour = await prisma.operationalHour.findUnique({
            where: { id: parseInt(id) }
        });

        if (!opHour) {
            return res.status(404).json({ success: false, message: 'Data jam operasional tidak ditemukan!' });
        }

        res.status(200).json({ success: true, data: opHour });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil detail jam operasional: ' + error.message });
    }
};

module.exports = {
    getAllSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getOperationalHourById
};