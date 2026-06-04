const express = require('express');
const router = express.Router();
const { getHomepageData } = require('../controllers/homeController');

/**
 * @openapi
 * /api/home:
 *   get:
 *     tags: [Home]
 *     summary: Data homepage (berita terbaru + kegiatan mendatang)
 *     responses:
 *       200:
 *         description: Data homepage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HomepageData'
 */
router.get('/', getHomepageData);

module.exports = router;