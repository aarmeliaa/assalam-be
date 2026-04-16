const express = require('express');
const router = express.Router();
const { createNews, getAllNews, updateNews, deleteNews } = require('../controllers/newsController');

const { upload } = require('../middlewares/upload');

router.get('/', getAllNews);
router.post('/', upload.single('image'), createNews);
router.put('/:id', upload.single('image'), updateNews);
router.delete('/:id', deleteNews);

module.exports = router;