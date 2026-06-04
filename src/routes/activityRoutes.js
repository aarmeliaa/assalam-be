const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validateCreateActivity, validateUpdateActivity, validateId } = require('../middlewares/validation');

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/:id', validateId, activityController.getActivityById);

// Protected routes - ADMIN only
router.post('/', verifyToken, checkRole(['ADMIN']), validateCreateActivity, activityController.createActivity);
router.put('/:id', verifyToken, checkRole(['ADMIN']), validateUpdateActivity, activityController.updateActivity);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), validateId, activityController.deleteActivity);

// Protected route - USER/ADMIN bisa join
router.post('/:activityId/join', verifyToken, activityController.joinActivity);

module.exports = router;
