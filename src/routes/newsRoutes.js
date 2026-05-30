const express = require('express');
const router = express.Router();
const { createNews, getAllNews, updateNews, deleteNews, getNewsById } = require('../controllers/newsController');
const { upload } = require('../middlewares/upload');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Protected routes - ADMIN only
router.post('/', verifyToken, checkRole(['ADMIN']), upload.single('image'), createNews);
router.put('/:id', verifyToken, checkRole(['ADMIN']), upload.single('image'), updateNews);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), deleteNews);

module.exports = router;