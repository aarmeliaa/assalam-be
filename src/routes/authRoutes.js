const express = require('express');
const router = express.Router();
const { googleAuth, refreshAccessToken, logout, deleteAccount } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const { validateGoogleAuth } = require('../middlewares/validation');

router.post('/google', validateGoogleAuth, googleAuth);
router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyToken, logout);
router.delete('/account', verifyToken, deleteAccount);

module.exports = router;