const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validateCreateActivity, validateUpdateActivity, validateId } = require('../middlewares/validation');

/**
 * @openapi
 * /api/activities:
 *   get:
 *     tags: [Activities]
 *     summary: Daftar semua kegiatan
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kegiatan
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
 *                     $ref: '#/components/schemas/Activity'
 *   post:
 *     tags: [Activities]
 *     summary: Buat kegiatan baru (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, startDate, startTime, endDate, endTime]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul kegiatan (3-200 karakter)
 *               description:
 *                 type: string
 *                 description: Deskripsi kegiatan (minimal 10 karakter)
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               endTime:
 *                 type: string
 *                 example: "12:00"
 *     responses:
 *       201:
 *         description: Kegiatan berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 */
router.get('/', activityController.getAllActivities);
router.post('/', verifyToken, checkRole(['ADMIN']), validateCreateActivity, activityController.createActivity);

/**
 * @openapi
 * /api/activities/{id}:
 *   get:
 *     tags: [Activities]
 *     summary: Detail kegiatan berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail kegiatan
 *       404:
 *         description: Aktivitas tidak ditemukan
 *   put:
 *     tags: [Activities]
 *     summary: Edit kegiatan (ADMIN only)
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endDate:
 *                 type: string
 *                 format: date
 *               endTime:
 *                 type: string
 *                 example: "12:00"
 *     responses:
 *       200:
 *         description: Kegiatan berhasil diperbarui
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Kegiatan tidak ditemukan
 *   delete:
 *     tags: [Activities]
 *     summary: Hapus kegiatan (ADMIN only)
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
 *         description: Kegiatan berhasil dihapus
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Kegiatan tidak ditemukan
 */
router.get('/:id', validateId, activityController.getActivityById);
router.put('/:id', verifyToken, checkRole(['ADMIN']), validateUpdateActivity, activityController.updateActivity);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), validateId, activityController.deleteActivity);

/**
 * @openapi
 * /api/activities/{activityId}/join:
 *   post:
 *     tags: [Activities]
 *     summary: Ikuti kegiatan (USER/ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Berhasil mengikuti kegiatan
 *       400:
 *         description: Sudah terdaftar di kegiatan ini
 *       401:
 *         description: Token tidak ditemukan
 */
router.post('/:activityId/join', verifyToken, activityController.joinActivity);

module.exports = router;
