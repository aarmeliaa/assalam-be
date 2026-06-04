const express = require('express');
const router = express.Router();
const operationalController = require('../controllers/operationalController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validateCreateOperationalHour, validateId } = require('../middlewares/validation');

/**
 * @openapi
 * /api/operational-hours:
 *   get:
 *     tags: [Operational Hours]
 *     summary: Daftar jam operasional
 *     responses:
 *       200:
 *         description: Berhasil mengambil jadwal operasional
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OperationalHour'
 *   post:
 *     tags: [Operational Hours]
 *     summary: Tambah jam operasional (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [day, open, close]
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *               open:
 *                 type: string
 *                 example: "08:00"
 *               close:
 *                 type: string
 *                 example: "20:00"
 *               isClosed:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Jadwal berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       409:
 *         description: Jadwal hari tersebut sudah ada
 */
router.get('/', operationalController.getAllSchedules);
router.post('/', verifyToken, checkRole(['ADMIN']), validateCreateOperationalHour, operationalController.addSchedule);

/**
 * @openapi
 * /api/operational-hours/{id}:
 *   get:
 *     tags: [Operational Hours]
 *     summary: Detail jam operasional berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail jam operasional
 *       404:
 *         description: Data tidak ditemukan
 *   put:
 *     tags: [Operational Hours]
 *     summary: Edit jam operasional (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *               open:
 *                 type: string
 *                 example: "08:00"
 *               close:
 *                 type: string
 *                 example: "20:00"
 *               isClosed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Jadwal berhasil diperbarui
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Jadwal tidak ditemukan
 *   delete:
 *     tags: [Operational Hours]
 *     summary: Hapus jam operasional (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Jadwal berhasil dihapus
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Jadwal tidak ditemukan
 */
router.get('/:id', validateId, operationalController.getOperationalHourById);
router.put('/:id', verifyToken, checkRole(['ADMIN']), validateId, operationalController.updateSchedule);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), validateId, operationalController.deleteSchedule);

module.exports = router;