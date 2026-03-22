const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');

const prisma = new PrismaClient();

const combineDateAndTime = (dateString, timeString) => {
    return moment.tz(`${dateString} ${timeString}`, "YYYY-MM-DD HH:mm", "Europe/Vienna").toDate();
};

// Create
const createActivity = async (req, res) => {
    const { title, startDate, startTime, endDate, endTime, description } = req.body;

    if (!title || !startDate || !startTime || !endDate || !endTime || !description) {
        return res.status(400).json({ success: false, message: "Semua kolom wajib diisi!" });
    }

    try {
        const startDateTime = combineDateAndTime(startDate, startTime);
        const endDateTime = combineDateAndTime(endDate, endTime);

        if (endDateTime <= startDateTime) {
            return res.status(400).json({ success: false, message: "Waktu selesai harus lebih akhir dari waktu mulai!" });
        }

        const newActivity = await prisma.activity.create({
            data: {
                title,
                description,
                startTime: startDateTime,
                endTime: endDateTime
            }
        });

        res.status(201).json({ 
            success: true, 
            message: "Kegiatan berhasil ditambahkan", 
            data: newActivity 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Read
const getAllActivities = async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: { startTime: 'asc' }
        });

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil daftar kegiatan",
            data: activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Update
const updateActivity = async (req, res) => {
    const { id } = req.params;
    const { title, startDate, startTime, endDate, endTime, description } = req.body;

    try {
        const existingActivity = await prisma.activity.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingActivity) {
            return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan" });
        }

        let dataToUpdate = {
            title: title || existingActivity.title,
            description: description || existingActivity.description
        };

        if (startDate && startTime && endDate && endTime) {
            const startDateTime = combineDateAndTime(startDate, startTime);
            const endDateTime = combineDateAndTime(endDate, endTime);

            if (endDateTime <= startDateTime) {
                return res.status(400).json({ success: false, message: "Waktu selesai harus lebih akhir dari waktu mulai!" });
            }

            dataToUpdate.startTime = startDateTime;
            dataToUpdate.endTime = endDateTime;
        }

        const updatedActivity = await prisma.activity.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });

        res.status(200).json({ 
            success: true, 
            message: "Kegiatan berhasil diperbarui", 
            data: updatedActivity 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

// Delete
const deleteActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const existingActivity = await prisma.activity.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingActivity) {
            return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan" });
        }

        await prisma.activity.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ 
            success: true, 
            message: `Kegiatan "${existingActivity.title}" berhasil dihapus` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

module.exports = {
    createActivity,
    getAllActivities,
    updateActivity,
    deleteActivity
};