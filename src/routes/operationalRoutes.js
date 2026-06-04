const express = require('express');
const router = express.Router();
const operationalController = require('../controllers/operationalController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validateCreateOperationalHour, validateId } = require('../middlewares/validation');

// Public routes
router.get('/', operationalController.getAllSchedules);
router.get('/:id', validateId, operationalController.getOperationalHourById);

// Protected routes - ADMIN only
router.post('/', verifyToken, checkRole(['ADMIN']), validateCreateOperationalHour, operationalController.addSchedule);
router.put('/:id', verifyToken, checkRole(['ADMIN']), validateId, operationalController.updateSchedule);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), validateId, operationalController.deleteSchedule);

module.exports = router;