// Mock Database sementara
let schedules = [
    { id: 1, day: "Senin", open: "04:00", close: "21:00", isClosed: false },
    { id: 2, day: "Jumat", open: "03:30", close: "22:00", isClosed: false }
];

const getAllSchedules = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Berhasil mengambil jadwal operasional",
        data: schedules
    });
};

const addSchedule = (req, res) => {
    const { day, open, close, isClosed } = req.body;

    if (!day) {
        return res.status(400).json({
            success: false,
            message: "Nama hari wajib diisi!"
        });
    }

    const newSchedule = {
        id: schedules.length > 0 ? schedules[schedules.length - 1].id + 1 : 1,
        day,
        open: open || "-",
        close: close || "-",
        isClosed: isClosed || false
    };

    schedules.push(newSchedule);

    res.status(201).json({
        success: true,
        message: "Jadwal berhasil ditambahkan",
        data: newSchedule
    });
};

const updateSchedule = (req, res) => {
    const { id } = req.params;
    const { day, open, close, isClosed } = req.body;

    const index = schedules.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Jadwal dengan ID ${id} tidak ditemukan`
        });
    }

    schedules[index] = {
        ...schedules[index],
        day: day || schedules[index].day,
        open: open || schedules[index].open,
        close: close || schedules[index].close,
        isClosed: isClosed !== undefined ? isClosed : schedules[index].isClosed
    };

    res.status(200).json({
        success: true,
        message: "Jadwal berhasil diupdate",
        data: schedules[index]
    });
};

const deleteSchedule = (req, res) => {
    const { id } = req.params;

    const index = schedules.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Jadwal dengan ID ${id} tidak ditemukan`
        });
    }

    schedules.splice(index, 1);

    res.status(200).json({
        success: true,
        message: `Jadwal dengan ID ${id} berhasil dihapus`
    });
};

module.exports = {
    getAllSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule
};