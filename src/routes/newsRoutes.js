const express = require('express');
const router = express.Router();
const { createNews, getAllNews, updateNews, deleteNews, getNewsById } = require('../controllers/newsController');
const { upload } = require('../middlewares/upload');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validateCreateNews, validateUpdateNews, validateId } = require('../middlewares/validation');

// Public routes
router.get('/', getAllNews);
router.get('/:id', validateId, getNewsById);

// Protected routes - ADMIN only
router.post('/', verifyToken, checkRole(['ADMIN']), validateCreateNews, upload.single('image'), createNews);
router.put('/:id', verifyToken, checkRole(['ADMIN']), validateUpdateNews, upload.single('image'), updateNews);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), validateId, deleteNews);

module.exports = router;