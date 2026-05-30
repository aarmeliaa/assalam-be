const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivityById);

// Protected routes - ADMIN only
router.post('/', verifyToken, checkRole(['ADMIN']), activityController.createActivity);
router.put('/:id', verifyToken, checkRole(['ADMIN']), activityController.updateActivity);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), activityController.deleteActivity);

// Protected route - USER/ADMIN bisa join
router.post('/:activityId/join', verifyToken, activityController.joinActivity);

module.exports = router;