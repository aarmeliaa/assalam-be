const express = require('express');
const router = express.Router();
const { getMosqueLocations } = require('../controllers/locationController');

/**
 * @openapi
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: Daftar lokasi masjid
 *     responses:
 *       200:
 *         description: Berhasil mengambil data lokasi
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
 *                     $ref: '#/components/schemas/MosqueLocation'
 */
router.get('/', getMosqueLocations);

module.exports = router;