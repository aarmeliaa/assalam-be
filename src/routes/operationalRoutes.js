const express = require('express');
const router = express.Router();
const operationalController = require('../controllers/operationalController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Public routes
router.get('/', operationalController.getAllSchedules);
router.get('/:id', operationalController.getOperationalHourById);

// Protected routes - ADMIN only
router.post('/', verifyToken, checkRole(['ADMIN']), operationalController.addSchedule);
router.put('/:id', verifyToken, checkRole(['ADMIN']), operationalController.updateSchedule);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), operationalController.deleteSchedule);

module.exports = router;