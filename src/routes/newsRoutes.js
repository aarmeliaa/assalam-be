const express = require('express');
const router = express.Router();
const { createNews, getAllNews, updateNews, deleteNews, getNewsById } = require('../controllers/newsController');
const { upload } = require('../middlewares/upload');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validateCreateNews, validateUpdateNews, validateId } = require('../middlewares/validation');

/**
 * @openapi
 * /api/news:
 *   get:
 *     tags: [News]
 *     summary: Daftar semua berita
 *     responses:
 *       200:
 *         description: Berhasil mengambil data berita
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
 *                     $ref: '#/components/schemas/News'
 *   post:
 *     tags: [News]
 *     summary: Buat berita baru (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul berita (3-200 karakter)
 *               content:
 *                 type: string
 *                 description: Konten berita (minimal 10 karakter)
 *               summary:
 *                 type: string
 *                 description: Ringkasan berita (maks 500 karakter)
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *                 default: DRAFT
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar berita (maks 5MB)
 *     responses:
 *       201:
 *         description: Berita berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 */
router.get('/', getAllNews);
router.post('/', verifyToken, checkRole(['ADMIN']), validateCreateNews, upload.single('image'), createNews);

/**
 * @openapi
 * /api/news/{id}:
 *   get:
 *     tags: [News]
 *     summary: Detail berita berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID berita
 *     responses:
 *       200:
 *         description: Detail berita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: Berita tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [News]
 *     summary: Edit berita (ADMIN only)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               summary:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Berita berhasil diperbarui
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Berita tidak ditemukan
 *   delete:
 *     tags: [News]
 *     summary: Hapus berita (ADMIN only)
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
 *         description: Berita berhasil dihapus
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Berita tidak ditemukan
 */
router.get('/:id', validateId, getNewsById);
router.put('/:id', verifyToken, checkRole(['ADMIN']), validateUpdateNews, upload.single('image'), updateNews);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), validateId, deleteNews);

module.exports = router;