const prisma = require('../config/prisma');

// Read (with pagination)
const getAllSchedules = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 10;
        const skip = (page - 1) * limit;

        const [schedules, total] = await Promise.all([
            prisma.operationalHour.findMany({
                orderBy: { id: 'asc' },
                skip,
                take: limit
            }),
            prisma.operationalHour.count()
        ]);

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil jadwal operasional dari database",
            data: schedules,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
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

        const updateData = {};
        if (day !== undefined) updateData.day = day;
        if (finalOpen !== undefined) updateData.open = finalOpen;
        if (finalClose !== undefined) updateData.close = finalClose;
        if (isClosed !== undefined) updateData.isClosed = isClosed;

        const updatedSchedule = await prisma.operationalHour.update({
            where: { id: parseInt(id) },
            data: updateData
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